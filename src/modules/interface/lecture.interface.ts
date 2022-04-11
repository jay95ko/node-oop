export interface ILecture {
  title: string;
  description: string;
  price: number;
  teacherId: number;
  categoryId: number;
}

export interface ILectureColDetail {
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
export interface ILectureList {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  studentNum: number;
  createdAt: string;
  teacher: string;
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
  students: Array<null | { id: number; name: string; enrollmentAt: string }>;
}
