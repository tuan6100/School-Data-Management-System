import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../../user/service/auth.service';
import { FastifyRequest } from 'fastify';

const SECRET_KEY = process.env.JWT_KEY?? ""

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
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
        secret: SECRET_KEY
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