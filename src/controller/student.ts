import { Request, Response } from "express";
import { Service } from "typedi";
import { StudentService } from "../service/student";

@Service()
export class StudentController {
  constructor(private studentService: StudentService) {}

  createStudent = async (req: Request, res: Response) => {
    res
      .status(201)
      .send({ result: await this.studentService.createStudent(req.body) });
  };

  deleteStudent = async (req: Request, res: Response) => {
    const { params } = req;

    res.send({ result: await this.studentService.deleteStudent(+params.id) });
  };
}
