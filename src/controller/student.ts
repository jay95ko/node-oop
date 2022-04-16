import { Request, Response } from "express";
import { Service } from "typedi";
import { StudentService } from "../service/student";

@Service()
export class StudentController {
  constructor(private studentService: StudentService) {}

  //수강생 회원가입
  createStudent = async (req: Request, res: Response) => {
    const { body } = req;

    res
      .status(201)
      .send({ result: await this.studentService.createStudent(body) });
  };

  //수강생 탈퇴
  deleteStudent = async (req: Request, res: Response) => {
    const { params } = req;

    res.status(204).send({
      result: await this.studentService.deleteStudent(parseInt(params.id)),
    });
  };
}
