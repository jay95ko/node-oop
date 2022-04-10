import { Service } from "typedi";
import db from "../database/db";
import { EnrollmentReopsitory } from "../database/model/elrollment";
import { LectureReopsitory } from "../database/model/lecture";
import { StudentReopsitory } from "../database/model/student";
import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import DBError from "../modules/errors/db.error";
import { IEnrollment } from "../modules/interface/enrollment.interface";
import Date from "../util/date.util";

@Service()
export class EnrollmentService {
  constructor(
    private enrollmentRepository: EnrollmentReopsitory,
    private lectureRepository: LectureReopsitory,
    private studentRepository: StudentReopsitory,
    private date: Date
  ) {}

  createEnrollment = async (enrollments: IEnrollment) => {
    //같은 강의 수강신청 불가하기 위해 중복값 제거
    const lectureIds: Array<number> = [...new Set(enrollments.lectureIds)];

    const student = await this.studentRepository.findOne({
      id: enrollments.studentId,
    });
    if (!student) {
      throw new DoesNotExistError("Can not enroll not exist student");
    }

    const lectures = await this.lectureRepository.findListById(lectureIds);
    if (lectureIds.length !== lectures.length) {
      throw new DoesNotExistError("Can not enroll not exist lecture");
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const result = await this.enrollmentRepository.create(
        enrollments.studentId,
        lectureIds,
        connection
      );
      await connection.commit();
      return `Sucess create ${result.length} of enrollment`;
    } catch (err) {
      console.error(err);
      await connection.rollback();
      throw new DBError("Enrollment create error");
    } finally {
      db.releaseConnection(connection);
    }
  };
}
