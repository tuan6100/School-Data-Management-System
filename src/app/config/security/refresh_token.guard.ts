import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../../user/service/auth.service";
import { FastifyRequest } from "fastify";

const SECRET_KEY = process.env.JWT_KEY?? ""

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
        secret: SECRET_KEY
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
    const [type, token] = request.headers["refresh-token"]?.toString().split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}