import {Logger, Module} from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import UserAuth from "./entities/user.entity";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {AuthService} from "./service/auth.service";
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { TokenService } from './service/token.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserAuth]),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_KEY}`,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, TokenService, Logger],
  exports: [UserService, TokenService],
})
export class UserModule {}
