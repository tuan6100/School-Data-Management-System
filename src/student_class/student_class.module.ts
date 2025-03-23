import { Module } from '@nestjs/common';
import { StudentClassService } from './student_class.service';
import { StudentClassController } from './student_class.controller';

@Module({
  controllers: [StudentClassController],
  providers: [StudentClassService],
})
export class StudentClassModule {}
