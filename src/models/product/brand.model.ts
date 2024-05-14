import { modelFactory } from '@/database';
import {
  Prop,
  ModelOptions,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Brand {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  img: string;

  @Prop({ default: true })
  status: boolean;
}

// types
export type BrandModel = ReturnModelType<typeof Brand>;
export type BrandDocument = DocumentType<Brand>;

// register model in global container
modelFactory(Brand.name, Brand);
