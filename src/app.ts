import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import Container from "typedi";
import { StudentRouter } from "./router/student";
import { LectureRouter } from "./router/lecture";
import { EnrollmentRouter } from "./router/enrollment";

class App {
  public app: express.Application;
  constructor(
    private student: StudentRouter,
    private lecture: LectureRouter,
    private enrollment: EnrollmentRouter,
  ) {
    this.app = express();
    this.setMiddleware();
    this.registerRoute();
  }

  //미들웨어 등록
  setMiddleware() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  //라우터 등록
  registerRoute() {
    this.app.use("/student", this.student.router);
    this.app.use("/lecture", this.lecture.router);
    this.app.use("/enrollment", this.enrollment.router);

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.sendStatus(404);
    });
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        res
          .status(error.status)
          .send({ errorMessage: error.message, ...error });
      }
    );
  }
}

const studentRouter = Container.get(StudentRouter);
const lectureRouter = Container.get(LectureRouter);
const enrollmentRouter = Container.get(EnrollmentRouter);

export const app = new App(studentRouter, lectureRouter, enrollmentRouter).app;
