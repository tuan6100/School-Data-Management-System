import {EntityManager} from "@mikro-orm/postgresql"
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import UserAuth from '../entities/user.entity'
import { encryptEmail, encryptPassword } from '../user.util'
import { LoginDto } from '../dto/login.dto'
import { TokenService } from './token.service'
import { JwtService } from '@nestjs/jwt'
import { RoleName } from '../enum/role.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly em: EntityManager,
        private readonly tokenProviderService: TokenService,
        private readonly jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const encryptedEmail = encryptEmail(loginDto.email)
        console.info("email: ", encryptedEmail)
        console.info("password: ", loginDto.password)
        // const encryptedPassword = await encryptPassword(loginDto.password)
        const user = await this.em.findOne(
          UserAuth, {
              email: encryptedEmail,
              // password: encryptedPassword
              password: loginDto.password
          })
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenProviderService.generateAccessToken(loginDto.email, RoleName[user.role], user.userAuthId),
            this.tokenProviderService.generateRefreshToken(loginDto.email, RoleName[user.role], user.userAuthId)
        ])
        return { accessToken, refreshToken }
    }

    async refreshToken(token: string): Promise<{ accessToken: string }> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_KEY || process.env.JWT_KEY
            })
            if (payload.tokenType !== 'refresh') {
                new ForbiddenException('Invalid token type')
            }
            const user = await this.em.findOne(
              UserAuth, { 
                  userAuthId: payload.sub
              })
            if (!user) {
                new UnauthorizedException('User no longer exists')
            }
            const accessToken = await this.tokenProviderService.generateAccessToken(
              payload.email,
              payload.role,
              payload.sub
            )
            return { accessToken }
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error
            }
            throw new UnauthorizedException('Invalid refresh token')
        }
    }

    private async generateAccessToken(email: any, role: any, sub: any) {
        
    }
}