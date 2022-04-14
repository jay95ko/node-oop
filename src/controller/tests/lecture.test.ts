import "reflect-metadata";
import httpMocks from "node-mocks-http";
import Container from "typedi";
import { CategoryReopsitory } from "../../database/repository/category";
import { EnrollmentReopsitory } from "../../database/repository/elrollment";
import { LectureReopsitory } from "../../database/repository/lecture";
import { TeacherReopsitory } from "../../database/repository/teacher";
import Date from "../../util/date.util";
import { LectureController } from "../lecture";
import { StubLectureService } from "../../modules/stub/service/stbu.lecture.service";

describe("LectureController", () => {
  let lectureController: LectureController;
  beforeEach(() => {
    const lectureRepository = Container.get(LectureReopsitory);
    const enrollmentRepository = Container.get(EnrollmentReopsitory);
    const categoryRepository = Container.get(CategoryReopsitory);
    const teacherRepository = Container.get(TeacherReopsitory);
    const date = Container.get(Date);
    const stubsLectureService = new StubLectureService(
      lectureRepository,
      categoryRepository,
      teacherRepository,
      enrollmentRepository,
      date
    );
    lectureController = new LectureController(stubsLectureService);
  });

  describe("강의 목록 컨트롤러", () => {
    it("강의 목록 배열로 반환", async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const lectureList = [
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

      await lectureController.getList(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getData().result).toEqual(lectureList);
    });
  });
  describe("강의 정보 컨트롤러", () => {
    it("강의가 수강생의 정보가 포함된 강의 상세정보 반환", async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const lecture = {
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

      await lectureController.getOne(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getData().result).toEqual(lecture);
    });
  });

  describe("강의 생성 컨트롤러", () => {
    it('강의 생성 성공 되었을 때 "Sucess create 1 of lecture" 반환', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await lectureController.create(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getData().result).toEqual("Sucess create 1 of lecture");
    });
  });

  describe("강의 수정 컨트롤러", () => {
    it('강의 수정 성공 되었을 때 "Sucess update lecture" 반환', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await lectureController.update(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getData().result).toEqual("Sucess update lecture");
    });
  });

  describe("강의 삭제 컨트롤러", () => {
    it('강의 삭제 성공 되었을 때 "Sucess delete lecture" 반환', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await lectureController.delete(request, response);

      expect(response.statusCode).toBe(204);
      expect(response._getData().result).toEqual("Sucess delete lecture");
    });
  });
});
