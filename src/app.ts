import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import Container from "typedi";
import { StudentController } from "./controller/student";
import { LectureController } from "./controller/lecture";
import { EnrollmentController } from "./controller/enrollment";
import studentRouter from "./router/student";
import LectureRouter from "./router/lecture";
import enrollmentRouter from "./router/enrollment";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.setMiddleware();
    this.registerRoute();
  }

  setMiddleware() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  registerRoute() {
    const studentController = Container.get(StudentController);
    const lectureController = Container.get(LectureController);
    const enrollmentController = Container.get(EnrollmentController);

    this.app.use("/student", studentRouter(studentController));
    this.app.use("/lecture", LectureRouter(lectureController));
    this.app.use("/enrollment", enrollmentRouter(enrollmentController));

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
