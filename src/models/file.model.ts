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
export class File {
  @Prop({ ref: () => User, required: true })
  user: Ref<User>;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  folder: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  url: string;
}

// types
export type FileModel = ReturnModelType<typeof File>;
export type FileDocument = DocumentType<File>;

// register model in global container
modelFactory(File.name, File);
