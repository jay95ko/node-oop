import mysql2 from "mysql2/promise";
import config from "../config";
import DBError from "../modules/errors/db.error";

class DBClass {
  public pool: any;
  constructor() {
    console.log("connect db");
    this.pool = mysql2.createPool(config.db);
  }

  getConnection = async () => {
    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (err) {
      throw new DBError("Can not get connection");
    }
  };

  releaseConnection = (connection: any) => {
    connection.release();
    return;
  };
}

const DB = new DBClass();
export default DB;
