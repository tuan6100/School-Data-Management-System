import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {StudentClass} from "../../student_class/entities/student_class.entity";
import {HomeroomTeacherClass} from "../../teacher_class/entities/homeroom_teacher_class.entity";
import {StudentScore} from "../../student_score/entities/student_score.entity";
import {StudentAverageScores} from "../../student_score/entities/student_average_scores.entity";

@Entity({tableName: "semesters"})
export class Semester {
    @PrimaryKey({fieldName: "semester_id", type: "bigint"}) semesterId!: number

    @Property({fieldName: "semester", type: "smallint"}) semester!: number
    @Property({fieldName: "school_year", type: "varchar(10)"}) schoolYear!: string

    @ManyToOne(() => StudentClass) studentClass!: StudentClass
    @ManyToOne(() => HomeroomTeacherClass) homeroomTeacherClass!: HomeroomTeacherClass
    @ManyToOne(() => StudentScore) studentScore!: StudentScore
    @ManyToOne(() =>StudentAverageScores) studentAverageScores!: StudentAverageScores;
}
