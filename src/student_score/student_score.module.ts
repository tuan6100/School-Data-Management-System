import { Module } from '@nestjs/common';
import { StudentScoreService } from './student_score.service';
import { StudentScoreController } from './student_score.controller';

@Module({
  controllers: [StudentScoreController],
  providers: [StudentScoreService],
})
export class StudentScoreModule {}
