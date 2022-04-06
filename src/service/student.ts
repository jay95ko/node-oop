import { Service } from "typedi";

@Service()
export class StudentService {
  constructor() {}

  createStudent = () => {
    return "create student service";
  };

  deleteStudent = () => {
    return "delete student service";
  };
}
