export interface ILecture {
  title: string;
  description: string;
  price: number;
  teacherId: number;
  categoryId: number;
}

export interface ILectureDetail {
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
}

export interface ILectureUpdate {
  title: string;
  description: string;
  price: number;
  expose: number;
}

export interface ILectureQuery {
  limit?: number;
  order?: string;
  category?: number;
  title?: string;
  teacherName?: string;
  student?: number;
}

export interface ILectureSqlParams {
  where?: Array<Object>;
  order: string;
  category?: number | string;
  limit?: number | string;
  include: Array<Object>;
}