import {BeforeUpdate, Check, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core"
import {Student} from "../../student/entities/student.entity"
import {Semester} from "../../other/entity/semester.entity"
import {StudentScore} from "./student_score.entity"

@Entity({tableName: "student_average_scores"})
export class StudentAverageScores {
    @PrimaryKey({ fieldName: "avg_id", type: "bigint" }) avgId!: number

    @ManyToOne(() => Student) student!: Student

    @OneToMany(() => StudentScore, studentScore => studentScore.studentAverageScores)
    scores = new Collection<StudentScore>(this)
    @OneToMany(() => Semester, semester => semester.studentAverageScores)
    semesters = new Collection<Semester>(this)

    @Property({ fieldName: "first_semester_avg", type: "float", nullable: true })
    firstSemesterAvg?: number
    @Property({ fieldName: "second_semester_avg", type: "float", nullable: true })
    secondSemesterAvg?: number
    @Property({ fieldName: "year_avg", type: "float", nullable: true })
    yearAvg?: number

    @BeforeUpdate()
    async calculateSemesterAverages() {
        if (this.scores?.isInitialized()) {
            const allScores = this.scores.getItems()
            const firstSemesterScores = allScores.filter(score => {
                return score.semesters.getItems().some(sem => sem.semester === 1)
            })
            const secondSemesterScores = allScores.filter(score => {
                return score.semesters.getItems().some(sem => sem.semester === 2)
            })
            if (firstSemesterScores.length > 0) {
                const validFirstSemScores = firstSemesterScores
                    .filter(score => score.averageScore !== undefined && score.averageScore !== null)
                if (validFirstSemScores.length === firstSemesterScores.length) {
                    const sum = validFirstSemScores.reduce((total, score) => total + score.averageScore, 0)
                    this.firstSemesterAvg = sum / validFirstSemScores.length
                }
            }
            if (secondSemesterScores.length > 0) {
                const validSecondSemScores = secondSemesterScores
                    .filter(score => score.averageScore !== undefined && score.averageScore !== null)
                if (validSecondSemScores.length === secondSemesterScores.length) {
                    const sum = validSecondSemScores
                        .reduce((total, score) => total + score.averageScore, 0)
                    this.secondSemesterAvg = sum / validSecondSemScores.length
                }
            }
            if (this.firstSemesterAvg !== undefined && this.secondSemesterAvg !== undefined) {
                this.yearAvg = (this.firstSemesterAvg + this.secondSemesterAvg * 2) / 3
            }
        }
    }
}