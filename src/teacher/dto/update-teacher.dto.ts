import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
   citizenIdCode: string
   firstName: string
   midName: string
   lastName: string
   dob: Date
   gender: string
   nationality: string = "vi"
   pob: string
   address: string
   educationLevel: number
   contractNumber: string
   subject: string
}
