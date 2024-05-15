import { Request } from 'express';
import { singleton } from 'tsyringe';
import { ApiRes } from '@/lib/response';
import { MediaService } from './media.service';
import { GetSignedUrlDto, UpdateMediaDto } from './media.dtos';

@singleton()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  async create(req: Request<any, any, GetSignedUrlDto>) {
    // get body from request
    const body = req.body;
    // get signed url
    const data = await this.mediaService.getSignedUrl(req.user.id, body);
    // return signed url information
    return ApiRes.created(data, 'Signed url created successfully');
  }

  async get(req: Request) {
    const { id } = req.params;
    // get signed url
    const data = await this.mediaService.getMedia(req.user.id, id);
    // return signed url information
    return ApiRes.ok(data, 'Media retrieved successfully');
  }

  async update(req: Request<any, any, UpdateMediaDto>) {
    const body = req.body;
    const { id } = req.params;
    // update file on media
    const data = await this.mediaService.updateSignedUrl(req.user.id, id, body);
    // return response
    return ApiRes.created(data, 'Signed update url created successfully');
  }

  async delete(req: Request) {
    const { id } = req.params;
    // delete file on bucket
    const data = await this.mediaService.deleteMedia(req.user.id, id);
    // return response
    return ApiRes.ok(data, 'Media deleted successfully');
  }
}
