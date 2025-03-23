import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Student} from "../../student/entities/student.entity";
import {Class} from "../../class/entities/class.entity";
import {Semester} from "../../other/entity/semester.entity";


@Entity()
export class StudentClass {
    @PrimaryKey({fieldName: "student_class_id", type: "bigint"}) studentClassId!: number

    @ManyToOne(() => Student) student!: Student
    @ManyToOne(() => Class) class!: Class

    @OneToMany(() => Semester, semester => semester.studentClass)
    semesters = new Collection<Semester>(this)


}