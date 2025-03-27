import {Logger, Module} from '@nestjs/common';
import { StudentService } from './service/student.service';
import { StudentController } from './controller/student.controller';
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Student} from "./entities/student.entity";
import {UserModule} from "../user/user.module";
import {AutomapperModule} from "@automapper/nestjs";
import {classes} from "@automapper/classes";
import { MongooseModule } from '@nestjs/mongoose';
import { StudentCollection, StudentSchema } from './mongo/student.collection';

@Module({
  imports: [
    MikroOrmModule.forFeature([Student]),
    MongooseModule.forFeature([
      { name: StudentCollection.name, schema: StudentSchema }
    ]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, Logger],
})
export class StudentModule {}
