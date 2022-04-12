import fs from "fs";
import request from "supertest";
import { app } from "../../src/app";
import db from "../../src/database/db";
// import a from "../../lecture.sample.json";

beforeAll(async () => {
  await db.pool.query("set FOREIGN_KEY_CHECKS = 0");
  await db.pool.query("TRUNCATE TABLE lecture");
  await db.pool.query("set FOREIGN_KEY_CHECKS = 1");
  for (let i = 1; i < 7; i++) {
    await db.pool.query(
      `INSERT INTO student (email, name) VALUES ('test${i}@naver.com','테스트계정${i}')`
    );
  }
  const jsonFile = fs.readFileSync(__dirname + "/lecture.sample.json", "utf8");
  const jsonData = JSON.parse(jsonFile);
  const lectures = jsonData.lectures;
  const lecturesForExpose = jsonData.lecturesForExpose;
  const enrollments = jsonData.enrollments;
  await request(app)
    .post("/lecture")
    .set("Accept", "application/json")
    .type("application/json")
    .send(lectures);
  await request(app)
    .put("/lecture/1")
    .set("Accept", "application/json")
    .type("application/json")
    .send(lecturesForExpose[0]);
  await request(app)
    .put("/lecture/2")
    .set("Accept", "application/json")
    .type("application/json")
    .send(lecturesForExpose[1]);
  await request(app)
    .put("/lecture/3")
    .set("Accept", "application/json")
    .type("application/json")
    .send(lecturesForExpose[2]);
  await request(app)
    .put("/lecture/4")
    .set("Accept", "application/json")
    .type("application/json")
    .send(lecturesForExpose[3]);
  await request(app)
    .put("/lecture/5")
    .set("Accept", "application/json")
    .type("application/json")
    .send(lecturesForExpose[4]);

  for (const enrollment of enrollments) {
    const result = await request(app)
      .post("/enrollment")
      .set("Accept", "application/json")
      .type("application/json")
      .send(enrollment);
    console.log(result);
  }
});

describe("/lecture", () => {
  describe("POST /lecture", () => {
    test("강의 생성 성공", async () => {
      const res = await request(app)
        .post("/lecture")
        .set("Accept", "application/json")
        .type("application/json")
        .send([
          {
            title: "테스트강의1",
            description: "테스트강의1설명",
            price: 10000,
            teacherId: 1,
            categoryId: 1,
          },
        ]);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        result: "Sucess create 1 of lecture",
      });
    });

    test("강의 생성시 필수 값이 없는 경우 실패", async () => {
      const res = await request(app)
        .post("/lecture")
        .set("Accept", "application/json")
        .type("application/json")
        .send([
          {
            title: "테스트강의1",
            description: "테스트강의1설명",
            price: 10000,
            teacherId: 1,
          },
        ]);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errorMessage: "Validate error occer",
        status: 400,
        name: "Validate Error",
      });
    });

    test("존재하지 않는 카테고리의 id로 강의 생성할 경우 실패", async () => {
      const res = await request(app)
        .post("/lecture")
        .set("Accept", "application/json")
        .type("application/json")
        .send([
          {
            title: "테스트강의1",
            description: "테스트강의1설명",
            price: 10000,
            teacherId: 1,
            categoryId: 10,
          },
        ]);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        errorMessage: "Can not ref not exist value",
        status: 404,
        name: "Does Not exist Error",
      });
    });

    test("존재하지 않는 강사의 id로 강의 생성할 경우 실패", async () => {
      const res = await request(app)
        .post("/lecture")
        .set("Accept", "application/json")
        .type("application/json")
        .send([
          {
            title: "테스트강의1",
            description: "테스트강의1설명",
            price: 10000,
            teacherId: 100,
            categoryId: 1,
          },
        ]);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        errorMessage: "Can not ref not exist value",
        status: 404,
        name: "Does Not exist Error",
      });
    });
  });

  describe("PUT /lecture/:id", () => {
    test("존재하는 강의 수정하는 경우 성공", async () => {
      const res = await request(app)
        .put("/lecture/6")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          title: "테스트강의2",
          description: "테스트강의2설명",
          price: 20000,
          expose: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        result: "Sucess update lecture",
      });
    });

    test("강의 수정시 필수 값이 없는 경우 실패", async () => {
      const res = await request(app)
        .put("/lecture/10")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          title: "테스트강의2",
          description: "테스트강의2설명",
          price: 20000,
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        errorMessage: "Validate error occer",
        status: 400,
        name: "Validate Error",
      });
    });

    test("존재하지 않는 강의 수정하는 경우 실패", async () => {
      const res = await request(app)
        .put("/lecture/10")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          title: "테스트강의2",
          description: "테스트강의2설명",
          price: 20000,
          expose: 1,
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        errorMessage: "Does not exist lecture for update",
        status: 404,
        name: "Does Not exist Error",
      });
    });
  });

  describe("DELETE /lecture/:id", () => {
    test("존재하는 강의 삭제하는 경우 성공", async () => {
      const res = await request(app)
        .delete("/lecture/6")
        .set("Accept", "application/json")
        .type("application/json");

      expect(res.status).toBe(204);
    });

    test("존재하지 않는 강의 삭제하는 경우 실패", async () => {
      const res = await request(app)
        .delete("/lecture/10")
        .set("Accept", "application/json")
        .type("application/json")
        .send();

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        errorMessage: "Does not exist lecture by id for delete",
        status: 404,
        name: "Does Not exist Error",
      });
    });
  });

  describe("GET /lecture/:id", () => {
    test("존재하는 강의 상세정보 요청의 경우", async () => {
      /*
       * 강의 생성 카테고리1 선생님1
       * 학생 생성 * 2 위에서 했음
       * 강의 수강 * 학생1로 신청
       */
      //사용 할 강의 생성
      await request(app)
        .post("/lecture")
        .set("Accept", "application/json")
        .type("application/json")
        .send([
          {
            title: "테스트강의7",
            description: "테스트강의7설명",
            price: 10000,
            teacherId: 1,
            categoryId: 1,
          },
        ]);
      await request(app)
        .put("/lecture/7")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          title: "테스트강의7",
          description: "테스트강의7설명",
          price: 10000,
          expose: 1,
        });
      await request(app)
        .post("/enrollment")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          lectureIds: [7],
          studentId: 1,
        });
      await request(app)
        .post("/enrollment")
        .set("Accept", "application/json")
        .type("application/json")
        .send({
          lectureIds: [7],
          studentId: 2,
        });

      const res = await request(app)
        .get("/lecture/7")
        .set("Accept", "application/json")
        .type("application/json")
        .send();

      console.log(res.body.result);
      expect(res.status).toBe(200);
      expect(res.body.result.title).toEqual("테스트강의7");
      expect(res.body.result.students.length).toEqual(2);
    });

    test("존재하지 않는 강의 상세정보 요청의 경우 실패", async () => {
      const res = await request(app)
        .get("/lecture/10")
        .set("Accept", "application/json")
        .type("application/json")
        .send();

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        errorMessage: "Does not exist lecture",
        status: 404,
        name: "Does Not exist Error",
      });
    });
  });

  describe("GET /lecture", () => {
    describe("정렬 값이 수강생 수인 경우", () => {
      describe("카테고리 필터링이 있는 경우(카테고리id = 2)", () => {
        test("검색 조건 없는 경우", async () => {
          const res = await request(app)
            .get("/lecture")
            .query({ category: 2 })
            .set("Accept", "application/json")
            .type("application/json")
            .send();

          expect(res.status).toBe(200);
          expect(res.body.result[0].title).toEqual("테스트강의1");
          expect(res.body.result[1].title).toEqual("테스트강의2");
          expect(res.body.result[0].category).toEqual("앱");
          expect(res.body.result[1].category).toEqual("앱");
          expect(res.body.result.length).toEqual(2);
        });

        test("검색 조건 강의명인 경우(강의명 = 테스트강의2)", async () => {
          const res = await request(app)
            .get("/lecture")
            .query({ category: 2, title: "테스트강의2" })
            .set("Accept", "application/json")
            .type("application/json")
            .send();

          expect(res.status).toBe(200);
          console.log(res.body.result);
          expect(res.body.result[0].title).toEqual("테스트강의2");
          expect(res.body.result[0].category).toEqual("앱");
          expect(res.body.result.length).toEqual(1);
        });

        test("검색 조건 강사명인 경우(강사명 = 송치헌)", async () => {
          const res = await request(app)
            .get("/lecture")
            .query({ category: 2, teacherName: "송치헌" })
            .set("Accept", "application/json")
            .type("application/json")
            .send();

          expect(res.status).toBe(200);
          console.log(res.body.result);
          expect(res.body.result[0].title).toEqual("테스트강의2");
          expect(res.body.result[0].category).toEqual("앱");
          expect(res.body.result.length).toEqual(1);
        });

        test("검색 조건 수강생id인 경우(수강생id = 3)", async () => {
          const res = await request(app)
            .get("/lecture")
            .query({ category: 2, teacherName: "송치헌" })
            .set("Accept", "application/json")
            .type("application/json")
            .send();

          expect(res.status).toBe(200);
          console.log(res.body.result);
          expect(res.body.result[0].title).toEqual("테스트강의2");
          expect(res.body.result[0].category).toEqual("앱");
          expect(res.body.result.length).toEqual(1);
        });
      });

      describe("카테고리 필터링이 없는 경우", () => {
        test("검색 조건 없는 경우", async () => {
          /*
           *전체 다 출력
           */
        });

        test("검색 조건 강의명인 경우(강의명 = 테스트강의4)", async () => {
          /*
          * [{
            "title": "테스트강의4",
            "description": "테스트강의4설명",
            "price": 20000,
            "teacherId": 1,
            "categoryId": 3
          }]
          */
        });

        test("검색 조건 강사명인 경우(강사명 = 송치헌)", async () => {
          /*
          * [{
              "title": "테스트강의3",
              "description": "테스트강의3설명",
              "price": 20000,
              "teacherId": 2,
              "categoryId": 2
            },{
              "title": "테스트강의5",
              "description": "테스트강의5설명",
              "price": 20000,
              "teacherId": 2,
              "categoryId": 3
            }]
          */
        });

        test("검색 조건 수강생id인 경우(수강생id = 3)", async () => {
          /*
          * [[{ 1 포함
              "title": "테스트강의2",
              "description": "테스트강의2설명",
              "price": 20000,
              "teacherId": 1,
              "categoryId": 2
            },{
              "title": "테스트강의3",
              "description": "테스트강의3설명",
              "price": 20000,
              "teacherId": 2,
              "categoryId": 2
            },{
              "title": "테스트강의4",
              "description": "테스트강의4설명",
              "price": 20000,
              "teacherId": 1,
              "categoryId": 3
            }]
          */
        });
      });
    });
    describe("정렬 값이 최신순인 경우", () => {
      describe("카테고리 필터링이 있는 경우(카테고리id = 2)", () => {
        test("검색 조건 없는 경우", async () => {
          // [{
          //   "title": "테스트강의3",
          //   "description": "테스트강의3설명",
          //   "price": 20000,
          //   "teacherId": 2,
          //   "categoryId": 2
          // },{
          //   "title": "테스트강의2",
          //   "description": "테스트강의2설명",
          //   "price": 20000,
          //   "teacherId": 1,
          //   "categoryId": 2
          // }]
        });

        test("검색 조건 강의명인 경우(강의명 = 테스트강의3)", async () => {
          // [{
          //   "title": "테스트강의3",
          //   "description": "테스트강의3설명",
          //   "price": 20000,
          //   "teacherId": 2,
          //   "categoryId": 2
          // }]
        });

        test("검색 조건 강사명인 경우(강사명 = 송치헌)", async () => {
          // [{
          //   "title": "테스트강의3",
          //   "description": "테스트강의3설명",
          //   "price": 20000,
          //   "teacherId": 2,
          //   "categoryId": 2
          // }]
        });

        test("검색 조건 수강생id인 경우(수강생id = 2)", async () => {
          // [{
          //   "title": "테스트강의3",
          //   "description": "테스트강의3설명",
          //   "price": 20000,
          //   "teacherId": 2,
          //   "categoryId": 2
          // },{
          //   "title": "테스트강의2",
          //   "description": "테스트강의2설명",
          //   "price": 20000,
          //   "teacherId": 1,
          //   "categoryId": 2
          // }]
        });
      });

      describe("카테고리 필터링이 없는 경우", () => {
        test("검색 조건 없는 경우", async () => {
          //전체 역순
        });

        test("검색 조건 강의명인 경우(강의명 = 테스트강의5)", async () => {
          // [{
          //   "title": "테스트강의5",
          //   "description": "테스트강의5설명",
          //   "price": 20000,
          //   "teacherId": 2,
          //   "categoryId": 3
          // }]
        });

        test("검색 조건 강사명인 경우(강사명 = 송치헌)", async () => {
          [
            {
              title: "테스트강의5",
              description: "테스트강의5설명",
              price: 20000,
              teacherId: 2,
              categoryId: 3,
            },
            {
              title: "테스트강의3",
              description: "테스트강의3설명",
              price: 20000,
              teacherId: 2,
              categoryId: 2,
            },
          ];
        });

        test("검색 조건 수강생id인 경우(수강생id = 5)", async () => {
          // [[1번 들어가야 함
          //   {
          //   "title": "테스트강의2",
          //   "description": "테스트강의2설명",
          //   "price": 20000,
          //   "teacherId": 1,
          //   "categoryId": 2
          // }]
        });
      });
    });

    test("검색 조건에 부합하는 결과 없는 경우(카테고리id = 6)", async () => {
      // []
    });
  });
});

afterAll(async () => {
  await db.pool.query("set FOREIGN_KEY_CHECKS = 0");
  await db.pool.query("TRUNCATE TABLE student");
  await db.pool.query("TRUNCATE TABLE lecture");
  await db.pool.query("TRUNCATE TABLE enrollment");
  await db.pool.query("set FOREIGN_KEY_CHECKS = 1");
  await db.pool.end();
});
