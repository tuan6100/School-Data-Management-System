import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    userId: number
    email: string
    password: string
    role: string

    static Builder = class {
        updateUser: UpdateUserDto = new UpdateUserDto()

        withUserId(userId: number): this {
            this.updateUser.userId = userId
            return this
        }

        withEmail(email: string): this {
            this.updateUser.email = email
            return this
        }

        withPassword(password: string): this {
            this.updateUser.password = password
            return this
        }

        withRole(role: string): this {
            this.updateUser.role = role
            return this
        }

        build(): UpdateUserDto {
            return this.updateUser
        }
    }
}
