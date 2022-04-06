import { Request, Response } from "express";
import { Service } from "typedi";
import { StudentService } from "../service/student";

@Service()
export class StudentController {
  constructor(private studentService: StudentService) {}

  createStudent = (req: Request, res: Response) => {
    const result = this.studentService.createStudent();
    res.send({ result });
  };

  deleteStudent = (req: Request, res: Response) => {
    res.send({ result: this.studentService.deleteStudent() });
  };
}
