import { CategoryRepository } from "../../../database/repository/category";

export class StubCategoryRepository extends CategoryRepository {
  private existCategory = [
    {
      id: 1,
      category: "웹",
    },
    {
      id: 2,
      category: "데이터베이스",
    },
  ];
  constructor(tableName: string) {
    super(tableName);
  }

  findByIds = async (params: Array<number>) => {
    let result: Array<{ id: number; category: string }> = [];
    this.existCategory.forEach((category) => {
      if (params.includes(category.id) && !result.includes(category)) {
        result.push(category);
      }
    });

    return result;
  };
}
