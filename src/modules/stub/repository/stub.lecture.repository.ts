import { LectureRepository } from "../../../database/repository/lecture";
import Date from "../../../util/date.util";
import {
  ILecture,
  ILectureAddCount,
  ILectureUpdate,
} from "../../interface/lecture.interface";

export class StubLectureRepository extends LectureRepository {
  private lectureListByIdResult = [
    {
      id: 1,
      title: "테스트 강좌명",
      description: "테스트 강좌 설명입니다.",
      price: 10000,
      studentNum: 0,
      expose: 1,
      createdAt: "2022-04-06T07:39:24.000Z",
      updatedAt: "2022-04-06T07:39:24.000Z",
      deletedAt: null,
      categoryId: 1,
      teacherId: 1,
    },
    {
      id: 2,
      title: "테스트2 강좌명",
      description: "테스트2 강좌 설명입니다.",
      price: 20000,
      studentNum: 0,
      expose: 1,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      deletedAt: null,
      categoryId: 1,
      teacherId: 1,
    },
    {
      id: 3,
      title: "테스트3 강좌명",
      description: "테스트3 강좌 설명입니다.",
      price: 30000,
      studentNum: 0,
      expose: 1,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      deletedAt: null,
      categoryId: 1,
      teacherId: 1,
    },
    {
      id: 4,
      title: "테스트4 강좌명",
      description: "테스트4 강좌 설명입니다.",
      price: 40000,
      studentNum: 0,
      expose: 1,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      deletedAt: null,
      categoryId: 1,
      teacherId: 1,
    },
  ];
  private createLectureResult = [
    [
      {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 845,
        info: "",
        serverStatus: 3,
        warningStatus: 0,
      },
      undefined,
    ],
    [
      {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 846,
        info: "",
        serverStatus: 3,
        warningStatus: 0,
      },
      undefined,
    ],
  ];
  private lectureDetailResult = [
    {
      id: 3,
      title: "테스트2 강좌명",
      description: "테스트2 강좌 설명입니다.",
      category: "웹",
      price: 20000,
      studentNum: 0,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      student_id: 14,
      student_name: "테스트사용자",
      enrollmentAt: "2022-04-09T03:01:22.000Z",
    },
    {
      id: 3,
      title: "테스트2 강좌명",
      description: "테스트2 강좌 설명입니다.",
      category: "웹",
      price: 20000,
      studentNum: 0,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      student_id: 15,
      student_name: "테스트사용자",
      enrollmentAt: "2022-04-09T03:01:24.000Z",
    },
    {
      id: 3,
      title: "테스트2 강좌명",
      description: "테스트2 강좌 설명입니다.",
      category: "웹",
      price: 20000,
      studentNum: 0,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      student_id: 16,
      student_name: "테스트사용자",
      enrollmentAt: "2022-04-09T03:01:25.000Z",
    },
    {
      id: 3,
      title: "테스트2 강좌명",
      description: "테스트2 강좌 설명입니다.",
      category: "웹",
      price: 20000,
      studentNum: 0,
      createdAt: "2022-04-06T07:43:32.000Z",
      updatedAt: "2022-04-06T07:43:32.000Z",
      student_id: 17,
      student_name: "테스트사용자",
      enrollmentAt: "2022-04-09T03:01:27.000Z",
    },
  ];

  private lectureListResult = [
    {
      id: 838,
      title: "테스트10",
      description: "테스트3 강좌 설명입니다.",
      category: "알고리즘",
      price: 30000,
      studentNum: 1,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "고준영",
    },
    {
      id: 837,
      title: "테스트9",
      description: "테스트3 강좌 설명입니다.",
      category: "앱",
      price: 30000,
      studentNum: 2,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "송치헌",
    },
  ];

  private lectureListResultStudentNumOrder = [
    {
      id: 837,
      title: "테스트9",
      description: "테스트3 강좌 설명입니다.",
      category: "앱",
      price: 30000,
      studentNum: 2,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "송치헌",
    },
    {
      id: 838,
      title: "테스트10",
      description: "테스트3 강좌 설명입니다.",
      category: "알고리즘",
      price: 30000,
      studentNum: 1,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "고준영",
    },
  ];

  private lectureListFilterCategoryIdResult = [
    {
      id: 837,
      title: "테스트9",
      description: "테스트3 강좌 설명입니다.",
      category: "앱",
      price: 30000,
      studentNum: 2,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "송치헌",
    },
  ];

  private lectureListFiltertitleResult = [
    {
      id: 838,
      title: "테스트10",
      description: "테스트3 강좌 설명입니다.",
      category: "알고리즘",
      price: 30000,
      studentNum: 1,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "고준영",
    },
  ];

  private lectureListFilterTeacherResult = [
    {
      id: 838,
      title: "테스트10",
      description: "테스트3 강좌 설명입니다.",
      category: "알고리즘",
      price: 30000,
      studentNum: 1,
      createdAt: "2022-04-08T11:54:54.000Z",
      teacher: "고준영",
    },
  ];

  constructor(date: Date, tableName: string) {
    super(date, tableName);
  }

  find = async (params: any) => {
    if (params.order === "lecture.studentNum") {
      return this.lectureListResultStudentNumOrder;
    } else if (!params.where) {
      return this.lectureListResult;
    } else if (
      params.where[0]?.title === "테스트9" &&
      params.where[1]?.categoryId === 2
    ) {
      return this.lectureListFilterCategoryIdResult;
    } else if (params.where[0]?.title === "테스트10") {
      return this.lectureListFiltertitleResult;
    } else if (params.where[0]?.categoryId === 2) {
      return this.lectureListFilterCategoryIdResult;
    } else if (params.where[0]?.teacherName === "고준영") {
      return this.lectureListFilterTeacherResult;
    } else if (params.where[0]?.studentId === 1) {
      return [];
    }
  };

  findByIds = async (ids: Array<number>) => {
    return this.lectureListByIdResult.filter((lecture) =>
      ids.includes(lecture.id)
    );
  };

  create = async (lecture: ILecture, connection: any) => {
    if (lecture.title === "1") throw new Error("DB에러 검증을 위한 에러");
    return this.createLectureResult;
  };

  findOne = async (id: number) => {
    if (this.lectureDetailResult[0].id === id) return this.lectureDetailResult;
    return [];
  };

  update = async (
    id: number,
    lecture: ILectureUpdate | ILectureAddCount,
    connection: any
  ) => {
    if (id === 4) return 0; // 수강신청시 강의에 수강생 수 추가중 에러발생 로직 검사를 위해 발생
    let result = 0;
    this.lectureListByIdResult.forEach((lecture) => {
      if (lecture.id === id) result = 1;
    });
    return result;
  };

  delete = async (id: number, connection: any) => {
    let result = 0;
    this.lectureListByIdResult.forEach((lecture) => {
      if (lecture.id === id) result = 1;
    });
    return result;
  };
}
