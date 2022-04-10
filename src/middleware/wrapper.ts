import { NextFunction, Request, Response } from "express";

export const asyncWrapper =
  (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
// export const wrapper =
//   (fn: any) => (req: Request, res: Response, next: NextFunction) => {
//     try {
//       fn(req, res, next);
//     } catch (err) {
//       next(err);
//     }
//   };
