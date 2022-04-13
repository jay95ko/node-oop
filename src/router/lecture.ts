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
  public router = express.Router();
  constructor(private lectureController: LectureController) {
    this.init()
  }

  private init() {
    // GET /lecture
  // Query params: page, order, category, title, teachername, student
  this.router.get(
    "/",
    asyncWrapper(validateGetLectureList),
    asyncWrapper(this.lectureController.getList)
  );

  // POST /lecture/:id
  this.router.post(
    "/",
    asyncWrapper(validateCreateLecture),
    asyncWrapper(this.lectureController.create)
  );

  // GET /lecture/:id
  this.router.get("/:id", asyncWrapper(this.lectureController.getOne));

  // PUT /lecture/:id
  this.router.put(
    "/:id",
    asyncWrapper(validateUpdateLecture),
    asyncWrapper(this.lectureController.update)
  );

  // DELETE /lecture/:id
  this.router.delete("/:id", asyncWrapper(this.lectureController.delete));
  }
}