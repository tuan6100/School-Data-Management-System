import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
  UseGuards,
  Req,
  UnauthorizedException,
} from "@nestjs/common"
import { StudentService } from "../service/student.service"
import { CreateStudentDto } from "../dto/create-student.dto"
import { UpdateStudentDto } from "../dto/update-student.dto"
import { AccessTokenGuard, RolesGuard } from "../../app/config/app.guard"
import { FastifyRequest } from "fastify"
import { TokenService } from "../../user/service/token.service"

@Controller(`${process.env.API_PREFIX}/student`)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly tokenService: TokenService
  ) {}

  @Post("/register")
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto)
  }

  @Get("/get-all")
  findAll(@Query("page") page = 0, @Query("size") size = 10) {
    return this.studentService.findAll(page, size)
  }

  @Get("/get")
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles("student")
  findOne(@Query("id") id: number) {
    return this.studentService.findOne(id)
  }

  @UseGuards(AccessTokenGuard)
  @Put("/update")
  update(@Req() req: FastifyRequest, @Body() updateStudentDto: UpdateStudentDto) {
    const accessToken = req.headers.authorization?.split(" ")[1]
    if (!accessToken) {
      throw new UnauthorizedException("User is not authentication")
    }
    const id = this.tokenService.getSubjectFromToken(accessToken)
    return this.studentService.update(id, updateStudentDto)
  }

  @Delete("/remove")
  remove(@Query("id") id: number) {
    return this.studentService.remove(id)
  }
}
