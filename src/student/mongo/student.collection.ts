import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AutoMap } from '@automapper/classes';


@Schema({collection: "student_backup_version", autoCreate: true})
export class StudentCollection {
  @AutoMap() @Prop({ type: mongoose.Schema.Types.BigInt, indexes: true }) userId: number
  @AutoMap() @Prop({type: String}) citizenIdCode: string
  @AutoMap() @Prop({type: String}) firstName: string
  @AutoMap() @Prop({type: String}) midName: string
  @AutoMap() @Prop({type: String}) lastName: string
  @AutoMap() @Prop({type: String}) dob: Date
  @AutoMap() @Prop({type: String}) gender: string
  @AutoMap() @Prop({type: String}) nationality: string = "vi"
  @AutoMap() @Prop({type: String}) pob: string
  @AutoMap() @Prop({type: String}) address: string
  @AutoMap() @Prop({type: Number}) educationLevel: number
  @Prop({type: Date, required: false}) admissionDate: Date | null;
  @Prop({type: Date, required: false}) graduationDate: Date | null;
  @AutoMap() @Prop({type: Number}) version: number
}

export const StudentSchema = SchemaFactory.createForClass(StudentCollection)