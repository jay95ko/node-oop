import "reflect-metadata";
import { StudentService } from "../student";
import Container from "typedi";
import Date from "../../util/date.util";
import { StubStudentRepository } from "../../modules/stub/repository/stub.student.repository";
import AlreadyExistError from "../../modules/errors/alreadyExist.error";
import DoesNotExistError from "../../modules/errors/alreadyExist.error copy";

describe("StudentService", () => {
  let studentService: StudentService;
  beforeEach(() => {
    const date = Container.get(Date);
    const stubsStudentRepository = new StubStudentRepository(date, "student");
    studentService = new StudentService(stubsStudentRepository);
  });

  describe("수강생 회원가입 서비스", () => {
    it('유일한 email로 회원가입시 "Sucess creste student" 반환', async () => {
      const student = {
        email: "inflab@inflab.com",
        name: "inflab",
      };

      const result = await studentService.createStudent(student);

      expect(result).toEqual("Sucess create student");
    });

    it("중복된 email로 회원가입시 AllreadyExistError 발생", async () => {
      const student = {
        email: "test@naver.com",
        name: "inflab",
      };

      await expect(async () => {
        await studentService.createStudent(student);
      }).rejects.toThrowError(
        new AlreadyExistError("Already exist student by email")
      );
    });
  });

  describe("수강생 탈퇴 서비스", () => {
    it('존재하는 id로 탈퇴시 "Sucess delete student"반환', async () => {
      const studentId = 1;

      const result = await studentService.deleteStudent(studentId);

      expect(result).toEqual("Sucess delete student");
    });

    it("존재하지 않는 id로 탈퇴시 DoesNotExistError 발생", async () => {
      const studentId = 2;

      await expect(async () => {
        await studentService.deleteStudent(studentId);
      }).rejects.toThrowError(
        new DoesNotExistError("Does not exist student by id for delete")
      );
    });
  });
});
