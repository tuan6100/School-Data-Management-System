import { AutoMap } from '@automapper/classes';

export class CreateTeacherDto {
  @AutoMap() citizenIdCode: string
  @AutoMap() firstName: string
  @AutoMap() midName: string
  @AutoMap() lastName: string
  @AutoMap() dob: Date
  @AutoMap() gender: string
  @AutoMap() nationality: string = "vi"
  @AutoMap() pob: string
  @AutoMap() address: string
  @AutoMap() educationLevel: number
  @AutoMap() contractNumber: string
  @AutoMap() subject: string
}
