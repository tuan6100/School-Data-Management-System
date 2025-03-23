import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey} from "@mikro-orm/core";
import {Teacher} from "../../teacher/entities/teacher.entity";
import {Class} from "../../class/entities/class.entity";
import {Semester} from "../../other/entity/semester.entity";

@Entity({tableName: "homeroom_teacher_class"})
export class HomeroomTeacherClass {
    @PrimaryKey({fieldName: "homeroom_teacher_class_id", type: "bigint"}) homeroomTeacherClassId!: number

    @ManyToOne(() => Teacher, {fieldName: "homeroom_teacher_id"}) homeroomTeacher!: Teacher
    @ManyToOne(() => Class, {fieldName: "class_id"}) class!: Class

    @OneToMany(() => Semester, semester => semester.homeroomTeacherClass)
    semesters = new Collection<Semester>(this)
}
