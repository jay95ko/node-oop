import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

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
    this.app.use(morgan("tiny"));
  }

  registerRoute() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.sendStatus(404);
    });
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.error(error);
        res.sendStatus(500);
      }
    );
  }
}
export const app = new App().app;
