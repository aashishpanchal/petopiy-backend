import { Media, MediaModel } from '@/models';
import { inject, singleton } from 'tsyringe';
import { BadRequestError } from '@/lib/errors';
import { S3Bucket } from './helpers/s3.helper';
import { GetSignedUrlDto, UpdateMediaDto } from './media.dtos';

@singleton()
export class MediaService {
  constructor(
    @inject(Media.name)
    private mediaModel: MediaModel,
    private s3bucket: S3Bucket,
  ) {}

  async getSignedUrl(
    user: string,
    { key, mimetype, size, name }: GetSignedUrlDto,
  ) {
    // generate a signed url for the file
    const signedUrl = await this.s3bucket.putObject(key, mimetype, size);
    // create a new media object
    const media = await this.mediaModel.create({
      user,
      key,
      name,
      size,
      mimetype,
      url: signedUrl.split('?')[0],
    });
    // return the media object
    return {
      url: signedUrl,
      id: media._id,
    };
  }

  async getMedia(user: string, id: string) {
    const media = await this.mediaModel.findOne({ _id: id, user });
    // check if media is not present
    if (!media) throw new BadRequestError('media file not found');
    // return the media object
    return media;
  }

  async updateSignedUrl(
    user: string,
    id: string,
    { mimetype, size, name }: UpdateMediaDto,
  ) {
    const media = await this.getMedia(user, id);
    // generate a signed url for the file
    const signedUrl = await this.s3bucket.updateObject(
      media.url,
      mimetype,
      size,
    );
    // update media object
    media.name = name;
    media.size = size;
    media.mimetype = mimetype;
    // save changes
    await media.save();
    // return the media object
    return {
      url: signedUrl,
      id: media._id,
    };
  }

  async deleteMedia(user: string, id: string) {
    const media = await this.getMedia(user, id);
    // delete media in s3 bucket
    await this.s3bucket.deleteObject(media.url);
    // delete media
    await this.mediaModel.deleteOne({ _id: id });
    // return media
    return media;
  }
}
