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

export const validateCreateLecture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: object = req.body;
  const lectureSchema = Joi.object().keys({
    title: Joi.string().min(1).max(45).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().integer().positive().required(),
    teacherId: Joi.number().integer().positive().required(),
    categoryId: Joi.number().integer().positive().required(),
  });

  const schemaArray = Joi.array().items(lectureSchema).max(10);

  try {
    await schemaArray.validateAsync(body);
  } catch (err) {
    throw new ValidateError("Validate error occer");
  }
  next();
};

export const validateUpdateLecture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: object = req.body;
  const lectureSchema = Joi.object().keys({
    title: Joi.string().min(1).max(45).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().integer().positive().required(),
    expose: Joi.number().integer().positive().required().max(1),
  });

  try {
    await lectureSchema.validateAsync(body);
  } catch (err) {
    throw new ValidateError("Validate error occer");
  }
  next();
};

export const validateGetLectureList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query: object = req.query;
  const lectureSchema = Joi.object().keys({
    limit: Joi.number().integer().positive().optional(),
    order: Joi.string().optional().valid("student"),
    category: Joi.number().integer().positive().optional(),
    title: Joi.string().optional(),
    teacherName: Joi.string().optional(),
    student: Joi.number().integer().positive().optional(),
  });

  try {
    await lectureSchema.validateAsync(query);
  } catch (err) {
    throw new ValidateError("Validate error occer");
  }
  next();
};

export const validateCreateEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: object = req.body;
  const enrollmentSchema = Joi.object().keys({
    studentId: Joi.number().integer().positive().required(),
    lectureIds: Joi.array().items(Joi.number().integer().positive()).required(),
  });

  try {
    await enrollmentSchema.validateAsync(body);
  } catch (err) {
    throw new ValidateError("Validate error occer");
  }
  next();
};
