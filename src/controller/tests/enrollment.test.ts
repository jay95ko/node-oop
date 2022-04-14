import "reflect-metadata";
import httpMocks from "node-mocks-http";
import Container from "typedi";
import { EnrollmentController } from "../enrollment";
import { StubEnrollmentService } from "../../modules/stub/service/stbu.enrollment.service";
import { EnrollmentReopsitory } from "../../database/repository/elrollment";
import { LectureReopsitory } from "../../database/repository/lecture";
import { StudentReopsitory } from "../../database/repository/student";
import Date from "../../util/date.util";

describe("EnrollmentController", () => {
  let enrollmentController: EnrollmentController;
  beforeEach(() => {
    const studentRepository = Container.get(StudentReopsitory);
    const lectureRepository = Container.get(LectureReopsitory);
    const enrollmentReopsitory = Container.get(EnrollmentReopsitory);
    const stubsEnrollmentService = new StubEnrollmentService(
      enrollmentReopsitory,
      lectureRepository,
      studentRepository
    );
    enrollmentController = new EnrollmentController(stubsEnrollmentService);
  });

  describe("수강신청 컨트롤러", () => {
    it('수강신청 성공 되었을 때 "Sucess create 1 of enrollment" 반환', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await enrollmentController.create(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getData().result).toEqual(
        "Sucess create 1 of enrollment"
      );
    });
  });
});
