import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ValidateError from "../modules/errors/validate.error";

export const validateCreateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: object = req.body;
  const studentSchema = Joi.object().keys({
    name: Joi.string().min(1).max(45).required(),
    email: Joi.string().email().required(),
  });

  try {
    await studentSchema.validateAsync(body);
  } catch (err) {
    throw new ValidateError("Validate error occer");
  }
  next();
};
