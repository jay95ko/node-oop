import { Service } from "typedi";
import { getOrColumnForQuery } from "../../util/db.util";
import db from "../db";

@Service()
export class CategoryReopsitory {
  constructor(private tableName: string) {
    this.tableName = "category";
  }

  findListById = async (params: Array<number>) => {
    const conditions = getOrColumnForQuery("id", params);
    const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
    console.log(`Query : ${sql}`);
    const result = await db.pool.query(sql);
    return result[0];
  };
}
