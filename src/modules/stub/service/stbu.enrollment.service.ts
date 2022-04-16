import { EnrollmentRepository } from "../../../database/repository/enrollment";
import { LectureRepository } from "../../../database/repository/lecture";
import { StudentRepository } from "../../../database/repository/student";
import { EnrollmentService } from "../../../service/enrollment";

export class StubEnrollmentService extends EnrollmentService {
  constructor(
    enrollmentRepository: EnrollmentRepository,
    lectureRepository: LectureRepository,
    studentRepository: StudentRepository
  ) {
    super(enrollmentRepository, lectureRepository, studentRepository);
  }
  createEnrollment = async () => {
    return "Success create 1 of enrollment";
  };
}
