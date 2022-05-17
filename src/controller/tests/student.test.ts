import "reflect-metadata";
import httpMocks from "node-mocks-http";
import { StudentController } from "../student";
import { StubStudentService } from "../../modules/stub/service/stub.student.service";
import { StudentRepository } from "../../database/repository/student";
import Container from "typedi";

describe("StudentController", () => {
  let studentController: StudentController;
  beforeEach(() => {
    const studentRepository = Container.get(StudentRepository);
    const stubsStudentService = new StubStudentService(studentRepository);
    studentController = new StudentController(stubsStudentService);
  });

  describe("수강생 생성 컨트롤러", () => {
    it('수강생이 생성 되었을 때 "Success create student" 반환', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await studentController.createStudent(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getData().result).toEqual("Success create student");
    });
  });

  describe("수강생 탈퇴 컨트롤러", () => {
    it("수강생이 삭제 되었을 때 statusCode 204 반환", async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await studentController.deleteStudent(request, response);

      expect(response.statusCode).toBe(204);
    });
  });
});
