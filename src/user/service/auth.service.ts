import {EntityManager} from "@mikro-orm/postgresql"
import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import UserAuth from "../entities/user.entity"
import { encryptEmail } from "../utility/user.security.util";
import { LoginDto } from "../dto/login.dto"
import { TokenService } from "./token.service"
import { RoleName } from "../enum/role.enum";
import { verify } from "argon2";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { TokenBlacklistCollection } from "../mongo/token-blacklist.collection";
import { Model } from "mongoose";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {Cache} from "cache-manager"

@Injectable()
export class AuthService {

    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService,
        @InjectModel(TokenBlacklistCollection.name)
        private readonly tokenBlacklistModel: Model<TokenBlacklistCollection>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async provideToken(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const encryptedEmail = encryptEmail(loginDto.email)
        const user = await this.em.findOne(
          UserAuth, { email: encryptedEmail})
        if (!user) {
            throw new NotFoundException("Invalid email")
        }
        if (!await verify(user.password, loginDto.password)) {
            throw new UnauthorizedException("Invalid password")
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.generateAccessToken(encryptedEmail, RoleName[user.role], user.userAuthId),
            this.tokenService.generateRefreshToken(user.userAuthId)
        ])
        return { accessToken, refreshToken }
    }

    async refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const userAuthId = this.tokenService.getSubjectFromToken(token)
            const user = await this.em.findOne(
              UserAuth, { 
                  userAuthId: userAuthId
              })
            if (!user) {
                new UnauthorizedException("User no longer exists")
            }
            const [newAccessToken, newRefreshToken] = await Promise.all([
                this.tokenService.generateAccessToken(
                    user!.email,
                    RoleName[user!.role],
                    userAuthId
                ),
                this.tokenService.generateRefreshToken(
                    userAuthId
                )
              ])
            return { accessToken: newAccessToken, refreshToken: newRefreshToken }
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error
            }
            throw new UnauthorizedException("Invalid refresh token")
        }
    }

    async revokeToken(accessToken: string, refreshToken: string) {
        try {
            const userAuthId = this.tokenService.getSubjectFromToken(accessToken);
            const decodedAccessToken = this.jwtService.decode(accessToken);
            if (decodedAccessToken && decodedAccessToken.exp) {
                const now = Math.floor(Date.now() / 1000);
                const ttl = Math.max(0, decodedAccessToken.exp - now);
                await this.cacheManager.set(
                  `${accessToken}`,
                  true,
                  ttl * 1000
                );
            }
            const decodedRefreshToken = this.jwtService.decode(refreshToken);
            if (decodedRefreshToken && decodedRefreshToken.exp) {
                const expiresAt = new Date(decodedRefreshToken.exp * 1000);
                await this.tokenBlacklistModel.updateOne(
                  { userAuthId },
                  {
                      $push: { revokedRefreshToken: refreshToken },
                      $set: { expiresAt }
                  },
                  { upsert: true }
                );
            }
        } catch (error) {
            throw new Error(`Failed to blacklist token: ${error.message}`);
        }
    }

    async verifyAccessToken(accessToken: string): Promise<boolean> {
        try {
            const isRevoked = await this.cacheManager.get(`${accessToken}`);
            return !isRevoked;
        } catch (error) {
            throw new Error(`Failed to verify access token: ${error.message}`);
        }
    }

    async verifyRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            const decodedToken = this.jwtService.decode(refreshToken);
            if (!decodedToken || !decodedToken.sub) {
                return false;
            }
            const blacklistEntry = await this.tokenBlacklistModel.findOne({
                userAuthId: decodedToken.sub,
                revokedRefreshToken: { $in: [refreshToken] }
            });
            return !blacklistEntry;
        } catch (error) {
            throw new Error(`Failed to verify refresh token: ${error.message}`);
        }
    }
}