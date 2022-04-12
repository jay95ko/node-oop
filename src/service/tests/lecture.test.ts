import "reflect-metadata";
import Container from "typedi";
import Date from "../../util/date.util";
import { StubEnrollmentRepository } from "../../modules/stub/repository/stub.enrollment.repository";
import { StubLectureRepository } from "../../modules/stub/repository/stub.lecture.repository";
import { StubTeacherRepository } from "../../modules/stub/repository/stub.teacher.repository";
import { StubCategoryRepository } from "../../modules/stub/repository/stub.category.repository";
import { LectureService } from "../lecture";
import {
  ILecture,
  ILectureUpdate,
} from "../../modules/interface/lecture.interface";
import DoesNotExistError from "../../modules/errors/alreadyExist.error copy";
import DBError from "../../modules/errors/db.error";
import ConflictError from "../../modules/errors/conflit.error";

describe("LectureService", () => {
  let lectureService: LectureService;
  beforeEach(() => {
    const date = Container.get(Date);
    const stubEnrollmentRepository = new StubEnrollmentRepository(
      date,
      "enrollment"
    );
    const stubLectureRepository = new StubLectureRepository(date, "lecture");
    const stubTeacherRepository = new StubTeacherRepository("teacher");
    const stubCategoryRepository = new StubCategoryRepository("category");
    lectureService = new LectureService(
      stubLectureRepository,
      stubCategoryRepository,
      stubTeacherRepository,
      stubEnrollmentRepository,
      date
    );
  });

  describe("강의 목록", () => {
    it("order 값이 student인 경우 존재하는 강의 목록 반환 수강생 수 많은순 반환", async () => {
      const lectureList = [
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

      const reqQuery = { order: "student" };

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });
    it("title 값이 '테스트10'인 경우 해당하는 title값과 같은 강의 목록 반환", async () => {
      const lectureList = [
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

      const reqQuery = { title: "테스트10" };

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });
    it("category 값이 2인 경우 해당하는 카테고리의 강의 목록 반환", async () => {
      const lectureList = [
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

      const reqQuery = { category: 2 };

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });
    it('teacherName 값이 "고준영"인 경우 해당하는 강사의 강의 목록 반환', async () => {
      const lectureList = [
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

      const reqQuery = { teacherName: "고준영" };

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });
    it("student 값이 1 인 경우 해당하는 수강생의 강의 목록 반환 이 케이스의 경우 없는 빈 배열 반환", async () => {
      const lectureList: Array<null> = [];

      const reqQuery = { student: 1 };

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });

    it("카테고리 값과 강의 검색값이 존재하는 category=2, title='테스트9'의 경우 해당하는 강의 리스트 반환", async () => {
      const lectureList = [
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

      const reqQuery = { title: "테스트9", category: 2 };

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });

    it("검색 조건이 없는 경우 강의 리스트 최신순 반환", async () => {
      const lectureList = [
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

      const reqQuery = {};

      const result = await lectureService.getLectureList(reqQuery);

      expect(result).toEqual(lectureList);
    });
  });

  describe("강의 상세정보", () => {
    it("해당하는 id로 강의 정보 있을시 강의 상세 정보 반환", async () => {
      const lectureDetail = {
        id: 3,
        title: "테스트2 강좌명",
        description: "테스트2 강좌 설명입니다.",
        category: "웹",
        price: 20000,
        studentNum: 0,
        createdAt: "2022-04-06T07:43:32.000Z",
        updatedAt: "2022-04-06T07:43:32.000Z",
        students: [
          {
            id: 14,
            name: "테스트사용자",
            enrollmentAt: "2022.04.09 12:01:22",
          },
          {
            id: 15,
            name: "테스트사용자",
            enrollmentAt: "2022.04.09 12:01:24",
          },
          {
            id: 16,
            name: "테스트사용자",
            enrollmentAt: "2022.04.09 12:01:25",
          },
          {
            id: 17,
            name: "테스트사용자",
            enrollmentAt: "2022.04.09 12:01:27",
          },
        ],
      };
      const id = 3;

      const result = await lectureService.getLecture(id);

      expect(result).toEqual(lectureDetail);
    });

    it("존재하지 않는 강의 id로 검색할 경우 DoesNotExistError 발생", async () => {
      const id = 4;

      await expect(async () => {
        await lectureService.getLecture(id);
      }).rejects.toThrowError(new DoesNotExistError("Does not exist lecture"));
    });
  });

  describe("강의 생성", () => {
    it("없는 카테고리의 id를 지정해서 강의 생성 할 경우 DoesNotExistError 발생", async () => {
      const lecture: Array<ILecture> = [
        {
          title: "노드",
          description: "노드 강좌 설명입니다.",
          price: 10000,
          teacherId: 1,
          categoryId: 1,
        },
        {
          title: "리엑트",
          description: "리엑트 강좌 설명입니다.",
          price: 20000,
          teacherId: 1,
          categoryId: 2,
        },
        {
          title: "TS",
          description: "TS 강좌 설명입니다.",
          price: 20000,
          teacherId: 1,
          categoryId: 3,
        },
      ];

      await expect(async () => {
        await lectureService.createLecture(lecture);
      }).rejects.toThrowError(
        new DoesNotExistError("Can not ref not exist value")
      );
    });
    it("없는 강사 id를 지정해서 강의 생성 할 경우 DoesNotExistError 발생 ", async () => {
      const lecture: Array<ILecture> = [
        {
          title: "노드",
          description: "노드 강좌 설명입니다.",
          price: 10000,
          teacherId: 1,
          categoryId: 1,
        },
        {
          title: "리엑트",
          description: "리엑트 강좌 설명입니다.",
          price: 20000,
          teacherId: 1,
          categoryId: 2,
        },
        {
          title: "TS",
          description: "TS 강좌 설명입니다.",
          price: 20000,
          teacherId: 4,
          categoryId: 2,
        },
      ];

      await expect(async () => {
        await lectureService.createLecture(lecture);
      }).rejects.toThrowError(
        new DoesNotExistError("Can not ref not exist value")
      );
    });

    it("DB에러가 발생한 경우 DBError 발생 ", async () => {
      const lecture: Array<ILecture> = [
        {
          title: "1",
          description: "노드 강좌 설명입니다.",
          price: 10000,
          teacherId: 1,
          categoryId: 1,
        },
        {
          title: "리엑트",
          description: "리엑트 강좌 설명입니다.",
          price: 20000,
          teacherId: 1,
          categoryId: 2,
        },
        {
          title: "TS",
          description: "TS 강좌 설명입니다.",
          price: 20000,
          teacherId: 1,
          categoryId: 2,
        },
      ];

      await expect(async () => {
        await lectureService.createLecture(lecture);
      }).rejects.toThrowError(new DBError("Lecture create error"));
    });

    it('존재하는 카테고리와 강사의 정보로 강의 생성시 생성 "Sucess create ${강의 수} of lecture" 반환 ', async () => {
      const lecture: Array<ILecture> = [
        {
          title: "노드",
          description: "노드 강좌 설명입니다.",
          price: 10000,
          teacherId: 1,
          categoryId: 1,
        },
        {
          title: "리엑트",
          description: "리엑트 강좌 설명입니다.",
          price: 20000,
          teacherId: 1,
          categoryId: 2,
        },
      ];

      const result = await lectureService.createLecture(lecture);

      expect(result).toEqual("Sucess create 2 of lecture");
    });
  });

  describe("강의 수정", () => {
    it("존재하지 않는 강의를 수정했을 경우 DoesNotExistError 발생", async () => {
      const lecture: ILectureUpdate = {
        title: "테스트 강좌명",
        description: "테스트 강좌 설명입니다.",
        price: 10000,
        expose: 1,
      };
      const id = 5;

      await expect(async () => {
        await lectureService.updateLecture(id, lecture);
      }).rejects.toThrowError(
        new DoesNotExistError("Does not exist lecture for update")
      );
    });

    it("강의 수정이 정상적으로 완료되었을 경우 Sucess update lecture 반환", async () => {
      const lecture: ILectureUpdate = {
        title: "테스트 강좌명",
        description: "테스트 강좌 설명입니다.",
        price: 10000,
        expose: 1,
      };
      const id = 1;

      const result = await lectureService.updateLecture(id, lecture);

      expect(result).toEqual("Sucess update lecture");
    });
  });

  describe("강의 삭제", () => {
    it("수강생이 있는 강의를 삭제하는 경우 ConflictError 발생", async () => {
      const id = 1;

      await expect(async () => {
        await lectureService.deleteLecture(id);
      }).rejects.toThrowError(
        new ConflictError(
          "Can not delete lecture becuse exist enrollment student"
        )
      );
    });

    it("존재하지 않는 강의를 삭제하는 경우 DoesNotError 발생", async () => {
      const id = 5;

      await expect(async () => {
        await lectureService.deleteLecture(id);
      }).rejects.toThrowError(
        new DoesNotExistError("Does not exist lecture by id for delete")
      );
    });

    it("강의 삭제가 정상적으로 완료되었을 경우 Sucess delete lecture 반환", async () => {
      const id = 2;

      const result = await lectureService.deleteLecture(id);

      expect(result).toEqual("Sucess delete lecture");
    });
  });
});
