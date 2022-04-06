import express from "express";
import { LectureController } from "../controller/lecture";

const router = express.Router();

export default function LectureRouter(lectureController: LectureController) {
  // GET /lecture
  // Query params: page, order, category, title, teachername, student
  router.get("/", lectureController.getList);

  // POST /lecture/:id
  router.post("/", lectureController.create);

  // GET /lecture/:id
  router.get("/:id", lectureController.getOne);

  // PUT /lecture/:id
  router.put("/:id", lectureController.update);

  // DELETE /lecture/:id
  router.delete("/:id", lectureController.delete);

  return router;
}
