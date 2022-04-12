import { object } from "joi";
import { Service } from "typedi";
import Date from "../../util/date.util";
import db from "../db";

@Service()
export class EnrollmentReopsitory {
  constructor(private date: Date, private tableName: string) {
    this.tableName = "enrollment";
  }

  findById = async (params: object) => {
    const key = Object.keys(params)[0];
    const value = Object.values(params)[0];

    const sql = `SELECT * FROM ${this.tableName} WHERE ${key} = ${value}`;
    console.log(`Query : ${sql}`);
    const result = await db.pool.query(sql);
    return result[0];
  };

  create = async (
    studentId: number,
    lectureId: number,
    connection: any
  ) => {
    const nowDate = this.date.getTime();
    const sql = `INSERT INTO ${this.tableName} (studentId, lectureId, createdAt) VALUES (?,?,?)`;

    const result =  await connection.query(sql, [studentId, lectureId, nowDate]);
    console.log(`Query : ${sql} [${studentId}, ${lectureId}, ${nowDate}]`);
    return result;
  };
}
