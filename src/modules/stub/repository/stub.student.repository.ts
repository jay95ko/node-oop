import { StudentRepository } from "../../../database/repository/student";
import Date from "../../../util/date.util";
import DBError from "../../errors/db.error";
import { IStudent, IStudentFindOne } from "../../interface/student.interface";

export class StubStudentRepository extends StudentRepository {
  private existStudent = {
    id: 1,
    name: "test name",
    email: "test@naver.com",
  };
  constructor(date: Date, tableName: string) {
    super(date, tableName);
  }
  create = async (student: IStudent) => {
    if (student.name === "inflab2") return 0;
    return 1;
  };

  findOne = async (student: IStudentFindOne) => {
    if (student.email === this.existStudent.email) {
      return this.existStudent;
    } else if (student.id === this.existStudent.id) {
      return this.existStudent;
    }
    return null;
  };

  delete = async (id: number) => {
    if (id == this.existStudent.id) {
      console.log(id === this.existStudent.id);
      return 1;
    }
    return 0;
  };
}
