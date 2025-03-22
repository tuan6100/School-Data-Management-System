import {Entity, PrimaryKey, Property} from "@mikro-orm/core"

@Entity({tableName: "classrooms"})
export class Classroom {
    @PrimaryKey({fieldName: "classroom_id", type: "bigint"}) classroomId!: number

    @Property({fieldName: "classroom_label", type: "varchar(10)"}) classroomCode!: string
    @Property({fieldName: "classroom_name", type: "varchar(20)"}) classroomName!: string
    @Property({fieldName: "classroom_capacity", type: "int"}) classroomCapacity!: number
}
