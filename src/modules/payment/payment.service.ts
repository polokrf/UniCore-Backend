import { isPrimary } from "node:cluster";
import { EnrollmentStatus, PaymentStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { getGrantToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleWear/auth";
import { parseBkashDate } from "../../utils/parseBikashDate";

const checkoutPayment = async (id:string,user:RequestUser) => {
  const payment = await prisma.$transaction(async(tsx) => {
    const grantToken = await getGrantToken();

    if (!grantToken) {
      throw new Error('grnat token is not found')
    }

    const enrol = await tsx.enrollment.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        payments:true
      }
    })

    if (enrol.payments) {
      throw new Error('this payment already exits')
    }

    const courseOffering = await tsx.courseOffering.findUniqueOrThrow({
      where: {
        id:enrol.courseOfferingId
      }
    })

    const createPayment = await tsx.payment.create({
      data: {
        enrollmentId: enrol.id,
        amount: courseOffering.fee,
        payerReference:user.email
      }
    })

    const res = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authorization: `${grantToken}`,
          'x-app-key': config.bkash_api_key,
        },
        body: JSON.stringify({
          mode: '0011',
          payerReference: createPayment.payerReference,
          callbackURL: `${config.call_back_url}/checkout/callback`,
          amount: `${createPayment.amount}`,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: createPayment.id,
        }),
      },
    );


    const result = await res.json()

    await tsx.payment.update({
      where: {
        id: createPayment.id,
      },
      data: {
        merchantInvoiceNumber: result.merchantInvoiceNumber,
        bkashPaymentId: result.paymentID,
        gatewayResponse: result,
        status:PaymentStatus.PENDING
      },
    });

    return result
  })

  return payment
} 




const checkoutCallBack = async (query: Record<string, any>) => {
  const compPayment = await prisma.$transaction(async tsx => {
    const paymentId = query.paymentID;

    if (!paymentId) {
      throw new Error('paymentId is missing');
    }

    const status = query.status;
    if (!status) {
      throw new Error('paymentId is failed');
    }

    if (!['success', 'failure', 'cancel'].includes(status)) {
      throw new Error('Invalid payment status');
    }

    const grandToken = await getGrantToken();

    if (!grandToken) {
      throw new Error('grand token is missing');
    }

    const res = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/execute`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authorization: `${grandToken}`,
          'x-app-key': config.bkash_api_key,
        },
        body: JSON.stringify({
          paymentID: paymentId,
        }),
      },
    );

    if (!res.ok) {
      throw new Error('payment confirm response fail');
    }

    const result = await res.json();

    const isPaymentSuccess =
      result.statusCode === '0000' && result.transactionStatus === 'Completed';

    if (status === 'success') {
      if (!isPaymentSuccess) {
        throw new Error('Payment verification failed');
      }

      const isPayment = await tsx.payment.findFirstOrThrow({
        where: {
          id: result.merchantInvoiceNumber,
        },
        include: {
          enrollment: true,
        },
      });

      await tsx.enrollment.update({
        where: {
          id: isPayment.enrollment.id,
        },
        data: {
          status: EnrollmentStatus.CONFIRMED,
        },
      });

      await tsx.payment.update({
        where: {
          id: isPayment.id,
        },
        data: {
          status: PaymentStatus.PAID,
          bkashTrxId: result.trxID,
          paidAt: parseBkashDate(result.paymentExecuteTime),
          gatewayResponse: result,
        },
      });

      return {
        redirectUrl: `${config.app_url}/dashboard/enrolment/success?status=success`,
      };
    }

    if (status === 'failure') {
      await tsx.payment.update({
        where: {
          bkashPaymentId: result.paymentID,
        },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: result,
        },
      });

      return {
        redirectUrl: `${config.app_url}/dashboard/enrolment/failures?status=failure`,
      };
    }

    if (status === 'cancel') {
      await tsx.payment.update({
        where: {
          bkashPaymentId: result.paymentID,
        },
        data: {
          status: PaymentStatus.CANCELLED,
          gatewayResponse: result,
        },
      });

      return {
        redirectUrl: `${config.app_url}/dashboard/enrolment/cancel?status=cancel`,
      };
    }

    return {
      redirectUrl: `${config.app_url}/dashboard/enrolment?error=payment error`,
    };
  });

  return compPayment;
};




export const paymentService = {
  checkoutPayment,
  checkoutCallBack
}