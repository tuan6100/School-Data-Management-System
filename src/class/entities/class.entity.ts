import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core"
import {SubjectCombination} from "../../subject_combination/entities/subject_combination.entity";

@Entity({tableName: "classes"})
export class Class {
    @PrimaryKey({fieldName: "class_id", type: "bigint"}) classId!: number

    @Property({fieldName: "class_name", type: "varchar(20)"}) className!: string

    @ManyToOne(() => SubjectCombination) subjectCombination!: SubjectCombination
}
