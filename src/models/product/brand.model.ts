import { modelFactory } from '@/database';
import {
  Prop,
  ModelOptions,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Media } from '../media.model';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Brand {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ ref: () => Media })
  img: Media;

  @Prop()
  description: string;

  @Prop({ default: true })
  status: boolean;
}

// types
export type BrandModel = ReturnModelType<typeof Brand>;
export type BrandDocument = DocumentType<Brand>;

// register model in global container
modelFactory(Brand.name, Brand);
