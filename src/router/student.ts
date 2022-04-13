import express from "express";
import { Service } from "typedi";
import { StudentController } from "../controller/student";
import { validateCreateStudent } from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

@Service()
export class StudentRouter {
  static router = express.Router();
  constructor(private studentController: StudentController) {
    this.init();
  }

  private init() {
    // POST /student
    StudentRouter.router.post(
      "/",
      asyncWrapper(validateCreateStudent),
      asyncWrapper(this.studentController.createStudent)
    );

    // DELETE /student/:id
    StudentRouter.router.delete(
      "/:id",
      asyncWrapper(this.studentController.deleteStudent)
    );
  }
}
