import {
  EnrollmentStatus,
  PaymentStatus,
} from '../../../generated/prisma/enums';
import config from '../../config';
import { getGrantToken } from '../../lib/bkash';
import { prisma } from '../../lib/prisma';
import { RequestUser } from '../../middleWear/auth';
import { parseBkashDate } from '../../utils/parseBikashDate';
import { AppError } from '../../utils/AppError';

const bkashHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  authorization: `${token}`,
  'x-app-key': config.bkash_api_key,
});

const checkoutPayment = async (id: string, user: RequestUser) => {
  const enrol = await prisma.enrollment.findUniqueOrThrow({
    where: { id },
    include: { payments: true, student: true, courseOffering: true },
  });

  // only the student who owns the enrollment can pay for it
  if (enrol.student.userId !== user.userId) {
    throw new AppError(403, 'forbidden access: this enrollment is not yours');
  }
  if (enrol.status === EnrollmentStatus.CANCELLED) {
    throw new AppError(409, 'this enrollment is cancelled');
  }
  if (
    enrol.status === EnrollmentStatus.CONFIRMED ||
    enrol.payments?.status === PaymentStatus.PAID
  ) {
    throw new AppError(409, 'this enrollment is already paid');
  }

  const grantToken = await getGrantToken();
  if (!grantToken) {
    throw new AppError(500, 'grnat token is not found');
  }

  // One payment row per enrollment. A new attempt reuses the row, so a
  // student can retry after a failed, cancelled or abandoned payment.
  const attempt = {
    amount: enrol.courseOffering.fee,
    payerReference: user.email,
    status: PaymentStatus.UNPAID,
    merchantInvoiceNumber: null,
    bkashPaymentId: null,
    bkashTrxId: null,
  };
  let paymentId: string;
  if (enrol.payments) {
    const { count } = await prisma.payment.updateMany({
      where: { id: enrol.payments.id, status: { not: PaymentStatus.PAID } },
      data: attempt,
    });
    if (count === 0) {
      throw new AppError(409, 'this enrollment is already paid');
    }
    paymentId = enrol.payments.id;
  } else {
    const created = await prisma.payment.upsert({
      where: { enrollmentId: enrol.id },
      update: attempt,
      create: { enrollmentId: enrol.id, ...attempt },
    });
    paymentId = created.id;
  }

  // bKash call happens outside any database transaction (a slow gateway
  // must not hit the transaction timeout)
  const res = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/create`,
    {
      method: 'POST',
      headers: bkashHeaders(grantToken),
      body: JSON.stringify({
        mode: '0011',
        payerReference: user.email,
        callbackURL: `${config.call_back_url}/checkout/callback`,
        amount: `${enrol.courseOffering.fee}`,
        currency: 'BDT',
        intent: 'sale',
        // unique per attempt, the row id stays the same
        merchantInvoiceNumber: `${paymentId}-${Date.now().toString(36)}`,
      }),
    },
  );
  const result = await res.json().catch(() => null);

  // bKash answers errors with a normal JSON body, never store those as PENDING
  if (!res.ok || !result || result.statusCode !== '0000' || !result.paymentID) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: result ?? { error: 'invalid gateway response' },
      },
    });
    throw new AppError(
      500,
      `bKash could not start the payment${result?.statusMessage ? `: ${result.statusMessage}` : ''}`,
    );
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      merchantInvoiceNumber: result.merchantInvoiceNumber,
      bkashPaymentId: result.paymentID,
      gatewayResponse: result,
      status: PaymentStatus.PENDING,
    },
  });

  return result;
};


const checkoutCallBack = async (query: Record<string, any>) => {
  const paymentId = query.paymentID;
  const status = query.status;

  

  // Validate callback parameters
  if (typeof paymentId !== 'string' || !paymentId) {
    throw new AppError(400, 'Valid paymentID is required');
  }

  if (
    typeof status !== 'string' ||
    !['success', 'failure', 'cancel'].includes(status)
  ) {
    throw new AppError(400, 'Invalid payment status');
  }

  // Redirect to the frontend
  const redirect = (path: string) => ({
    redirectUrl: `${config.app_url}/student/${path}`,
  });

  // Find payment using the bKash payment ID
  const payment = await prisma.payment.findUnique({
    where: {
      bkashPaymentId: paymentId,
    },
  });


  
  // Payment record not found
  if (!payment) {
    console.error('Payment record not found for bKash callback', {
      paymentId,
      status,
    });

    return redirect('failures?status=failure&reason=payment_not_found');
  }

  // Prevent modifying an already completed payment
  if (payment.status === PaymentStatus.PAID) {
    return redirect('success?status=success');
  }

  // Handle failure and cancellation
  if (status === 'failure' || status === 'cancel') {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status:
          status === 'failure'
            ? PaymentStatus.FAILED
            : PaymentStatus.CANCELLED,
      },
    });

    return status === 'failure'
      ? redirect('failures?status=failure')
      : redirect('cancel?status=cancel');
  }

  // Get bKash grant token
  const grantToken = await getGrantToken();

  if (!grantToken) {
    throw new AppError(500, 'bKash grant token is missing');
  }

  // Execute payment
  const response = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: 'POST',
      headers: bkashHeaders(grantToken),
      body: JSON.stringify({
        paymentID: paymentId,
      }),
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result) {
    console.error('bKash execute request failed', {
      paymentId,
      httpStatus: response.status,
      result,
    });

    return redirect('failures?status=failure');
  }

  const isPaymentSuccess =
    result.statusCode === '0000' &&
    result.transactionStatus === 'Completed' &&
    Boolean(result.trxID);

  // Payment execution failed
  if (!isPaymentSuccess) {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: result,
      },
    });

    return redirect('failures?status=failure');
  }

  // Update payment and enrollment atomically
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.PAID,
        bkashTrxId: result.trxID,
        paidAt: result.paymentExecuteTime
          ? parseBkashDate(result.paymentExecuteTime)
          : new Date(),
        gatewayResponse: result,
      },
    });

    await tx.enrollment.update({
      where: {
        id: payment.enrollmentId,
      },
      data: {
        status: EnrollmentStatus.CONFIRMED,
      },
    });
  });

  return redirect('success?status=success');
};




export const paymentService = {
  checkoutPayment,
  checkoutCallBack,
};
