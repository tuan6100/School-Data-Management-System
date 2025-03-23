import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  async generateAccessToken(email: string, role: string, userAuthId: number): Promise<string> {
    const payload = {
      email,
      role: role,
      subject: userAuthId,
      tokenType: 'access'
    };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_KEY || process.env.JWT_KEY,
      expiresIn: '5m'
    });
  }

  async generateRefreshToken(email: string, role: string, userAuthId: number): Promise<string> {
    const payload = {
      email,
      role: role,
      subject: userAuthId,
      tokenType: 'refresh'
    };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_KEY || process.env.JWT_KEY,
      expiresIn: '3y'
    });
  }

  getSubjectFromToken(token: string): number {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_KEY || process.env.JWT_KEY
    });
    return payload.subject;
  }
}