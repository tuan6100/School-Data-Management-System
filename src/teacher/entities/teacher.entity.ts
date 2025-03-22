import UserAuth, {UserProfile} from "../../user/entities/user.entity"
import {Entity, PrimaryKey, Property} from "@mikro-orm/core"
import {Subject} from "../../subject_combination/enum/subject.enum"

@Entity({tableName: "teachers"})
export class Teacher extends UserProfile {
    @PrimaryKey({ fieldName: "teacher_id", type: "bigint"}) teacherId!: number

    @Property({fieldName: "education_level", type: "int"}) educationLevel!: number
    @Property({fieldName: "contract_number", type: "varchar", length: 10 }) contractNumber!: string
    @Property({fieldName: "subject", type: "enum", length: 20}) subject!: Subject
    @Property({fieldName: "version", type: "int", default: 1}) version!: number


    static Builder = class {
        teacher = new Teacher()

        withFirstName(firstName: string): this {
            this.teacher.firstName = firstName
            return this
        }

        withMidName(midName: string): this {
            this.teacher.midName = midName
            return this
        }

        withLastName(lastName: string): this {
            this.teacher.lastName = lastName
            return this
        }

        withDob(dob: Date): this {
            this.teacher.dob = dob
            return this
        }

        withNationality(nationality: string): this {
            this.teacher.nationality = nationality
            return this
        }

        withEducationLevel(educationLevel: number): this {
            this.teacher.educationLevel = educationLevel
            return this
        }

        withContractNumber(contractNumber: string): this {
            this.teacher.contractNumber = contractNumber
            return this
        }

        withSubject(subject: Subject): this {
            this.teacher.subject = subject
            return this
        }

        build(): Teacher {
            return this.teacher
        }
    }

}
