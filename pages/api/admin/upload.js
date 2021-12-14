import nextConnect from 'next-connect';
import { isAuth, isAdmin } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// by having this config, with nextConnect import, we can upload
// "multipart/form-data" type to this api
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect({ onError });
const upload = multer();

handler.use(isAuth, isAdmin, upload.single('file')).post(async (req, res) => {
  //to upload file
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      //uploading file FROM FRONT-END USING MULTER TO CLOUDINARY
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

export default handler;
