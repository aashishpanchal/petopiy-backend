import { User } from './user.model';
import {
  Prop,
  type Ref,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';
import { modelFactory } from '@/database';

export class Token {
  @Prop({ ref: () => User, required: true })
  user: Ref<User>;

  @Prop({ required: true, unique: true })
  jti: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  is_block: boolean;

  @Prop()
  expires_at?: Date;

  @Prop()
  blocked_at?: Date;
}

// types
export type TokenModel = ReturnModelType<typeof Token>;
export type TokenDocument = DocumentType<Token>;

// register model in global container
modelFactory(Token.name, Token);
