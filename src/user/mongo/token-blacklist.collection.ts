import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({collection: "token_blacklist", autoCreate: true})
export class TokenBlacklistCollection {
  @Prop({type: mongoose.Schema.Types.BigInt, index: true}) userAuthId: number;
  @Prop({type: [String]}) revokedRefreshToken: string[];
  @Prop({type: Date}) expiresAt: Date;
}

export const TokenBlacklistSchema = SchemaFactory.createForClass(TokenBlacklistCollection);

TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });