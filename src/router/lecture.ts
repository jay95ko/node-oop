import express from "express";
import { Service } from "typedi";
import { LectureController } from "../controller/lecture";
import {
  validateCreateLecture,
  validateGetLectureList,
  validateUpdateLecture,
} from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

@Service()
export class LectureRouter {
  static router = express.Router();
  constructor(private lectureController: LectureController) {
    this.init();
  }

  private init() {
    // GET /lecture
    // Query params: page, order, category, title, teachername, student
    LectureRouter.router.get(
      "/",
      asyncWrapper(validateGetLectureList),
      asyncWrapper(this.lectureController.getList)
    );

    // POST /lecture/:id
    LectureRouter.router.post(
      "/",
      asyncWrapper(validateCreateLecture),
      asyncWrapper(this.lectureController.create)
    );

    // GET /lecture/:id
    LectureRouter.router.get(
      "/:id",
      asyncWrapper(this.lectureController.getOne)
    );

    // PUT /lecture/:id
    LectureRouter.router.put(
      "/:id",
      asyncWrapper(validateUpdateLecture),
      asyncWrapper(this.lectureController.update)
    );

    // DELETE /lecture/:id
    LectureRouter.router.delete(
      "/:id",
      asyncWrapper(this.lectureController.delete)
    );
  }
}
