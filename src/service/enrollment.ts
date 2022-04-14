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

@Service()
export class EnrollmentService {
  constructor(
    private enrollmentRepository: EnrollmentReopsitory,
    private lectureRepository: LectureReopsitory,
    private studentRepository: StudentReopsitory
  ) {}

  //수강 정보 생성
  createEnrollment = async (enrollments: IEnrollment): Promise<string> => {
    //같은 강의 수강신청 불가하기 위해 중복값 제거
    const lectureIds: Array<number> = [...new Set(enrollments.lectureIds)];

    //수강신청 하는 학생의 id가 유효값인지 확인 및 해당 id로 학생 없으면 DoesNotExistError 에러 반환
    await this.checkValidStudent(enrollments.studentId);

    //수강신청 하는 학생이 기존에 수강신청한 과목을 수강하려 하는 경우 ConflictError 반환
    await this.checkEnrollmentedLecture(enrollments.studentId, lectureIds);

    //수강신청 하는 강의 목록을 조회하고 조회한 결과값과 수강신청 하는 강의의 목록의 개수가 다르면 수강신청 하려고 하는 강의가 존재하지 않는 경우이므로 DoesNotExistError 반환
    await this.checkExistLecture(lectureIds);

    //수강신청 테이블에 정보 저장 및 강의 테이블에 수강생수 추가
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
        const affectRow = await this.lectureRepository.update(
          lectureId,
          { studentNum: value },
          connection
        );
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

  private checkValidStudent = async (studentId: number): Promise<void> => {
    const student = await this.studentRepository.findOne({
      id: studentId,
    });
    if (!student) {
      throw new DoesNotExistError("Can not enroll not exist student");
    }
  };

  private checkEnrollmentedLecture = async (
    studentId: number,
    lectureIds: Array<number>
  ): Promise<void> => {
    const enrollmentedLectures = await this.enrollmentRepository.findById({
      studentId,
    });
    enrollmentedLectures.forEach((enrollment: IEnrollmentInfo) => {
      if (lectureIds.includes(enrollment.lectureId)) {
        throw new ConflictError("Can not enroll already enrolled lecture");
      }
    });
  };

  private checkExistLecture = async (
    lectureIds: Array<number>
  ): Promise<void> => {
    const lectures = await this.lectureRepository.findByIds(lectureIds);
    if (lectureIds.length !== lectures.length) {
      throw new DoesNotExistError("Can not enroll not exist lecture");
    }
  };
}
