import { Service } from "typedi";
import DBError from "../../modules/errors/db.error";
import Date from "../../util/date.util";
import db from "../db";

@Service()
export class EnrollmentReopsitory {
  constructor(private date: Date, private tableName: string) {
    this.tableName = "enrollment";
  }

  findById = async (params: number) => {
    const sql = `SELECT * FROM ${this.tableName} WHERE lectureId = ${params}`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    db.releaseConnection(connection);
    return result[0];
  };

  create = async (studentId: number, lectureIds: Array<number>) => {
    const nowDate = this.date.getTime();
    const sql = `INSERT INTO ${this.tableName} (studentId, lectureId, createdAt) VALUES (?,?,?)`;
    const connection = await db.getConnection();
    const result = [];

    try {
      await connection.beginTransaction();
      for (const lectureId of lectureIds) {
        result.push(
          await connection.query(sql, [studentId, lectureId, nowDate])
        );
      }
      await connection.commit();
      return result;
    } catch (err) {
      console.error(err);
      await connection.rollback();
      throw new DBError("Enrollment create error");
    } finally {
      db.releaseConnection(connection);
    }
  };
}
