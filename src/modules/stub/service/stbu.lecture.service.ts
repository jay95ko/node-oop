import { CategoryRepository } from "../../../database/repository/category";
import { EnrollmentRepository } from "../../../database/repository/enrollment";
import { LectureRepository } from "../../../database/repository/lecture";
import { TeacherRepository } from "../../../database/repository/teacher";
import { LectureService } from "../../../service/lecture";
import Date from "../../../util/date.util";
import {
  ILectureList,
  IManufactureLectureDetail,
} from "../../interface/lecture.interface";

export class StubLectureService extends LectureService {
  constructor(
    lectureRepository: LectureRepository,
    categoryRepository: CategoryRepository,
    teacherRepository: TeacherRepository,
    enrollmentRepository: EnrollmentRepository,
    date: Date
  ) {
    super(
      lectureRepository,
      categoryRepository,
      teacherRepository,
      enrollmentRepository,
      date
    );
  }
  getLectureList = async (): Promise<Array<ILectureList>> => {
    const lectureList: Array<ILectureList> = [
      {
        id: 4,
        title: "테스트3 강좌명",
        description: "테스트3 강좌 설명입니다.",
        category: "웹",
        price: 30000,
        studentNum: 835,
        createdAt: "2022-04-06T07:43:32.000Z",
        teacher: "고준영",
      },
      {
        id: 6,
        title: "테스트 강좌명",
        description: "테스트 강좌 설명입니다.",
        category: "웹",
        price: 10000,
        studentNum: 833,
        createdAt: "2022-04-06T07:57:49.000Z",
        teacher: "고준영",
      },
    ];
    return lectureList;
  };

  getLecture = async (): Promise<IManufactureLectureDetail> => {
    const lectureDetail: IManufactureLectureDetail = {
      id: 10,
      title: "테스트2 강좌명",
      description: "테스트2 강좌 설명입니다.",
      category: "웹",
      price: 20000,
      studentNum: 10,
      createdAt: "2022-04-06T08:00:25.000Z",
      updatedAt: "2022-04-06T08:00:25.000Z",
      students: [
        {
          id: 14,
          name: "테스트사용자",
          enrollmentAt: "2022.04.06 15:49:21",
        },
        {
          id: 14,
          name: "테스트사용자",
          enrollmentAt: "2022.04.06 15:49:21",
        },
      ],
    };
    return lectureDetail;
  };

  createLecture = async (): Promise<string> => {
    return "Success create 1 of lecture";
  };

  updateLecture = async (): Promise<string> => {
    return "Success update lecture";
  };

  deleteLecture = async (): Promise<string> => {
    return "Success delete lecture";
  };
}
