import {Logger, Module} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Student} from "./entities/student.entity";
import {UserModule} from "../user/user.module";
import {AutomapperModule} from "@automapper/nestjs";
import {classes} from "@automapper/classes";

@Module({
  imports: [
    MikroOrmModule.forFeature([Student]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, Logger],
})
export class StudentModule {}
