import { EnrollmentReopsitory } from "../../../database/repository/elrollment";
import { LectureReopsitory } from "../../../database/repository/lecture";
import { StudentReopsitory } from "../../../database/repository/student";
import { EnrollmentService } from "../../../service/enrollment";
import Date from "../../../util/date.util";

export class StubEnrollmentService extends EnrollmentService {
  constructor(
    enrollmentRepository: EnrollmentReopsitory,
    lectureRepository: LectureReopsitory,
    studentRepository: StudentReopsitory
  ) {
    super(enrollmentRepository, lectureRepository, studentRepository);
  }
  createEnrollment = async () => {
    return "Sucess create 1 of enrollment";
  };
}
