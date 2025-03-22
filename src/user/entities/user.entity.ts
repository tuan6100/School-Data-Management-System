import {Entity,PrimaryKey, Property} from "@mikro-orm/core"
import {Role} from "../enum/role.enum"
import {AutoMap} from "@automapper/classes";

@Entity({tableName: "users"})
export default class UserAuth {
    @PrimaryKey({fieldName: "user_auth_id", type: "bigint"}) userAuthId!: number

    @Property({fieldName: "user_id", type: "bigint"}) userId!: number
    @Property({fieldName: "email", type: "varchar", length: 50, unique: true}) email!: string
    @Property({fieldName: "password", type: "varchar", hidden: true})
    password!: string
    @Property({fieldName: "role", type: "enum"}) role!: Role
    @Property({fieldName: "created_at", type: "timestamp", onCreate: () => new Date()})
    createdAt = new Date()
    @Property({fieldName: "updated_at", type: "timestamp", onUpdate: () => new Date(), nullable: true})
    updatedAt = new Date()


    static Builder = class {
        userAuth: UserAuth = new UserAuth()

        withUser(userId: number): this {
            this.userAuth.userId = userId
            return this
        }

        withEmail(email: string): this {
            this.userAuth.email = email
            return this
        }

        withPassword(password: string): this {
            this.userAuth.password = password
            return this
        }

        withRole(role: Role): this {
            if (role !== Role.ADMIN && role !== Role.TEACHER && role !== Role.STUDENT) {
                throw new Error("Invalid role")
            }
            this.userAuth.role = role
            return this
        }

        build(): UserAuth {
            return this.userAuth
        }
    }
}


export abstract class UserProfile {
    @AutoMap() @Property({fieldName: "citizen_id_code", type: "varchar", length: 13, unique: true}) citizenIdCode: string
    @AutoMap() @Property({fieldName: "first_name", type: "varchar", length: 10}) firstName: string
    @AutoMap() @Property({fieldName: "mid_name", type: "varchar", length: 10}) midName: string
    @AutoMap() @Property({fieldName: "last_name", type: "varchar", length: 10}) lastName: string
    @AutoMap() @Property({fieldName: "dob", type: "date"}) dob: Date
    @AutoMap() @Property({fieldName: "gender", type: "varchar", length: 1}) gender: string
    @AutoMap() @Property({fieldName: "nationality", type: "varchar", length: 2}) nationality: string
    @AutoMap() @Property({fieldName: "pob", type: "varchar", length: 100}) pob: string
    @AutoMap() @Property({fieldName: "address", type: "varchar", length: 100}) address: string

}

