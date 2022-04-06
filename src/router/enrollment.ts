import express from "express";
import { EnrollmentController } from "../controller/enrollment";

const router = express.Router();

export default function studentRouter(
  enrollmentController: EnrollmentController
) {
  // POST /enrollment
  router.post("/", enrollmentController.create);

  return router;
}
