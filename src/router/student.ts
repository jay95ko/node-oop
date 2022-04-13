import express from "express";
import { StudentController } from "../controller/student";
import { validateCreateStudent } from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

const router = express.Router();

export default function studentRouter(studentController: StudentController) {
  // POST /student
  router.post(
    "/",
    asyncWrapper(validateCreateStudent),
    asyncWrapper(studentController.createStudent)
  );

  // DELETE /student/:id
  router.delete("/:id", asyncWrapper(studentController.deleteStudent));

  return router;
}