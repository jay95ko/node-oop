import { EnrollmentReopsitory } from "../../../database/repository/elrollment";
import Date from "../../../util/date.util";
import { IEnrollmentInfo } from "../../interface/enrollment.interface";

export class StubEnrollmentRepository extends EnrollmentReopsitory {
  private existEnrollment = {
    id: 1,
    studentId: 1,
    lectureId: 1,
  };
  constructor(date: Date, tableName: string) {
    super(date, tableName);
  }

  findById = async (id: number) => {
    if (id === this.existEnrollment.id) {
      return [this.existEnrollment];
    }
    return [];
  };

  create = async (
    studentId: number,
    lectureIds: Array<number>,
    connection: any
  ) => {
    const newEnrollments: Array<IEnrollmentInfo> = [];
    let id = 1;
    lectureIds.forEach((lectureId) => {
      //DB에러 검증을 위한 에러 발생
      if (lectureId === 3)
        throw new Error("DB에러 검증을 위한 임의적 에러 발생");
      newEnrollments.push({
        id,
        studentId,
        lectureId,
      });
      id++;
    });

    return newEnrollments;
  };
}
