import express from "express";
import { Service } from "typedi";
import { StudentController } from "../controller/student";
import { validateCreateStudent } from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

@Service()
export class StudentRouter {
  public router = express.Router();
  constructor(private studentController: StudentController) {
    this.init()
  }

  private init() {
    // POST /student
    this.router.post(
    "/",
    asyncWrapper(validateCreateStudent),
    asyncWrapper(this.studentController.createStudent))

    // DELETE /student/:id
    this.router.delete("/:id", asyncWrapper(this.studentController.deleteStudent))
  }
}