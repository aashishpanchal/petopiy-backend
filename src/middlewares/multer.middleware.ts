import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { BadRequestError } from '@/lib/errors';

const destination = path.join(process.cwd(), 'public/upload');

const storage = multer.diskStorage({
  destination,
  filename(req, file, callback) {
    callback(
      null,
      `${crypto.randomUUID().replaceAll('-', '')}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const extension: boolean =
      ['.png', '.jpg', '.jpeg'].indexOf(
        path.extname(file.originalname).toLowerCase(),
      ) >= 0;

    const mimeType: boolean =
      ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) >= 0;

    if (extension && mimeType) {
      return callback(null, true);
    }

    callback(
      new BadRequestError(
        'Invalid file type. Only picture file on type PNG and JPG are allowed!',
      ),
    );
  },
});
