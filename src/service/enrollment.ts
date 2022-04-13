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

    //수강신청 하는 학생의 id가 유효값인지 확인 및 해당 id로 학생 없으면 DoesNotExistError 에러 반환
    const student = await this.studentRepository.findOne({
      id: enrollments.studentId,
    });
    if (!student) {
      throw new DoesNotExistError("Can not enroll not exist student");
    }

    //수강신청 하는 학생이 기존에 수강신청한 과목을 수강하려 하는 경우 ConflictError 반환
    const enrollmentedLectures = await this.enrollmentRepository.findById({
      studentId: enrollments.studentId,
    });
    enrollmentedLectures.forEach((enrollment: IEnrollmentInfo) => {
      if (lectureIds.includes(enrollment.lectureId)) {
        throw new ConflictError("Can not enroll already enrolled lecture");
      }
    });

    //수강신청 하는 강의 목록을 조회하고 조회한 결과값과 수강신청 하는 강의의 목록의 개수가 다르면 수강신청 하려고 하는 강의가 존재하지 않는 경우이므로 DoesNotExistError 반환
    const lectures = await this.lectureRepository.findByIds(lectureIds);
    if (lectureIds.length !== lectures.length) {
      throw new DoesNotExistError("Can not enroll not exist lecture");
    }
    const result = [];
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      for (const lectureId of lectureIds) {
        result.push(
          await this.enrollmentRepository.create(
            enrollments.studentId,
            lectureId,
            connection
          )
        );
        const value = "studentNum + 1";
        // const affectRow = await this.lectureRepository.update(
        //   lectureId,
        //   { studentNum: value },
        //   connection
        // ))

        //수강신청을 하면 수강 테이블에 추가 및 강의 테이블에 studentNum 값을 증가 동작 수행이 안되었을 시 DBError에러 반환
        const affectRow = await this.lectureRepository.update(lectureId, { studentNum: 'studentNum + 1'}, connection);
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
