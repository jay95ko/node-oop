export type IEnrollment = {
  studentId: number;
  lectureIds: Array<number>;
};

export type IEnrollmentInfo = {
  id: number;
  studentId: number;
  lectureId: number;
};

export type IEnrollmentFindById = {
  studentId?: number;
  lectureId?: number;
};

export type IEnrollmentCreate = {
  studentId: number;
  lectureId: number;
};
