import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as process from 'node:process';

@Controller(`${process.env.API_PREFIX}/user`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/get-all")
  findAll() {
    return this.userService.findAll();
  }

  @Get("/get")
  findOne(@Query("id") id: number, @Param("role") role: string) {
    return this.userService.findOneEmail(id, role);
  }

  @Put("/update-password")
  updatePassword(@Query("password") newPassword: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePassword(updateUserDto, newPassword);
  }
}
