import { Request, Response } from "express";
import { Service } from "typedi";
import { LectureService } from "../service/lecture";

@Service()
export class LectureController {
  constructor(private lectureService: LectureService) {}

  getList = (req: Request, res: Response) => {
    const result = this.lectureService.getLectureList();
    res.send({ result });
  };

  getOne = (req: Request, res: Response) => {
    const result = this.lectureService.getLecture();
    res.send({ result });
  };

  create = (req: Request, res: Response) => {
    const result = this.lectureService.createLecture();
    res.send({ result });
  };

  update = (req: Request, res: Response) => {
    const result = this.lectureService.updateLecture();
    res.send({ result });
  };

  delete = (req: Request, res: Response) => {
    res.send({ result: this.lectureService.deleteLecture(); });
  };
}
