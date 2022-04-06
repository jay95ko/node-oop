import { Request, Response } from "express";
import { Service } from "typedi";
import { EnrollmentService } from "../service/enrollment";

@Service()
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  create = (req: Request, res: Response) => {
    const result = this.enrollmentService.createEnrollment();
    res.send({ result });
  };
}
