import { Service } from "typedi";

@Service()
export class EnrollmentService {
  constructor() {}

  createEnrollment = () => {
    return "수강신청";
  };
}
