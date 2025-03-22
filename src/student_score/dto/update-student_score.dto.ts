import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentScoreDto } from './create-student_score.dto';

export class UpdateStudentScoreDto extends PartialType(CreateStudentScoreDto) {}
