import { config } from '@/config';
import { singleton } from 'tsyringe';
import { BadRequestError } from '@/lib/errors';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@singleton()
export class S3Bucket {
  readonly bucket = config.S3.BUCKET;
  readonly #url = `https://${config.S3.BUCKET}.s3.${config.S3.REGION}.amazonaws.com/`;
  readonly #s3 = new S3Client({
    region: config.S3.REGION,
    credentials: {
      accessKeyId: config.S3.ACCESS_KEY,
      secretAccessKey: config.S3.SECRET_KEY,
    },
  });

  async putObject(key: string, mimetype: string, size: number) {
    // get type of file
    const type = mimetype.split('/')[1];
    // create unique name of file
    const filename = `${crypto.randomUUID().replaceAll('-', '')}-${new Date().getTime()}.${type}`;
    // make command
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `${key}/${filename}`,
      ContentLength: size,
      ContentType: mimetype,
    });
    // get url
    try {
      return await getSignedUrl(this.#s3, command, {
        expiresIn: 60,
      });
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async updateObject(url: string, mimetype: string, size: number) {
    // get key
    const key = url.split(this.#url)[1];
    // make command
    const command = new PutObjectCommand({
      Key: key,
      Bucket: this.bucket,
      ContentLength: size,
      ContentType: mimetype,
    });
    // get url
    try {
      return await getSignedUrl(this.#s3, command, {
        expiresIn: 60,
      });
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async deleteObject(url: string) {
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
}
