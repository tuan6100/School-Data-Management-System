import {Student} from "../../student/entities/student.entity";
import {BeforeUpdate, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Semester} from "../../other/entity/semester.entity";
import {StudentAverageScores} from "./student_average_scores.entity";

@Entity({tableName: "student_scores"})
export class StudentScore {
    @PrimaryKey({ fieldName: "student_score_id", type: "bigint" }) studentScoreId!: number

    @ManyToOne(() => Student) student!: Student
    @ManyToOne(() => StudentAverageScores) studentAverageScores!: StudentAverageScores

    @OneToMany(() => Semester, semester => semester.studentScore)
    semesters = new Collection<Semester>(this)

    @Property({ fieldName: "subject", type: "text" }) subject!: string
    @Property({ fieldName: "first_score", type: "float", nullable: true })
    firstScore: number
    @Property({ fieldName: "midterm_score", type: "float", nullable: true })
    midtermScore!: number
    @Property({ fieldName: "final_score", type: "float", nullable: true })
    finalScore!: number
    @Property({ fieldName: "avg_score", type: "float", nullable: true }) averageScore!: number


    @BeforeUpdate()
    calculateAverageScore() {
        if (this.firstScore !== undefined || this.midtermScore !== undefined || this.finalScore !== undefined) {
            const first = this.firstScore ?? 0;
            const midterm = this.midtermScore ?? 0;
            const final = this.finalScore ?? 0;
            this.averageScore = (first + midterm * 2 + final * 3) / 6;
        }
    }

}
