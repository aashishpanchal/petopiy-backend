import fs from 'fs';
import { S3 } from './utils/s3.utils';
import { File, FileModel } from '@/models';
import { inject, singleton } from 'tsyringe';
import { BadRequestError } from '@/lib/errors';

@singleton()
export class BucketService {
  constructor(
    private s3: S3,
    @inject(File.name) private fileModel: FileModel,
  ) {}

  async upload(user: string, folder: string, file: Express.Multer.File) {
    // check if file is not present
    if (!file) throw new BadRequestError('No file found in request');
    // upload file in s3 bucket
    const url = await this.s3.upload(folder, file);
    // create file
    return this.fileModel.create({
      url,
      user,
      folder,
      size: file.size,
      type: file.mimetype,
      name: file.originalname,
    });
  }

  async update(user: string, id: string, file: Express.Multer.File) {
    // check if file is not present
    if (!file) throw new BadRequestError('No file found in request');
    // get file
    const fileDb = await this.fileModel.findOne({ _id: id, user });
    // check if file is not present
    if (!fileDb) {
      fs.unlinkSync(file.path);
      throw new BadRequestError('File not found');
    }
    // update file in s3 bucket
    await this.s3.update(fileDb.url, file);
    // update file
    fileDb.size = file.size;
    fileDb.type = file.mimetype;
    fileDb.name = file.originalname;
    // save updates
    return fileDb.save();
  }

  async delete(user: string, id: string) {
    // get file
    const file = await this.fileModel.findOne({ _id: id, user });
    // check if file is not present
    if (!file) throw new BadRequestError('File not found');
    // delete file in s3 bucket
    await this.s3.delete(file.url);
    await this.fileModel.deleteOne({ _id: id });
    // delete file
    return file;
  }
}
