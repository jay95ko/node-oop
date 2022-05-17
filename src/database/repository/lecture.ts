import { Service } from "typedi";
import {
  ILecture,
  ILectureSqlIncludeParams,
  ILectureSqlParams,
  ILectureSqlWhereParams,
  ILectureUpdate,
} from "../../modules/interface/lecture.interface";
import Date from "../../util/date.util";
import {
  getOrColumnForQuery,
  getOrColumnForUpdateQuery,
} from "../../util/db.util";
import db from "../db";

@Service()
export class LectureRepository {
  constructor(private date: Date, private tableName: string) {
    this.tableName = "lecture";
  }

  find = async (params: ILectureSqlParams) => {
    let JOIN = "";
    params.include.forEach((include: ILectureSqlIncludeParams) => {
      if (include.require) {
        JOIN = JOIN.concat(`INNER JOIN ${include.model} ON ${include.on} `);
      } else {
        JOIN = JOIN.concat(`LEFT JOIN ${include.model} ON ${include.on} `);
      }
    });

    let WHERE = "expose = 1 AND lecture.deletedAt IS NULL";
    let WHERE_CATEGORY = "";
    params.where?.forEach((where: ILectureSqlWhereParams) => {
      if (Object.keys(where)[0] === "categoryId") {
        WHERE_CATEGORY = `AND lecture.categoryId = ${Object.values(where)[0]}`;
      } else {
        let key;
        if (Object.keys(where)[0] === "title") {
          key = "lecture.title";
        } else if (Object.keys(where)[0] === "teacherName") {
          key = "teacher.name";
        } else if (Object.keys(where)[0] === "studentId") {
          key = "enrollment.studentId";
        }
        let value =
          typeof Object.values(where)[0] === "string"
            ? `"${Object.values(where)[0]}"`
            : Object.values(where)[0];
        WHERE = `${key} = ${value} AND ` + WHERE;
      }
    });
    let WHERE_LIMIT = "";
    if (params.limit) WHERE_LIMIT = `AND ${params.order} < ${params.limit}`;

    const ORDER_BY = `${params.order} DESC`;

    const sql = `SELECT lecture.id, lecture.title, lecture.description, category.category as category, lecture.price, lecture.studentNum, lecture.createdAt, teacher.name as teacher
    FROM ${this.tableName}
    ${JOIN}
    WHERE ${WHERE} ${WHERE_CATEGORY} ${WHERE_LIMIT}
    ORDER BY ${ORDER_BY}
    LIMIT 20`;
    console.log(`Query : ${sql}`);

    return (await db.pool.query(sql))[0];
  };

  findByIds = async (params: Array<number>) => {
    const conditions = getOrColumnForQuery("id", params);
    const sql = `SELECT * FROM ${this.tableName} WHERE (${conditions}) AND expose = 1 AND deletedAt IS NULL`;
    console.log(`Query : ${sql}`);

    return (await db.pool.query(sql))[0];
  };

  create = async (lecture: ILecture, connection: any) => {
    const nowDate = this.date.getTime();
    const sql = `INSERT INTO ${this.tableName} (title, description, price, teacherId, categoryId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)`;
    //sql 로깅
    console.log(`Query : ${sql}. [
        ${lecture.title},
        ${lecture.description},
        ${lecture.price},
        ${lecture.teacherId},
        ${lecture.categoryId},
        ${nowDate},
        ${nowDate},
      ]`);
    return await connection.query(sql, [
      lecture.title,
      lecture.description,
      lecture.price,
      lecture.teacherId,
      lecture.categoryId,
      nowDate,
      nowDate,
    ]);
  };

  findOne = async (id: number) => {
    const sql = `SELECT lecture.id, lecture.title, lecture.description, category.category as category, lecture.price, lecture.studentNum, lecture.createdAt, lecture.updatedAt, student.id as student_id, student.name as student_name, enrollment.createdAt as enrollmentAt
    FROM ${this.tableName}
      INNER JOIN category ON lecture.categoryId = category.id 
      INNER JOIN teacher ON lecture.teacherId = teacher.id 
      LEFT JOIN enrollment ON enrollment.lectureId = lecture.id 
      LEFT JOIN student ON enrollment.studentId = student.id AND student.deletedAt IS NULL 
    WHERE lecture.id = ${id} AND lecture.deletedAt IS NULL`;
    console.log(`Query : ${sql}`);

    return (await db.pool.query(sql))[0];
  };

  update = async ({ id, lecture }: ILectureUpdate, connection: any) => {
    const conditions = getOrColumnForUpdateQuery(lecture);
    const sql = `UPDATE ${
      this.tableName
    } SET ${conditions}, updatedAt = '${this.date.getTime()}' WHERE id = ${id}`;
    console.log(`Query : ${sql}`);
    const result = (await connection.query(sql))[0];

    return result ? result.affectedRows : 0;
  };

  delete = async (id: number, connection: any) => {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ${id}`;
    console.log(`Query : ${sql}`);
    const result = (await connection.query(sql))[0];

    return result ? result.affectedRows : 0;
  };
}
