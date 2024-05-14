import { Request } from 'express';
import { singleton } from 'tsyringe';
import { ApiRes } from '@/lib/response';
import { UploadFileDto } from './bucket.dtos';
import { BucketService } from './bucket.service';

@singleton()
export class BucketController {
  constructor(private bucketService: BucketService) {}

  async upload(req: Request<any, any, any, UploadFileDto>) {
    const { folder } = req.query;
    // upload image on bucket
    const data = await this.bucketService.upload(req.user.id, folder, req.file);
    // return response
    return ApiRes.ok(data, 'File upload successfully');
  }

  async update(req: Request) {
    const { id } = req.params;
    // update file on bucket
    const data = await this.bucketService.update(req.user.id, id, req.file);
    // return response
    return ApiRes.ok(data, 'File update successfully');
  }

  async delete(req: Request) {
    const { id } = req.params;
    // delete file on bucket
    const data = await this.bucketService.delete(req.user.id, id);
    // return response
    return ApiRes.ok(data, 'File deleted successfully');
  }
}
