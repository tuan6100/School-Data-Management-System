import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core"
import {UserProfile} from "../../user/entities/user.entity"
import {StudentParent} from "./student_parent.entity"
import {StudentScore} from "../../student_score/entities/student_score.entity";
import {StudentAverageScores} from "../../student_score/entities/student_average_scores.entity";
import {AutoMap} from "@automapper/classes";

@Entity({ tableName: "students" })
export class Student extends UserProfile {
    @PrimaryKey({ fieldName: "student_id", type: "bigint"})
    studentId!: number

    @AutoMap() @Property({fieldName: "education_level", type: "int"}) educationLevel!: number
    @Property({fieldName: "admission_date", type: "date"}) admissionDate = new Date()
    @Property({fieldName: "graduation_date", type: "date", nullable: true}) graduationDate?: Date
    @Property({fieldName: "version", type: "int", default: 1}) version!: number

    @ManyToOne(() => StudentParent, {nullable: true}) studentParent!: StudentParent

    @OneToMany(() => StudentScore, studentScore => studentScore.student)
    studentScores = new Collection<StudentScore>(this)
    @OneToMany(() => StudentAverageScores, studentAverageScores => studentAverageScores.student)
    studentAverageScores = new Collection<StudentAverageScores>(this)


    static Builder = class {
        student: Student = new Student()

        withFirstName(firstName: string): this {
            this.student.firstName = firstName
            return this
        }

        withMidName(midName: string): this {
            this.student.midName = midName
            return this
        }

        withLastName(lastName: string): this {
            this.student.lastName = lastName
            return this
        }

        withDob(dob: Date): this {
            this.student.dob = dob
            return this
        }

        withNationality(nationality: string): this {
            this.student.nationality = nationality
            return this
        }

        withEducationLevel(educationLevel: number): this {
            this.student.educationLevel = educationLevel
            return this
        }

        withAdmissionDate(admissionDate: Date): this {
            this.student.admissionDate = admissionDate
            return this
        }

        withGraduationDate(graduationDate: Date): this {
            this.student.graduationDate = graduationDate
            return this
        }

        withVersion(version: number): this {
            this.student.version = version
            return this
        }

        withStudentParent(studentParent: StudentParent): this {
            this.student.studentParent = studentParent
            return this
        }

        build(): Student {
            if (this.student.version === undefined) {
                this.student.version = 1
            }
            return this.student
        }
    }
}

