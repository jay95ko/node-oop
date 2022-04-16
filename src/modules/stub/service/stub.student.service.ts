import { StudentRepository } from "../../../database/repository/student";
import { StudentService } from "../../../service/student";

export class StubStudentService extends StudentService {
  constructor(studentRepository: StudentRepository) {
    super(studentRepository);
  }
  createStudent = async () => {
    return "Success create student";
  };

  deleteStudent = async () => {
    return "Success delete student";
  };
}
