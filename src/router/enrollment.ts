import express from "express";
import { Service } from "typedi";
import { EnrollmentController } from "../controller/enrollment";
import { validateCreateEnrollment } from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

@Service()
export class EnrollmentRouter {
  static router = express.Router();
  constructor(private enrollmentController: EnrollmentController) {
    this.init();
  }

  protected init() {
    // POST /enrollment
    EnrollmentRouter.router.post(
      "/",
      asyncWrapper(validateCreateEnrollment),
      asyncWrapper(this.enrollmentController.create)
    );
  }
}
