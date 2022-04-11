import { Request, Response } from "express";
import { Service } from "typedi";
import { ILectureQuery } from "../modules/interface/lecture.interface";
import { LectureService } from "../service/lecture";

@Service()
export class LectureController {
  constructor(private lectureService: LectureService) {}

  getList = async (req: Request, res: Response) => {
    const { query } = req;

    const result = await this.lectureService.getLectureList(query);

    res.status(200).send({ result });
  };

  getOne = async (req: Request, res: Response) => {
    const { params } = req;

    res
      .status(200)
      .send({ result: await this.lectureService.getLecture(+params.id) });
  };

  create = async (req: Request, res: Response) => {
    const { body } = req;

    res
      .status(201)
      .send({ result: await this.lectureService.createLecture(body) });
  };

  update = async (req: Request, res: Response) => {
    const { params, body } = req;

    res.status(200).send({
      result: await this.lectureService.updateLecture(+params.id, body),
    });
  };

  delete = async (req: Request, res: Response) => {
    const { params } = req;

    res
      .status(204)
      .send({ result: await this.lectureService.deleteLecture(+params.id) });
  };
}
