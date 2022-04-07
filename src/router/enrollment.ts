import express from "express";
import { EnrollmentController } from "../controller/enrollment";
import { validateCreateEnrollment } from "../middleware/validate";
import { asyncWrapper } from "../middleware/wrapper";

const router = express.Router();

export default function enrollmentRouter(
  enrollmentController: EnrollmentController
) {
  // POST /enrollment
  router.post(
    "/",
    asyncWrapper(validateCreateEnrollment),
    asyncWrapper(enrollmentController.create)
  );

  return router;
}
