import { Module } from '@nestjs/common';
import { SubjectCombinationService } from './subject_combination.service';
import { SubjectCombinationController } from './subject_combination.controller';

@Module({
  controllers: [SubjectCombinationController],
  providers: [SubjectCombinationService],
})
export class SubjectCombinationModule {}
