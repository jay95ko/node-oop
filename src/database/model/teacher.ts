import { Service } from "typedi";
import { getOrColumnForQuery } from "../../util/db.util";
import db from "../db";

@Service()
export class TeacherReopsitory {
  constructor(private tableName: string) {
    this.tableName = "teacher";
  }

  findListById = async (params: Array<number>) => {
    const conditions = getOrColumnForQuery("id", params);
    const sql = `SELECT * FROM ${this.tableName} WHERE (${conditions}) AND deletedAt IS NULL`;
    const connection = await db.getConnection();
    const result = await connection.query(sql);
    db.releaseConnection(connection);
    return result[0];
  };
}
