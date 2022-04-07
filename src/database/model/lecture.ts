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

  find = async (params: object = {}) => {
    const conditions = getAndColumnForQuery(params);
    const sql = `SELECT lecture.id, lecture.title, lecture.description, category.category as category, lecture.price, lecture.studentNum, lecture.createdAt, lecture.updatedAt, student.id as student_id, student.name as student_name, enrollment.createdAt as enrollmentAt
    FROM lecture 
      LEFT JOIN category ON lecture.categoryId = category.id 
      LEFT JOIN teacher ON lecture.teacherId = teacher.id 
      LEFT JOIN enrollment ON enrollment.lectureId = lecture.id 
      LEFT JOIN student ON enrollment.studentId = student.id AND student.deletedAt IS NULL 
    WHERE lecture.${conditions} AND lecture.deletedAt IS NULL`;
    const connection = await db.getConnection();
    const result = (await connection.query(sql))[0];
    db.releaseConnection(connection);

    return result;
  };

  findListById = async (params: Array<number>) => {
    const conditions = getOrColumnForQuery("id", params);
    const sql = `SELECT * FROM ${this.tableName} WHERE (${conditions}) AND expose = 1 AND deletedAt IS NULL`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    db.releaseConnection(connection);
    return result[0];
  };

  create = async (lectures: Array<ILecture>) => {
    const nowDate = this.date.getTime();
    const sql = `INSERT INTO ${this.tableName} (title, description, price, teacherId, categoryId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)`;
    const connection = await db.getConnection();
    const result = [];
    try {
      await connection.beginTransaction();
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
      }
      await connection.commit();
      return result;
    } catch (err) {
      console.error(err);
      await connection.rollback();
      throw new DBError("Lecture create error");
    } finally {
      db.releaseConnection(connection);
    }
  };

  findOne = async (params: object) => {
    const conditions = getAndColumnForQuery(params);
    const sql = `SELECT lecture.id, lecture.title, lecture.description, category.category as category, lecture.price, lecture.studentNum, lecture.createdAt, lecture.updatedAt, student.id as student_id, student.name as student_name, enrollment.createdAt as enrollmentAt
    FROM lecture 
      LEFT JOIN category ON lecture.categoryId = category.id 
      LEFT JOIN teacher ON lecture.teacherId = teacher.id 
      LEFT JOIN enrollment ON enrollment.lectureId = lecture.id 
      LEFT JOIN student ON enrollment.studentId = student.id AND student.deletedAt IS NULL 
    WHERE lecture.${conditions} AND lecture.deletedAt IS NULL`;
    const connection = await db.getConnection();
    const result = (await connection.query(sql))[0];
    db.releaseConnection(connection);

    return result;
  };

  update = async (id: number, lecture: ILectureUpdate) => {
    const contitions = getOrColumnForUpdateQuery(lecture);
    const sql = `UPDATE ${
      this.tableName
    } SET ${contitions}, updatedAt = '${this.date.getTime()}' WHERE id = ${id}`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    db.releaseConnection(connection);
    const affectedRows = result[0] ? result[0].affectedRows : 0;

    return affectedRows;
  };

  delete = async (params: number) => {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ${params}`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    const affectedRows = result[0] ? result[0].affectedRows : 0;

    return affectedRows;
  };
}
