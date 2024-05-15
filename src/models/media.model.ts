import { modelFactory } from '@/database';
import {
  Prop,
  Ref,
  ModelOptions,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';
import { User } from './auth';

@ModelOptions({
  schemaOptions: { timestamps: true },
})
export class Media {
  @Prop({ ref: () => User, required: true })
  user: Ref<User>;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  url: string;
}

// types
export type MediaModel = ReturnModelType<typeof Media>;
export type MediaDocument = DocumentType<File>;

// register model in global container
modelFactory(Media.name, Media);
