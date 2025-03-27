import { Logger, Module } from '@nestjs/common';
import { TeacherService } from './service/teacher.service';
import { TeacherController } from './controller/teacher.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Student } from '../student/entities/student.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Student]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
  controllers: [TeacherController],
  providers: [TeacherService, Logger],
})
export class TeacherModule {}
