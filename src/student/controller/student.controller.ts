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
import { FastifyRequest } from "fastify"
import { TokenService } from "../../user/service/token.service"
import { AccessTokenGuard } from '../../app/config/security/access_token.guard';


const apiPrefix = process.env.API_PREFIX?? ""
@Controller(`${apiPrefix}/student`)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly tokenService: TokenService
  ) {}

  @Post("/register")
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto)
  }

  @Get("/get-all")
  async findAll(@Query("page") page = 0, @Query("size") size = 10) {
    return this.studentService.findAll(page, size)
  }

  @Get("/get")
  // @UseGuards(Access_tokenGuard, RolesGuard)
  // @Roles("student")
  async findOne(@Query("id") id: number) {
    return this.studentService.findOne(id)
  }

  @UseGuards(AccessTokenGuard)
  @Put("/update")
  async update(@Req() req: FastifyRequest, @Body() updateStudentDto: UpdateStudentDto) {
    const accessToken = req.headers.authorization?.split(" ")[1]
    if (!accessToken) {
      throw new UnauthorizedException("User is not authentication")
    }
    const id = this.tokenService.getSubjectFromToken(accessToken)
    return this.studentService.update(id, updateStudentDto)
  }

  @Delete("/remove")
  async remove(@Query("id") id: number) {
    return this.studentService.remove(id)
  }
}
