import { Service } from "typedi";
import { getOrColumnForQuery } from "../../util/db.util";
import db from "../db";

@Service()
export class CategoryReopsitory {
  constructor(private tableName: string) {
    this.tableName = "category";
  }

  //id를 배열로 받아 해당하는 id로 카테고리 목록 조회
  findByIds = async (params: Array<number>) => {
    const conditions = getOrColumnForQuery("id", params);
    const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
    console.log(`Query : ${sql}`);
    return (await db.pool.query(sql))[0];
  };
}
