import express from "express";
import { StudentController } from "../controller/student";

const router = express.Router();

export default function studentRouter(studentController: StudentController) {
  // POST /student
  router.post("/", studentController.createStudent);

  // DELETE /student/:id
  router.delete("/:id", studentController.deleteStudent);

  return router;
}
