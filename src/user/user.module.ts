import {Logger, Module} from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import UserAuth from "./entities/user.entity";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {AuthService} from "./service/auth.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([UserAuth]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, Logger],
  exports: [UserService],
})
export class UserModule {}
