import { Entity, PrimaryKey, ManyToOne, Property } from "@mikro-orm/core";
import { SubjectCombination } from "./subject_combination.entity";
import {Subject} from "../enum/subject.enum";

@Entity({ tableName: "subject_combination_details" })
export class SubjectCombinationDetail {
    @PrimaryKey({ fieldName: "subject_combination_detail_id", type: "bigint" })
    subjectCombinationDetailId!: number;

    @ManyToOne(() => SubjectCombination, { fieldName: "subject_combination_id" })
    subjectCombination!: SubjectCombination;

    @Property({ fieldName: "subject", type: "enum" }) subject!: Subject;

    @Property({ fieldName: "lesson_per_week", type: "int" })
    lessonPerWeek!: number;
}
