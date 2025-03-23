import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherClassDto } from './create-teacher_class.dto';

export class UpdateTeacherClassDto extends PartialType(CreateTeacherClassDto) {}
