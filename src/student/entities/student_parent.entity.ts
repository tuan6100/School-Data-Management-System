import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Student} from "./student.entity";


@Entity({tableName: "student_parents"})
export class StudentParent {
    @PrimaryKey({fieldName: "student_parent_id", type: "bigint"}) studentParentId!: number;

    @Property({fieldName: "father_fullname", type: "varchar"}) fatherFullname?: string;
    @Property({fieldName: "father_dob", type: "int"}) fatherAge?: number;
    @Property({fieldName: "father_job", type: "varchar", nullable: true}) fatherJob?: string;
    @Property({fieldName: "father_phone_number", type: "varchar"}) fatherPhoneNumber?: string;
    @Property({fieldName: "mother_fullname", type: "varchar"}) motherFullname?: string;
    @Property({fieldName: "mother_dob", type: "int"}) motherAge?: number;
    @Property({fieldName: "mother_job", type: "varchar", nullable: true}) motherJob?: string;
    @Property({fieldName: "mother_phone_number", type: "varchar"}) motherPhoneNumber?: string;
    @Property({fieldName: "parent_address", type: "varchar"}) parentAddress?: string;

    @OneToMany(() => Student, student => student.studentParent)
    students = new Collection<Student>(this);


    static Builder = class {
        studentParent: StudentParent = new StudentParent();

        withFatherFullname(fatherFullname: string): this {
            this.studentParent.fatherFullname = fatherFullname;
            return this;
        }

        withFatherAge(fatherAge: number): this {
            this.studentParent.fatherAge = fatherAge;
            return this;
        }

        withFatherJob(fatherJob: string): this {
            this.studentParent.fatherJob = fatherJob;
            return this;
        }

        withFatherPhoneNumber(fatherPhoneNumber: string): this {
            this.studentParent.fatherPhoneNumber = fatherPhoneNumber;
            return this;
        }

        withMotherFullname(motherFullname: string): this {
            this.studentParent.motherFullname = motherFullname;
            return this;
        }

        withMotherAge(motherAge: number): this {
            this.studentParent.motherAge = motherAge;
            return this;
        }

        withMotherJob(motherJob: string): this {
            this.studentParent.motherJob = motherJob;
            return this;
        }

        withMotherPhoneNumber(motherPhoneNumber: string): this {
            this.studentParent.motherPhoneNumber = motherPhoneNumber;
            return this;
        }

        withParentAddress(parentAddress: string): this {
            this.studentParent.parentAddress = parentAddress;
            return this;
        }

        build(): StudentParent {
            return this.studentParent;
        }
    }

}
    