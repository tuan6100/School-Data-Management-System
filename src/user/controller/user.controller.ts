import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from "../service/user.service"
import { UpdateUserDto } from "../dto/update-user.dto"
import * as process from "node:process"
import { AuthService } from "../service/auth.service"
import { LoginDto } from "../dto/login.dto"
import { FastifyReply, FastifyRequest } from 'fastify';
import { AccessTokenGuard, RefreshTokenGuard } from '../../app/config/app.guard';
import { TokenDto } from '../../class/dto/token.dto';


@Controller(`${process.env.API_PREFIX}/user`)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post("/login")
  async login(@Body() loginDto: LoginDto, @Res() response: FastifyReply) {
    const {accessToken, refreshToken} = await this.authService.provideToken(loginDto)
    response.header("Authorization", `Bearer ${accessToken}`)
    response.header("Refresh-Token", `Bearer ${refreshToken}`)
    return response.send({ message: "Login successful" })
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: FastifyRequest) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Refresh token not provided');
    }
    return this.authService.refreshToken(token);
  }

  @Get("/get-all")
  findAll() {
    return this.userService.findAll()
  }

  @Get("/get")
  findOne(@Query("id") id: number, @Param("role") role: string) {
    return this.userService.findOneEmail(id, role)
  }

  @UseGuards(AccessTokenGuard)
  @Put("/update-password")
  updatePassword(@Query("password") newPassword: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePassword(updateUserDto, newPassword)
  }

  @Post("/logout")
  async logout(@Body() tokenDto: TokenDto, @Res() res: FastifyReply) {
    try {
      const accessToken = tokenDto.accessToken
      const refreshToken = tokenDto.refreshToken
      if (!accessToken || !refreshToken) {
        throw new UnauthorizedException('Missing required tokens');
      }
      await Promise.all([
        this.authService.revokeAccessToken(accessToken),
        this.authService.revokeRefreshToken(refreshToken)
      ])
      return res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
      throw new UnauthorizedException('Logout failed: ' + error.message);
    }
  }
}
