import { Service } from "typedi";
import DBError from "../../modules/errors/db.error";
import {
  ILecture,
  ILectureUpdate,
} from "../../modules/interface/lecture.interface";
import Date from "../../util/date.util";
import {
  getAndColumnForQuery,
  getOrColumnForQuery,
  getOrColumnForUpdateQuery,
} from "../../util/db.util";
import db from "../db";

@Service()
export class LectureReopsitory {
  constructor(private date: Date, private tableName: string) {
    this.tableName = "lecture";
  }

  find = async (params: any) => {
    console.log(params);
    let JOIN = "";
    params.include.forEach(
      (include: { model: string; require: boolean; on: string }) => {
        if (include.require) {
          JOIN = JOIN.concat(`INNER JOIN ${include.model} ON ${include.on} `);
        } else {
          JOIN = JOIN.concat(`LEFT JOIN ${include.model} ON ${include.on} `);
        }
      }
    );

    let WHERE = "expose = 1 AND lecture.deletedAt IS NULL";
    let WHERE_CATEGORY = "";
    params.where?.forEach((where: Array<Object | null>) => {
      if (Object.keys(where)[0] === "lecture.categoryId") {
        WHERE_CATEGORY = `AND lecture.categoryId = ${Object.values(where)[0]}`;
      } else {
        WHERE =
          `${Object.keys(where)[0]} = ${Object.values(where)[0]} AND ` + WHERE;
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
    const result = (await db.pool.query(sql))[0];

    return result;
  };

  findListById = async (params: Array<number>) => {
    const conditions = getOrColumnForQuery("id", params);
    const sql = `SELECT * FROM ${this.tableName} WHERE (${conditions}) AND expose = 1 AND deletedAt IS NULL`;
    console.log(`Query : ${sql}`);
    const result = await db.pool.query(sql);

    return result[0];
  };

  create = async (lectures: Array<ILecture>, connection: any) => {
    const nowDate = this.date.getTime();
    const sql = `INSERT INTO ${this.tableName} (title, description, price, teacherId, categoryId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)`;
    const result = [];
    for (const lecture of lectures) {
      result.push(
        await connection.query(sql, [
          lecture.title,
          lecture.description,
          lecture.price,
          lecture.teacherId,
          lecture.categoryId,
          nowDate,
          nowDate,
        ])
      );
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
    }
    return result;
  };

  findOne = async (params: object) => {
    const conditions = getAndColumnForQuery(params);
    const sql = `SELECT lecture.id, lecture.title, lecture.description, category.category as category, lecture.price, lecture.studentNum, lecture.createdAt, lecture.updatedAt, student.id as student_id, student.name as student_name, enrollment.createdAt as enrollmentAt
    FROM ${this.tableName}
      INNER JOIN category ON lecture.categoryId = category.id 
      INNER JOIN teacher ON lecture.teacherId = teacher.id 
      LEFT JOIN enrollment ON enrollment.lectureId = lecture.id 
      LEFT JOIN student ON enrollment.studentId = student.id AND student.deletedAt IS NULL 
    WHERE lecture.${conditions} AND lecture.deletedAt IS NULL`;
    console.log(`Query : ${sql}`);
    const result = (await db.pool.query(sql))[0];

    return result;
  };

  update = async (id: number, lecture: ILectureUpdate, connection: any) => {
    const contitions = getOrColumnForUpdateQuery(lecture);
    const sql = `UPDATE ${
      this.tableName
    } SET ${contitions}, updatedAt = '${this.date.getTime()}' WHERE id = ${id}`;
    console.log(`Query : ${sql}`);
    const result = await connection.query(sql);
    const affectedRows = result[0] ? result[0].affectedRows : 0;

    return affectedRows;
  };

  delete = async (params: number, connection: any) => {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ${params}`;
    console.log(`Query : ${sql}`);
    const result = await connection.query(sql);
    const affectedRows = result[0] ? result[0].affectedRows : 0;

    return affectedRows;
  };
}