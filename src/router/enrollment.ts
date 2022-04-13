import express from "express";
import { Service } from "typedi";
import { EnrollmentController } from "../controller/enrollment";
import { validateCreateEnrollment } from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

@Service()
export class EnrollmentRouter {
  public router = express.Router();
  constructor(private enrollmentController: EnrollmentController) {
    this.init()
  }

  private init() {
  // POST /enrollment
  this.router.post(
    "/",
    asyncWrapper(validateCreateEnrollment),
    asyncWrapper(this.enrollmentController.create)
  );
  }
}