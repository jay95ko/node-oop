import { TeacherRepository } from "../../../database/repository/teacher";

export class StubTeacherRepository extends TeacherRepository {
  private existTeacher = [
    {
      id: 1,
      name: "고준영",
    },
    {
      id: 2,
      name: "인프런",
    },
    {
      id: 3,
      name: "인프랩",
    },
  ];
  constructor(tableName: string) {
    super(tableName);
  }

  findByIds = async (params: Array<number>) => {
    let result: Array<{ id: number; name: string }> = [];
    this.existTeacher.forEach((teacher) => {
      if (params.includes(teacher.id) && !result.includes(teacher)) {
        result.push(teacher);
      }
    });

    return result;
  };
}
