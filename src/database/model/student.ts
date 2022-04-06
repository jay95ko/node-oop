import { Service } from "typedi";
import { IStudent } from "../../modules/interface/student.interface";
import Date from "../../util/date.util";
import { getAndColumnForQuery } from "../../util/db.util";
import db from "../db";

@Service()
export class StudentReopsitory {
  constructor(private date: Date, private tableName: string) {
    this.tableName = "student";
  }

  create = async ({ email, name }: IStudent) => {
    const connection = await db.getConnection();
    const sql = `INSERT INTO ${this.tableName} (email, name) VALUES (?,?)`;
    const result = await connection.query(sql, [email, name]);
    db.releaseConnection(connection);
    return result;
  };

  findOne = async (params: object) => {
    const conditions = getAndColumnForQuery(params);
    const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions} AND deletedAt IS NULL`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    db.releaseConnection(connection);
    return result[0][0];
  };

  delete = async (id: number) => {
    const sql = `UPDATE ${
      this.tableName
    } SET deletedAt = '${this.date.getTime()} 'WHERE id = ${id}`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    db.releaseConnection(connection);
    const affectedRows = result[0] ? result[0].affectedRows : 0;

    return affectedRows;
  };
}
