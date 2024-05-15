import { modelFactory } from '@/database';
import {
  Prop,
  type Ref,
  DocumentType,
  ReturnModelType,
  ModelOptions,
} from '@typegoose/typegoose';
import { Media } from '../media.model';

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Category {
  @Prop({ ref: () => Category })
  parent: Ref<Category>;

  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ ref: () => Media })
  img: Media;

  @Prop({ default: true })
  status: boolean;
}

// types
export type CategoryModel = ReturnModelType<typeof Category>;
export type CategoryDocument = DocumentType<Category>;

// register model in global container
modelFactory(Category.name, Category);
