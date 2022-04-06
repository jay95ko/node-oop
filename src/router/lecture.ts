import express from "express";
import { LectureController } from "../controller/lecture";
import {
  validateCreateLecture,
  validateGetLectureList,
  validateUpdateLecture,
} from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

const router = express.Router();

export default function LectureRouter(lectureController: LectureController) {
  // GET /lecture
  // Query params: page, order, category, title, teachername, student
  router.get(
    "/",
    asyncWrapper(validateGetLectureList),
    asyncWrapper(lectureController.getList)
  );

  // POST /lecture/:id
  router.post(
    "/",
    asyncWrapper(validateCreateLecture),
    asyncWrapper(lectureController.create)
  );

  // GET /lecture/:id
  router.get("/:id", asyncWrapper(lectureController.getOne));

  // PUT /lecture/:id
  router.put(
    "/:id",
    asyncWrapper(validateUpdateLecture),
    asyncWrapper(lectureController.update)
  );

  // DELETE /lecture/:id
  router.delete("/:id", asyncWrapper(lectureController.delete));

  return router;
}
