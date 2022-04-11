import { StudentReopsitory } from "../../../database/repository/student";
import Date from "../../../util/date.util";
import { IStudent } from "../../interface/student.interface";

export class StubStudentRepository extends StudentReopsitory {
  private existStudent = {
    id: 1,
    name: "test name",
    email: "test@naver.com",
  };
  constructor(date: Date, tableName: string) {
    super(date, tableName);
  }
  create = async (student: IStudent, connection: any) => {
    return;
  };

  delete = async (id: number) => {
    if (id == this.existStudent.id) {
      console.log(id === this.existStudent.id);
      return 1;
    }
    return 0;
  };

  findOne = async (student: any) => {
    if (student.email === this.existStudent.email) {
      return this.existStudent;
    } else if (student.id === this.existStudent.id) {
      return this.existStudent;
    }
    return null;
  };
}
