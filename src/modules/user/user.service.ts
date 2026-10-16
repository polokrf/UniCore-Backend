import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../../lib/cloudinary';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';

const updateUserPhoto = async (buffer: Buffer, userId: string) => {
  const existUserImageUrl = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      image: true,
      imagePublicId: true,
    },
  });

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
          },
          (error: any, result) => {
            if (error) {
              console.log(error);
              return reject(error);
            }

            if (!result) {
              return reject(new Error('image file dose not upload'));
            }

            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  // console.log(cloudinaryResult)

  const uploadImage = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
    },
    omit: {
      password: true,
    },
  });

  if (existUserImageUrl?.image && existUserImageUrl.imagePublicId) {
    await cloudinary.uploader.destroy(existUserImageUrl.imagePublicId);
  }

  return uploadImage;
};
const updateUserStatus = async (payload: { status: string }, id: string) => {
  const isActive = payload.status === 'Active' ? true : false;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.isActive === isActive) {
    throw new AppError(409, `this account already ${payload.status}`);
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: isActive,
    },
  });

  return result;
};

export const userService = {
  updateUserPhoto,
  updateUserStatus,
};
