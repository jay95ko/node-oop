// import request from "supertest";
// import { app } from "../../src/app";
// import db from "../../src/database/db";

// beforeAll(async () => {
//   await db.pool.query("set FOREIGN_KEY_CHECKS = 0");
//   await db.pool.query("TRUNCATE TABLE enrollment");
//   await db.pool.query("set FOREIGN_KEY_CHECKS = 1");
//   await db.pool.query(
//     "INSERT INTO student (email, name) VALUES ('test@naver.com','테스트계정')"
//   );
//   await db.pool.query(
//     "INSERT INTO lecture (title, description, price, teacherId, categoryId, createdAt, updatedAt, expose) VALUES ('노드강의', '노드강의 설명', 20000, 1, 1, '2022-04-01 00:00:00', '2022-04-01 00:00:00', 1)"
//   );
//   await db.pool.query(
//     "INSERT INTO lecture (title, description, price, teacherId, categoryId, createdAt, updatedAt, expose) VALUES ('DB강의', 'DB강의 설명', 30000, 2, 2, '2022-04-01 00:00:00', '2022-04-01 00:00:00', 1)"
//   );
// });

// describe("/enrollment", () => {
//   describe("POST /enrollment", () => {
//     test("수강 신청 성공", async () => {
//       const res = await request(app)
//         .post("/enrollment")
//         .set("Accept", "application/json")
//         .type("application/json")
//         .send({
//           lectureIds: [1, 2],
//           studentId: 1,
//         });

//       console.log(res.body);

//       expect(res.status).toBe(201);
//       expect(res.body).toEqual({
//         result: "Sucess create 2 of enrollment",
//       });
//     });

//     test("중복된 강의 신청으로 수강신청 실패", async () => {
//       const res = await request(app)
//         .post("/enrollment")
//         .set("Accept", "application/json")
//         .type("application/json")
//         .send({
//           lectureIds: [1, 2],
//           studentId: 1,
//         });

//       expect(res.status).toBe(409);
//       expect(res.body).toEqual({
//         errorMessage: "Can not enroll already enrolled lecture",
//         status: 409,
//         name: "Conflict Error",
//       });
//     });

//     test("존재하지 않는 강의 수강신청 실패", async () => {
//       const res = await request(app)
//         .post("/enrollment")
//         .set("Accept", "application/json")
//         .type("application/json")
//         .send({
//           lectureIds: [3, 4],
//           studentId: 1,
//         });

//       expect(res.status).toBe(404);
//       expect(res.body).toEqual({
//         errorMessage: "Can not enroll not exist lecture",
//         status: 404,
//         name: "Does Not exist Error",
//       });
//     });

//     test("존재하지 않는 수강생의 id로 강의 수강신청 실패", async () => {
//       const res = await request(app)
//         .post("/enrollment")
//         .set("Accept", "application/json")
//         .type("application/json")
//         .send({
//           lectureIds: [1, 2],
//           studentId: 100,
//         });

//       expect(res.status).toBe(404);
//       expect(res.body).toEqual({
//         errorMessage: "Can not enroll not exist student",
//         status: 404,
//         name: "Does Not exist Error",
//       });
//     });

//     test("수강신청시 필수 값 없을 경우 실패", async () => {
//       const res = await request(app)
//         .post("/enrollment")
//         .set("Accept", "application/json")
//         .type("application/json")
//         .send({
//           lectureIds: [1, 2],
//         });

//       expect(res.status).toBe(400);
//       expect(res.body).toEqual({
//         errorMessage: "Validate error occer",
//         status: 400,
//         name: "Validate Error",
//       });
//     });
//   });
// });

// afterAll(async () => {
//   await db.pool.query("set FOREIGN_KEY_CHECKS = 0");
//   await db.pool.query("TRUNCATE TABLE enrollment");
//   await db.pool.query("TRUNCATE TABLE lecture");
//   await db.pool.query("TRUNCATE TABLE student");
//   await db.pool.query("set FOREIGN_KEY_CHECKS = 1");
//   await db.pool.end();
// });
