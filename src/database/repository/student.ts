import { Service } from "typedi";
import { IStudent } from "../../modules/interface/student.interface";
import Date from "../../util/date.util";
import { getAndColumnForQuery, getOrColumnForQuery } from "../../util/db.util";
import db from "../db";

@Service()
export class StudentReopsitory {
  constructor(private date: Date, private tableName: string) {
    this.tableName = "student";
  }

  create = async ({ email, name }: IStudent, connection: any) => {
    const sql = `INSERT INTO ${this.tableName} (email, name) VALUES (?,?)`;
    console.log(`Query : ${sql} [${email}, ${name}]`);

    return await connection.query(sql, [email, name]);
  };

  findOne = async (params: object) => {
    const conditions = getAndColumnForQuery(params);
    const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions} AND deletedAt IS NULL`;
    console.log(`Query : ${sql}`);

    return (await db.pool.query(sql))[0][0];
  };

  delete = async (id: number, connection: any) => {
    const sql = `UPDATE ${
      this.tableName
    } SET deletedAt = '${this.date.getTime()} 'WHERE id = ${id}`;
    console.log(`Query : ${sql}`);
    const result = (await connection.query(sql))[0];

    return result ? result.affectedRows : 0;
  };
}
