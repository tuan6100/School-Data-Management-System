import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    userId: number;
    role: string;
    constructor(userId: number, role: string) {
        super()
        this.userId = userId
        this.role = role

    }

}
