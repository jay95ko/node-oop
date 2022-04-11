import "reflect-metadata";
import Container from "typedi";
import Date from "../../util/date.util";
import { StubEnrollmentRepository } from "../../modules/stub/repository/stub.enrollment.repository";
import { EnrollmentService } from "../enrollment";
import { StubStudentRepository } from "../../modules/stub/repository/stub.student.repository";
import { StubLectureRepository } from "../../modules/stub/repository/stub.lecture.repository";
import DoesNotExistError from "../../modules/errors/alreadyExist.error copy";
import DBError from "../../modules/errors/db.error";

describe("StudentService", () => {
  let enrollmentService: EnrollmentService;
  beforeEach(() => {
    const date = Container.get(Date);
    const stubEnrollmentRepository = new StubEnrollmentRepository(
      date,
      "enrollment"
    );
    // const lectureRepository: LectureReopsitory,
    const stubStudentRepository = new StubStudentRepository(date, "student");
    const stubLectureRepository = new StubLectureRepository(date, "lecture");
    enrollmentService = new EnrollmentService(
      stubEnrollmentRepository,
      stubLectureRepository,
      stubStudentRepository,
      date
    );
  });

  describe("수강 신청", () => {
    describe("존재하는 회원의 id로 수강신청", () => {
      it('존재하는 강의들을 수강신청 시 "Sucess create ${과목수} of enrollment"반환 ', async () => {
        const newEnrollment = {
          studentId: 1,
          lectureIds: [1, 2],
        };

        const result = await enrollmentService.createEnrollment(newEnrollment);

        expect(result).toEqual("Sucess create 2 of enrollment");
      });

      it("존재하는 강의들을 수강신청 시 DB에러 발생 발생의 경우 DBError 반환 ", async () => {
        const newEnrollment = {
          studentId: 1,
          lectureIds: [1, 2, 3],
        };

        await expect(async () => {
          await enrollmentService.createEnrollment(newEnrollment);
        }).rejects.toThrowError(new DBError("Enrollment create error"));
      });

      it("존재하지 않는 강의를 수강신청 시 DoesNotError 발생", async () => {
        const newEnrollment = {
          studentId: 1,
          lectureIds: [4, 5, 6],
        };

        await expect(async () => {
          await enrollmentService.createEnrollment(newEnrollment);
        }).rejects.toThrowError(
          new DoesNotExistError("Can not enroll not exist lecture")
        );
      });
    });
  });

  describe("존재하지 않는 회원의 id로 수강신청", () => {
    it("강의 여부에 관계 없이 DoesNotExistError 발생", async () => {
      const newEnrollment = {
        studentId: 10,
        lectureIds: [2, 3, 4],
      };

      await expect(async () => {
        await enrollmentService.createEnrollment(newEnrollment);
      }).rejects.toThrowError(
        new DoesNotExistError("Can not enroll not exist student")
      );
    });
  });
});
