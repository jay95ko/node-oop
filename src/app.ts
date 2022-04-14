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
  constructor() {
    // private enrollment: EnrollmentRouter // private lecture: LectureRouter, // private student: StudentRouter,
    this.app = express();
    this.setMiddleware();
    this.createRouter();
    this.registerRoute();
  }

  //미들웨어 등록
  setMiddleware() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  //의존성이 주입된 라우터 객체 생성
  createRouter() {
    Container.get(StudentRouter);
    Container.get(LectureRouter);
    Container.get(EnrollmentRouter);
  }

  //라우터 등록
  registerRoute() {
    this.app.use("/student", StudentRouter.router);
    this.app.use("/lecture", LectureRouter.router);
    this.app.use("/enrollment", EnrollmentRouter.router);

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
