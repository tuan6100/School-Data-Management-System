import { Module } from '@nestjs/common';
import { TeacherClassService } from './teacher_class.service';
import { TeacherClassController } from './teacher_class.controller';

@Module({
  controllers: [TeacherClassController],
  providers: [TeacherClassService],
})
export class TeacherClassModule {}
