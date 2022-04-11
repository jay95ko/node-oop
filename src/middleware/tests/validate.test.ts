import httpMocks from "node-mocks-http";
import ValidateError from "../../modules/errors/validate.error";
import {
  validateCreateStudent,
  validateCreateLecture,
  validateUpdateLecture,
  validateGetLectureList,
  validateCreateEnrollment,
} from "../validate";

describe("수강생 생성 valadator", () => {
  it("Validator 정상 통과시 next 호출", async () => {
    const studentForSucess = {
      email: "test@naver.com",
      name: "테스트사용자",
    };
    const request = httpMocks.createRequest({
      body: studentForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateCreateStudent(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 실패시 ValidateError 발생", async () => {
    const studentForFail = {
      name: "테스트사용자",
      //email 값 빠진 경우
    };
    const request = httpMocks.createRequest({
      body: studentForFail,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await expect(async () => {
      await validateCreateStudent(request, response, next);
    }).rejects.toThrowError(new ValidateError("Validate error occer"));
  });
});

describe("강의 생성 validator", () => {
  it("Validator 정상 통과시 next 호출", async () => {
    const lectureForSucess = [
      {
        title: "노드",
        description: "테스트 강좌 설명입니다.",
        price: "10000",
        teacherId: 1,
        categoryId: 10,
      },
    ];
    const request = httpMocks.createRequest({
      body: lectureForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateCreateLecture(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 실패시 ValidateError 발생", async () => {
    const lectureForFail = [
      {
        description: "테스트 강좌 설명입니다.",
        price: "10000",
        teacherId: 1,
        categoryId: 10,
        //title 값 빠진 경우
      },
    ];
    const request = httpMocks.createRequest({
      body: lectureForFail,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await expect(async () => {
      await validateCreateLecture(request, response, next);
    }).rejects.toThrowError(new ValidateError("Validate error occer"));
  });
});

describe("강의 수정 validator", () => {
  it("Validator 정상 통과시 next 호출", async () => {
    const lectureForSucess = {
      title: "테스트 강좌명",
      description: "테스트 강좌 설명입니다.",
      price: "10000",
      expose: 1,
    };
    const request = httpMocks.createRequest({
      body: lectureForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateUpdateLecture(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 실패시 ValidateError 발생", async () => {
    const lectureForFail = {
      title: "테스트 강좌명",
      description: "테스트 강좌 설명입니다.",
      price: "10000",
      //expoer(공개) 값 빠진 경우
    };
    const request = httpMocks.createRequest({
      body: lectureForFail,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await expect(async () => {
      await validateUpdateLecture(request, response, next);
    }).rejects.toThrowError(new ValidateError("Validate error occer"));
  });
});

describe("강의 목록 확인 validator", () => {
  it("Validator 정상 통과시 next 호출 : 조건 없는 경우", async () => {
    const queryForSucess = {};
    const request = httpMocks.createRequest({
      query: queryForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateGetLectureList(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 정상 통과시 next 호출 : 강의명 조건 있는 경우", async () => {
    const queryForSucess = {
      limit: 100,
      order: "student",
      category: 1,
      title: "javascripts",
    };
    const request = httpMocks.createRequest({
      query: queryForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateGetLectureList(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 정상 통과시 next 호출 : 강사명 조건 있는 경우", async () => {
    const queryForSucess = {
      limit: 100,
      order: "student",
      category: 1,
      teacherName: "고준영",
    };
    const request = httpMocks.createRequest({
      query: queryForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateGetLectureList(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 정상 통과시 next 호출 : 수강생ID 조건 있는 경우", async () => {
    const queryForSucess = {
      limit: 100,
      order: "student",
      category: 1,
      student: 1,
    };
    const request = httpMocks.createRequest({
      query: queryForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateGetLectureList(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 실패시 ValidateError 발생 : order 값이 정해진(student or 공백)이 아닌 경우", async () => {
    const lectureForFail = {
      limit: 100,
      order: "order",
      category: 1,
      title: "javascripts",
    };
    const request = httpMocks.createRequest({
      query: lectureForFail,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await expect(async () => {
      await validateGetLectureList(request, response, next);
    }).rejects.toThrowError(new ValidateError("Validate error occer"));
  });

  it("Validator 실패시 ValidateError 발생 : limit 값이 숫자형이 아닌 경우", async () => {
    const lectureForFail = {
      limit: "limit",
      order: "order",
      category: 1,
      title: "javascripts",
    };
    const request = httpMocks.createRequest({
      query: lectureForFail,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await expect(async () => {
      await validateGetLectureList(request, response, next);
    }).rejects.toThrowError(new ValidateError("Validate error occer"));
  });
});

describe("수강 신청 validator", () => {
  it("Validator 정상 통과시 next 호출", async () => {
    const enrollmentForSucess = {
      studentId: 1,
      lectureIds: [1],
    };
    const request = httpMocks.createRequest({
      body: enrollmentForSucess,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await validateCreateEnrollment(request, response, next);

    expect(next).toBeCalled();
  });

  it("Validator 실패시 ValidateError 발생", async () => {
    const enrollmentForFail = {
      studentId: 1,
      //강의 ID 없는 경우
    };
    const request = httpMocks.createRequest({
      body: enrollmentForFail,
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await expect(async () => {
      await validateCreateEnrollment(request, response, next);
    }).rejects.toThrowError(new ValidateError("Validate error occer"));
  });
});
