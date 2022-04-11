import { Service } from "typedi";
import db from "../database/db";
import { StudentReopsitory } from "../database/repository/student";
import AlreadyExistError from "../modules/errors/alreadyExist.error";
import DoesNotExistError from "../modules/errors/alreadyExist.error copy";
import { IStudent } from "../modules/interface/student.interface";

@Service()
export class StudentService {
  constructor(private studentRepository: StudentReopsitory) {}

  createStudent = async (student: IStudent) => {
    //유저 email unique 보장을 위해 검색
    const existStudent = await this.studentRepository.findOne({
      email: student.email,
    });

    if (existStudent) {
      throw new AlreadyExistError("Already exist student by email");
    }
    const connection = await db.getConnection();
    await this.studentRepository.create(student, connection);
    db.releaseConnection(connection);
    return "Sucess create student";
  };

  deleteStudent = async (id: number) => {
    const connection = await db.getConnection();
    const affectedRows = await this.studentRepository.delete(id, connection);
    db.releaseConnection(connection);
    // affectedRows가 0인 경우에는 삭제 할 Row가 없다는 뜻
    if (affectedRows === 0) {
      throw new DoesNotExistError("Does not exist student by id for delete");
    }
    return "Sucess delete student";
  };
}
