import "reflect-metadata";
import httpMocks from "node-mocks-http";
import Container from "typedi";
import { EnrollmentController } from "../enrollment";
import { StubEnrollmentService } from "../../modules/stub/service/stbu.enrollment.service";
import { EnrollmentRepository } from "../../database/repository/enrollment";
import { LectureRepository } from "../../database/repository/lecture";
import { StudentRepository } from "../../database/repository/student";

describe("EnrollmentController", () => {
  let enrollmentController: EnrollmentController;
  beforeEach(() => {
    const studentRepository = Container.get(StudentRepository);
    const lectureRepository = Container.get(LectureRepository);
    const enrollmentRepository = Container.get(EnrollmentRepository);
    const stubsEnrollmentService = new StubEnrollmentService(
      enrollmentRepository,
      lectureRepository,
      studentRepository
    );
    enrollmentController = new EnrollmentController(stubsEnrollmentService);
  });

  describe("수강신청 컨트롤러", () => {
    it('수강신청 성공 되었을 때 "Success create 1 of enrollment" 반환', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await enrollmentController.create(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getData().result).toEqual(
        "Success create 1 of enrollment"
      );
    });
  });
});
