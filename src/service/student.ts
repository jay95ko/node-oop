import { Service } from "typedi";
import db from "../database/db";
import { StudentRepository } from "../database/repository/student";
import AlreadyExistError from "../modules/errors/alreadyExist.error";
import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import { IStudent } from "../modules/interface/student.interface";

@Service()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  //수강생 생성
  createStudent = async (student: IStudent): Promise<string> => {
    //유저 email unique 보장을 위해 검색 email 중복시 AlreadyExistError 반환
    await this.checkUniqueStudentByEmail(student.email);

    const connection = await db.getConnection();
    await this.studentRepository.create(student, connection);
    db.releaseConnection(connection);
    return "Success create student";
  };

  //수강생 정보 삭제
  deleteStudent = async (id: number): Promise<string> => {
    const connection = await db.getConnection();
    const affectedRows = await this.studentRepository.delete(id, connection);
    db.releaseConnection(connection);

    // affectedRows가 0인 경우에는 삭제 할 Row가 없다는 뜻으로 DoesNotExistError 반환
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist student by id for delete");
    }
    return "Success delete student";
  };

  private checkUniqueStudentByEmail = async (email: string): Promise<void> => {
    const existStudent = await this.studentRepository.findOne({
      email,
    });
    if (existStudent) {
      throw new AlreadyExistError("Already exist student by email");
    }
  };
}
