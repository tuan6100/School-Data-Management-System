import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core"
import {SubjectCombinationDetail} from "./subject_combination_details.entity";
import {Class} from "../../class/entities/class.entity";

@Entity({ tableName: "subject_combinations" })
export class SubjectCombination {
    @PrimaryKey({ fieldName: "subject_combination_id", type: "bigint" })
    subjectCombinationId!: number;

    @Property({ fieldName: "subject_combination_name", type: "text" })
    subjectCombinationName!: string;

    @OneToMany(() => SubjectCombinationDetail, detail => detail.subjectCombination)
    subjects = new Collection<SubjectCombinationDetail>(this);

    @OneToMany(() => Class, Class => Class.subjectCombination)
    classes = new Collection<Class>(this);
}
