import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentClassDto } from './create-student_class.dto';

export class UpdateStudentClassDto extends PartialType(CreateStudentClassDto) {}
