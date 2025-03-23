import {Logger, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import UserAuth from "./entities/user.entity";
import {MikroOrmModule} from "@mikro-orm/nestjs";

@Module({
  imports: [
    MikroOrmModule.forFeature([UserAuth]),
  ],
  controllers: [UserController],
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {}
