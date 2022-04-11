import { Service } from "typedi";

import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import ConflictError from "../modules/errors/conflit.error";
import {
  ILecture,
  ILectureColDetail,
  ILectureList,
  ILectureQuery,
  ILectureSqlParams,
  ILectureUpdate,
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

  getLectureList = async (
    reqQuery: ILectureQuery
  ): Promise<Array<ILectureList>> => {
    let order = "";
    if (!reqQuery.order) {
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
      limit: reqQuery.limit,
    };

    if (reqQuery.title) {
      sql.where = [{ title: `${reqQuery.title}` }];
    } else if (reqQuery.teacherName) {
      sql.where = [{ teacherName: `${reqQuery.teacherName}` }];
    } else if (reqQuery.student) {
      sql.where = [{ studentId: reqQuery.student }];
      sql.include.push({
        model: "enrollment",
        require: false,
        on: "enrollment.lectureId = lecture.id",
      });
    }

    if (reqQuery.category) {
      if (!sql.where) {
        sql.where = [{ categoryId: reqQuery.category }];
      } else {
        sql.where.push({ categoryId: reqQuery.category });
      }
    }

    const lectures = await this.lectureRepository.find(sql);
    return lectures;
  };

  getLecture = async (id: number) => {
    let lecture = await this.lectureRepository.findOne(id);
    if (lecture.length < 1) {
      throw new DoesNotExistError("Does not exist lecture");
    }

    const students: Array<any> = [];

    lecture = lecture.map((lecturecols: ILectureColDetail) => {
      const { student_id, student_name, enrollmentAt, ...otherLecture } =
        lecturecols;
      if (student_id) {
        students.push({
          id: student_id,
          name: student_name,
          enrollmentAt: this.date.formatDate(enrollmentAt),
        });
      }
      return otherLecture;
    });
    const result = lecture[0];
    result.students = students;

    return result;
  };

  createLecture = async (lectures: Array<ILecture>) => {
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

    const category = await this.categoryRepository.findListById(categoryIds);
    const teacher = await this.teacherRepository.findListById(teacherIds);

    //검색하는 고유 id 갯수와 id로 검색한 테이블의 결과값이 다르다면 없는 id로 검색한 경우
    if (
      categoryIds.length !== category.length ||
      teacherIds.length !== teacher.length
    ) {
      throw new DoesNotExistError("Can not ref not exist value");
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const result = await this.lectureRepository.create(lectures, connection);

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

  updateLecture = async (id: number, lecture: ILectureUpdate) => {
    const connection = await db.getConnection();
    const affectedRows = await this.lectureRepository.update(
      id,
      lecture,
      connection
    );
    db.releaseConnection(connection);
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist lecture for update");
    }
    return "Sucess update lecture";
  };

  deleteLecture = async (id: number) => {
    const enrollments = await this.enrollmentRepository.findById({
      lectureId: id,
    });

    if (enrollments.length > 0) {
      throw new ConflictError(
        "Can not delete lecture becuse exist enrollment student"
      );
    }

    const connection = await db.getConnection();
    const affectedRows = await this.lectureRepository.delete(id, connection);
    db.releaseConnection(connection);
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist lecture by id for delete");
    }

    return "Sucess delete lecture";
  };
}
