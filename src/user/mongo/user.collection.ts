import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({collection: "user_auth", autoCreate: true })
export class UserAuthCollection  {
  @Prop({ type: mongoose.Schema.Types.BigInt, indexes: true }) userAuthId: number;
  @Prop({ type: String }) fullname: string;
  @Prop({ type: String }) email: string;
  @Prop({ type: String }) rawPassword: string;
}

export const UserAuthSchema = SchemaFactory.createForClass(UserAuthCollection)