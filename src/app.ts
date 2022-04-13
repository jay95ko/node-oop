import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import Container from "typedi";
import { LectureController } from "./controller/lecture";
import { EnrollmentController } from "./controller/enrollment";
import { StudentRouter } from "./router/student";
import { LectureRouter } from "./router/lecture";
import { EnrollmentRouter } from "./router/enrollment";

class App {
  public app: express.Application;
  constructor() {
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
    const studentRouter = Container.get(StudentRouter);
    const lectureRouter = Container.get(LectureRouter);
    const enrollmentRouter = Container.get(EnrollmentRouter);

    this.app.use("/student", studentRouter.router);
    this.app.use("/lecture", lectureRouter.router);
    this.app.use("/enrollment", enrollmentRouter.router);

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
export const app = new App().app;
