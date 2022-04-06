import { Service } from "typedi";

@Service()
export class LectureService {
  constructor() {}

  getLectureList = () => {
    return "강의 리스트";
  };

  getLecture = () => {
    return "강의 상세정보";
  };

  createLecture = () => {
    return "강의 생성";
  };

  updateLecture = () => {
    return "강의 수정";
  };

  deleteLecture = () => {
    return "강의 삭제";
  };
}
