import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"
import { FastifyRequest } from "fastify"
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../user/service/auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException("User is not authenticated")
    }
    if (!(await this.authService.verifyAccessToken(token))) {
      throw new UnauthorizedException("This token is not available")
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_KEY || process.env.JWT_KEY
      })
      if (payload.tokenType !== "access") {
        new UnauthorizedException("Invalid token type")
      }
      request["user"] = payload
      return true
    } catch {
      throw new UnauthorizedException("Invalid token")
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}


@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException("No refresh token provided")
    }
    if (!(await this.authService.verifyRefreshToken(token))) {
      throw new UnauthorizedException("This token is not available")
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_KEY || process.env.JWT_KEY
      })
      if (payload.tokenType !== "refresh") {
        new UnauthorizedException("Invalid token type")
      }
      request["user"] = payload
      return true
    } catch {
      throw new UnauthorizedException("Invalid refresh token")
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers['refresh-token']?.toString().split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Access denied");
    }
    return true;
  }
}