import {Logger, Module} from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import UserAuth from "./entities/user.entity";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {AuthService} from "./service/auth.service";
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { TokenService } from './service/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAuthCollection, UserAuthSchema } from './mongo/user.collection';
import { TokenBlacklistCollection, TokenBlacklistSchema } from './mongo/token-blacklist.collection';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserAuth]),
    MongooseModule.forFeature([
      { name: UserAuthCollection.name, schema: UserAuthSchema },
      { name: TokenBlacklistCollection.name, schema: TokenBlacklistSchema}
    ]),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_KEY}`,
      signOptions: { expiresIn: '60s' },
    }),
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, TokenService, Logger],
  exports: [UserService, AuthService, TokenService],
})
export class UserModule {}
