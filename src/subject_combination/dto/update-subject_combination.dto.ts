import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectCombinationDto } from './create-subject_combination.dto';

export class UpdateSubjectCombinationDto extends PartialType(CreateSubjectCombinationDto) {}
