import { StudentReopsitory } from "../../../database/repository/student";
import { StudentService } from "../../../service/student";

export class StubStudentService extends StudentService {
  constructor(studentRepository: StudentReopsitory) {
    super(studentRepository);
  }
  createStudent = async () => {
    return "Sucess create student";
  };

  deleteStudent = async () => {
    return "Sucess delete student";
  };
}
