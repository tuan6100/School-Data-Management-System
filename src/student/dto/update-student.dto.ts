import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    citizenIdCode: string
    firstName: string
    midName: string
    lastName: string
    dob: Date
    gender: string
    nationality: string = "vi"
    pob: string
    address: string
    educationLevel: number
}
