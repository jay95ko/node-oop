import { Service } from "typedi";
import db from "../database/db";
import { EnrollmentReopsitory } from "../database/repository/elrollment";
import { LectureReopsitory } from "../database/repository/lecture";
import { StudentReopsitory } from "../database/repository/student";
import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import ConflictError from "../modules/errors/conflit.error";
import DBError from "../modules/errors/db.error";
import {
  IEnrollment,
  IEnrollmentInfo,
} from "../modules/interface/enrollment.interface";
import Date from "../util/date.util";

@Service()
export class EnrollmentService {
  constructor(
    private enrollmentRepository: EnrollmentReopsitory,
    private lectureRepository: LectureReopsitory,
    private studentRepository: StudentReopsitory,
    private date: Date
  ) {}

  createEnrollment = async (enrollments: IEnrollment): Promise<string> => {
    //같은 강의 수강신청 불가하기 위해 중복값 제거
    const lectureIds: Array<number> = [...new Set(enrollments.lectureIds)];

    const student = await this.studentRepository.findOne({
      id: enrollments.studentId,
    });
    if (!student) {
      throw new DoesNotExistError("Can not enroll not exist student");
    }

    const enrollmentedLectures = await this.enrollmentRepository.findById({
      studentId: enrollments.studentId,
    });

    enrollmentedLectures.forEach((enrollment: IEnrollmentInfo) => {
      if (lectureIds.includes(enrollment.lectureId)) {
        throw new ConflictError("Can not enroll already enrolled lecture");
      }
    });

    const lectures = await this.lectureRepository.findListById(lectureIds);
    if (lectureIds.length !== lectures.length) {
      throw new DoesNotExistError("Can not enroll not exist lecture");
    }
    const result = [];
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      for (const lectureId of lectureIds) {
        result.push(await this.enrollmentRepository.create(
          enrollments.studentId,
          lectureId,
          connection
        ))
        const affectRow = await this.lectureRepository.update(lectureId, { studentNum: 'studentNum + 1'}, connection)
        if (affectRow === 0) throw new DBError("Enrollment create error");
      }
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
