import { Service } from "typedi";

import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import ConflictError from "../modules/errors/conflit.error";
import {
  ILecture,
  ILectureColDetail,
  ILectureDetail,
  ILectureDetailStudent,
  ILectureList,
  ILectureQuery,
  ILectureSqlParams,
  ILectureUpdate,
  IManufactureLectureDetail,
} from "../modules/interface/lecture.interface";
import Date from "../util/date.util";
import db from "../database/db";
import DBError from "../modules/errors/db.error";
import { LectureReopsitory } from "../database/repository/lecture";
import { CategoryReopsitory } from "../database/repository/category";
import { TeacherReopsitory } from "../database/repository/teacher";
import { EnrollmentReopsitory } from "../database/repository/elrollment";

@Service()
export class LectureService {
  constructor(
    private lectureRepository: LectureReopsitory,
    private categoryRepository: CategoryReopsitory,
    private teacherRepository: TeacherReopsitory,
    private enrollmentRepository: EnrollmentReopsitory,
    private date: Date
  ) {}

  //강의 목록 반환
  getLectureList = async (
    reqQuery: ILectureQuery
  ): Promise<Array<ILectureList>> => {
    //sql 쿼리 가공작업
    const sql = this.MakeQuery(reqQuery);

    const lectures = await this.lectureRepository.find(sql);
    return lectures;
  };

  //강의 상세정보 반환
  getLecture = async (id: number): Promise<IManufactureLectureDetail> => {
    //강의 id로 조회 정보 없으면 DoesNotExistError
    let lecture = await this.lectureRepository.findOne(id);
    if (lecture.length < 1) {
      throw new DoesNotExistError("Does not exist lecture");
    }

    //JOIN하여 내려온 강의 상세정보 rows를 가공해야 할 필요가 있음
    //강의 상세정보와 수강생 정보를 가공
    const result = this.makeLectureDetailWithStudent(lecture);

    return result;
  };

  //강의 정보 생성
  createLecture = async (lectures: Array<ILecture>): Promise<string> => {
    //강의 생성 시 categoryId, teacherId 값 유효한 참조하는지 확인
    await this.checkValidReference(lectures);

    const connection = await db.getConnection();
    try {
      const result = [];
      await connection.beginTransaction();
      for (const lecture of lectures) {
        result.push(await this.lectureRepository.create(lecture, connection));
      }

      await connection.commit();
      return `Sucess create ${result.length} of lecture`;
    } catch (err) {
      console.error(err);
      await connection.rollback();
      throw new DBError("Lecture create error");
    } finally {
      db.releaseConnection(connection);
    }
  };

  updateLecture = async (
    id: number,
    lecture: ILectureUpdate
  ): Promise<string> => {
    const connection = await db.getConnection();
    const affectedRows = await this.lectureRepository.update(
      id,
      lecture,
      connection
    );
    db.releaseConnection(connection);

    //affectedRows 체크 update된 값이 없다면 affectedRows 값이 0이며 id로 조회한 강의 값이 없는 경우로 DoesNotExistError 반환
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist lecture for update");
    }
    return "Sucess update lecture";
  };

  deleteLecture = async (id: number): Promise<string> => {
    //강의를 수강하는 수강생이 있는경우 강의 삭제 불가
    //삭제하려는 강의를 수가하는 학생이 있는지 확인
    await this.checkEnrollmentedExist;

    const connection = await db.getConnection();
    const affectedRows = await this.lectureRepository.delete(id, connection);
    db.releaseConnection(connection);

    //affectedRows 체크 delete 값이 없다면 affectedRows 값이 0이며 id로 조회한 강의 값이 없는 경우로 DoesNotExistError 반환
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist lecture by id for delete");
    }

    return "Sucess delete lecture";
  };

  private MakeQuery = (query: ILectureQuery): ILectureSqlParams => {
    let order = "";
    if (!query.order) {
      order = "lecture.id";
    } else {
      order = "lecture.studentNum";
    }

    let sql: ILectureSqlParams = {
      order,
      include: [
        {
          model: "category",
          require: true,
          on: "lecture.categoryId = category.id",
        },
        {
          model: "teacher",
          require: true,
          on: "lecture.teacherId = teacher.id",
        },
      ],
      limit: query.limit,
    };

    if (query.title) {
      sql.where = [{ title: `${query.title}` }];
    } else if (query.teacherName) {
      sql.where = [{ teacherName: `${query.teacherName}` }];
    } else if (query.student) {
      sql.where = [{ studentId: query.student }];
      sql.include.push({
        model: "enrollment",
        require: false,
        on: "enrollment.lectureId = lecture.id",
      });
    }

    if (query.category) {
      if (!sql.where) {
        sql.where = [{ categoryId: query.category }];
      } else {
        sql.where.push({ categoryId: query.category });
      }
    }
    return sql;
  };

  private makeLectureDetailWithStudent = (
    lecture: Array<ILectureDetail>
  ): IManufactureLectureDetail => {
    const students: Array<ILectureDetailStudent> = [];
    const lectureDetail = lecture.map((lecturecols: ILectureColDetail) => {
      const { student_id, student_name, enrollmentAt, ...lectureInfo } =
        lecturecols;
      if (student_id) {
        students.push({
          id: student_id,
          name: student_name,
          enrollmentAt: this.date.formatDate(enrollmentAt),
        });
      }
      return lectureInfo;
    });
    return { ...lectureDetail[0], students };
  };

  private checkValidReference = async (
    lectures: Array<ILecture>
  ): Promise<void> => {
    let categoryIds: Array<number> = [];
    let teacherIds: Array<number> = [];

    //강의 생성 시 존재하는 값 참조하는지 확인하기 위해 카테고리, 강사 테이블 확인
    lectures.forEach((lecture) => {
      categoryIds.push(lecture.categoryId);
      teacherIds.push(lecture.teacherId);
    });
    //중복 값 제거
    categoryIds = [...new Set(categoryIds)];
    teacherIds = [...new Set(teacherIds)];

    const category = await this.categoryRepository.findByIds(categoryIds);
    const teacher = await this.teacherRepository.findByIds(teacherIds);

    //검색하는 고유 id 갯수와 id로 검색한 테이블의 결과값이 다르다면 없는 id로 검색한 경우 DoesNotExistError 반환
    if (
      categoryIds.length !== category.length ||
      teacherIds.length !== teacher.length
    ) {
      throw new DoesNotExistError("Can not ref not exist value");
    }
  };

  private checkEnrollmentedExist = async (id: number): Promise<void> => {
    //수강 테이블에 강의 id로 조회 값이 있는 경우 수강생이 있는 경우로 삭제 불가 ConflictError 반환
    const enrollments = await this.enrollmentRepository.findById({
      lectureId: id,
    });

    if (enrollments.length > 0) {
      throw new ConflictError(
        "Can not delete lecture becuse exist enrollment student"
      );
    }
  };
}
