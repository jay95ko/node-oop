export type ILecture = {
  title: string;
  description: string;
  price: number;
  teacherId: number;
  categoryId: number;
};

export type ILectureColDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  studentNum: number;
  createdAt: string;
  updatedAt: string;
  student_id: number;
  student_name: string;
  enrollmentAt: string;
};

export type ILectureUpdate = {
  id: number;
  lecture: ILectureUpdateInfo | ILectureAddCount;
};

export type ILectureUpdateInfo = {
  title: string;
  description: string;
  price: number;
  expose: number;
};

export type ILectureQuery = {
  limit?: number;
  order?: string;
  category?: number;
  title?: string;
  teacherName?: string;
  student?: number;
};

export type ILectureSqlParams = {
  where?: Array<ILectureSqlWhereParams>;
  order: string;
  category?: number | string;
  limit?: number | string;
  include: Array<ILectureSqlIncludeParams>;
};

export type ILectureSqlWhereParams = {
  title?: string;
  teacherName?: string;
  categoryId?: number;
  studentId?: number;
};

export type ILectureSqlIncludeParams = {
  model: string;
  require: boolean;
  on: string;
};

export type ILectureList = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  studentNum: number;
  createdAt: string;
  teacher: string;
};

export type IManufactureLectureDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  studentNum: number;
  createdAt: string;
  updatedAt: string;
  students: Array<ILectureDetailStudent>;
};

export type ILectureDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  studentNum: number;
  createdAt: string;
  updatedAt: string;
  student_id: number;
  student_name: string;
  enrollmentAt: string;
};

export type ILectureAddCount = {
  studentNum: string;
};

export type ILectureDetailStudent = {
  id: number;
  name: string;
  enrollmentAt: string;
};
