import { Service } from "typedi";
import { CategoryReopsitory } from "../database/model/category";
import { EnrollmentReopsitory } from "../database/model/elrollment";
import { LectureReopsitory } from "../database/model/lecture";
import { TeacherReopsitory } from "../database/model/teacher";
import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import ConflictError from "../modules/errors/conflit.error";
import DBError from "../modules/errors/db.error";
import {
  ILecture,
  ILectureDetail,
  ILectureQuery,
  ILectureUpdate,
} from "../modules/interface/lecture.interface";
import Date from "../util/date.util";

@Service()
export class LectureService {
  constructor(
    private lectureRepository: LectureReopsitory,
    private categoryRepository: CategoryReopsitory,
    private teacherRepository: TeacherReopsitory,
    private enrollmentRepository: EnrollmentReopsitory,
    private date: Date
  ) {}

  getLectureList = async (query: ILectureQuery) => {
    // console.log(page, order, category, title, teacherName, student);
    // console.log(query);
    const lectures = await this.lectureRepository.find({ query });
    return "강의 리스트";
  };

  getLecture = async (id: number) => {
    let lectures = await this.lectureRepository.findOne({ id });
    const students: Array<any> = [];

    lectures = lectures.map((lecture: ILectureDetail) => {
      const { student_id, student_name, enrollmentAt, ...otherLecture } =
        lecture;
      if (student_id) {
        students.push({
          id: student_id,
          name: student_name,
          enrollmentAt: this.date.formatDate(enrollmentAt),
        });
      }

      return otherLecture;
    });
    const result = lectures[0];
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
      throw new DBError("Can not ref not exist value");
    }

    const result = await this.lectureRepository.create(lectures);

    return `Sucess create ${result.length} of lecture`;
  };

  updateLecture = async (id: number, lecture: ILectureUpdate) => {
    const affectedRows = await this.lectureRepository.update(id, lecture);
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist lecture for update");
    }
    return "Sucess update lecture";
  };

  deleteLecture = async (id: number) => {
    const enrollments = await this.enrollmentRepository.findById(id);

    if (enrollments.length > 0) {
      throw new ConflictError(
        "Can not delete lecture becuse exist enrollment student"
      );
    }

    const affectedRows = await this.lectureRepository.delete(id);
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist lecture by id for delete");
    }

    return "Sucess delete lecture";
  };
}
