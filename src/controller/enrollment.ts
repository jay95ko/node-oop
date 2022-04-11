import { Request, Response } from "express";
import { Service } from "typedi";
import { EnrollmentService } from "../service/enrollment";

@Service()
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  create = async (req: Request, res: Response) => {
    const { body } = req;
    const result = await this.enrollmentService.createEnrollment(body);
    res.status(201).send({ result });
  };
}
