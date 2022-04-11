import request from "supertest";
import { app } from "../../src/app";
// import "../../src/database/db";
import db from "../../src/database/db";

beforeAll(async () => {
  await db.pool.query("set FOREIGN_KEY_CHECKS = 0");
  await db.pool.query("TRUNCATE TABLE student");
  await db.pool.query("set FOREIGN_KEY_CHECKS = 1");
});

describe("/student", () => {
  describe("POST /student", () => {
    test("유저 회원가입 성공", async () => {
      const res = await request(app)
        .post("/student")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          email: "test@naver.com",
          name: "테스트사용자",
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        result: "Sucess create student",
      });
    });

    test("유저 회원가입 이메일 중복으로 실패", async () => {
      const res = await request(app)
        .post("/student")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          email: "test@naver.com",
          name: "테스트사용자",
        });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        errorMessage: "Already exist student by email",
        status: 409,
        name: "Already exist Error",
      });
    });

    test("유저 회원가입 필수값 없는 경우 실패", async () => {
      const res = await request(app)
        .post("/student")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          name: "테스트사용자",
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errorMessage: "Validate error occer",
        status: 400,
        name: "Validate Error",
      });
    });
  });

  describe("DELETE /student", () => {
    test("유저 회원탈퇴 성공", async () => {
      const res = await request(app).delete("/student/1");

      expect(res.status).toBe(204);
    });

    test("유저 회원탈퇴 없는 id로 실패", async () => {
      const res = await request(app).delete("/student/10");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        errorMessage: "Does not exist student by id for delete",
        status: 404,
        name: "Does Not exist Error",
      });
    });
  });
});

afterAll(async () => {
  await db.pool.end();
});
