//Key, Value 값을 이용해 입력받은 조건들을 AND조건으로 연결
//ex) name = '고준영' AND title = '타이틀'
export const getAndColumnForQuery = (object: object) => {
  const entries: Array<any> = Object.entries(object);

  const conditions: string = entries
    .map(([key, value]) => `${key} = '${value}'`)
    .join("AND ");

  return conditions;
};

//Key, Values 값을 이용해 입력받은 조건을 OR조건으로 연결
//ex) id = 1 or id = 2
export const getOrColumnForQuery = (key: string, values: Array<any>) => {
  const conditions: string = values
    .map((value) => `${key} = '${value}'`)
    .join(" OR ");

  return conditions;
};

//배열로 받은 Key, Value 값을 이용해 입력받은 조건을 ','로 연결
//ex) title = '타이틀' , name = '고준영'
export const getOrColumnForUpdateQuery = (object: object) => {
  const entries: Array<any> = Object.entries(object);

  const conditions: string = entries
    .map(([key, value]) => `${key} = '${value}'`)
    .join(", ");

  return conditions;
};
