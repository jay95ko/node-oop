import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env["PORT"],
  db: {
    connectionLimit: +(process.env["DB_CONNECTLIMIT"] || 10),
    host: process.env["DB_HOST"],
    user: process.env["DB_USER"],
    database: process.env["DB_DATABASE"],
    password: process.env["DB_PASSWORD"],
  },
  listPerPage: 10,
};

export default config;
