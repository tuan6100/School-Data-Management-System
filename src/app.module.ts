import { Module, Logger } from '@nestjs/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import {MikroOrmModule} from "@mikro-orm/nestjs";
import { ClassModule } from './class/class.module';
import {AppService} from "./app.service";
import { SubjectCombinationModule } from './subject_combination/subject_combination.module';
import { StudentClassModule } from './student_class/student_class.module';
import { TeacherClassModule } from './teacher_class/teacher_class.module';
import { StudentScoreModule } from './student_score/student_score.module';
import {AutomapperModule} from "@automapper/nestjs";
import {classes} from "@automapper/classes";
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

@Module({
  imports: [
      MikroOrmModule.forRoot({
          driver: PostgreSqlDriver,
          dbName: 'high_school_db',
          user: 'tuan',
          password: '20226100',
          entities: ['dist/**/*.entity.js'],
          entitiesTs: ['src/**/*.entity.ts'],
          debug: true,
          highlighter: new SqlHighlighter(),

      }),
      AutomapperModule.forRoot({
          strategyInitializer: classes(),
      }),
      StudentModule,
      TeacherModule,
      UserModule,
      ClassModule,
      SubjectCombinationModule,
      StudentClassModule,
      TeacherClassModule,
      StudentScoreModule,
      ],
  controllers: [],
  providers: [AppService, Logger],
})
export class AppModule {}
