import fs from 'fs';
import { config } from '@/config';
import { singleton } from 'tsyringe';
import { BadRequestError } from '@/lib/errors';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@singleton()
export class S3 {
  readonly #url = `https://${config.S3.BUCKET}.s3.${config.S3.REGION}.amazonaws.com/`;
  readonly #s3 = new S3Client({
    region: config.S3.REGION,
    credentials: {
      accessKeyId: config.S3.ACCESS_KEY,
      secretAccessKey: config.S3.SECRET_KEY,
    },
  });

  async upload(folder: string, file: Express.Multer.File) {
    // create stream
    const stream = fs.createReadStream(file.path);
    // key
    const key = `${folder}/${file.filename}`;
    // upload file on bucket
    const command = new PutObjectCommand({
      Key: key,
      Body: stream,
      Bucket: config.S3.BUCKET,
      ContentType: file.mimetype,
    });

    try {
      await this.#s3.send(command);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    } finally {
      fs.unlinkSync(file.path);
    }

    return this.#url.concat(key);
  }

  async delete(url: string) {
    // get key
    const key = url.split(this.#url)[1];
    // delete file on bucket
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: config.S3.BUCKET,
    });
    try {
      return await this.#s3.send(command);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async update(oldUrl: string, file: Express.Multer.File) {
    // get key
    const key = oldUrl.split(this.#url)[1];
    console.log(key);
    // create stream
    const stream = fs.createReadStream(file.path);
    // upload file on bucket
    const command = new PutObjectCommand({
      Key: key,
      Body: stream,
      Bucket: config.S3.BUCKET,
      ContentType: file.mimetype,
    });

    try {
      await this.#s3.send(command);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    } finally {
      fs.unlinkSync(file.path);
    }

    return this.#url.concat(key);
  }
}
