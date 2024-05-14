import { RoleEnum } from '@/constants';
import { modelFactory } from '@/database';
import { passwordHash } from '@/lib/utils';
import {
  Pre,
  Prop,
  ModelOptions,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';

// middleware decorator
@Pre<User>('save', function (next) {
  if (this.password) {
    if (!this?.isModified('password')) return next();
    this.password = passwordHash(this.password);
  }
  next();
})
@ModelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  fullname?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, default: RoleEnum.USER, enum: RoleEnum })
  role: RoleEnum;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  is_blocked: boolean;

  @Prop({ default: false })
  is_active: boolean;
}

// types
export type UserModel = ReturnModelType<typeof User>;
export type UserDocument = DocumentType<User>;

// register model in global container
modelFactory(User.name, User);
