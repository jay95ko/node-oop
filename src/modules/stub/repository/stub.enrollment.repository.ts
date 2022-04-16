import { EnrollmentRepository } from "../../../database/repository/enrollment";
import Date from "../../../util/date.util";
import {
  IEnrollmentCreate,
  IEnrollmentFindById,
} from "../../interface/enrollment.interface";

export class StubEnrollmentRepository extends EnrollmentRepository {
  private existEnrollment = [
    {
      id: 1,
      studentId: 1,
      lectureId: 1,
    },
  ];
  private id = 1;
  constructor(date: Date, tableName: string) {
    super(date, tableName);
  }

  findById = async (params: IEnrollmentFindById) => {
    const key = Object.keys(params)[0];
    const value = Object.values(params)[0];
    if (key === "lectureId") {
      if (value === this.existEnrollment[0].lectureId) {
        return this.existEnrollment;
      }
    } else if (key === "studentId") {
      if (value === this.existEnrollment[0].studentId) {
        return this.existEnrollment;
      }
    }
    return [];
  };

  create = async ({ studentId, lectureId }: IEnrollmentCreate) => {
    if (lectureId === 3) throw new Error("DB에러 검증을 위한 임의적 에러 발생");

    const result = {
      id: this.id,
      studentId,
      lectureId,
    };
    this.id++;

    return result;
  };
}
