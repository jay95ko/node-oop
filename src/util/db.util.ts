export const getAndColumnForQuery = (object: object) => {
  const entries: Array<any> = Object.entries(object);

  const conditions: string = entries
    .map(([key, value]) => `${key} = '${value}'`)
    .join("AND ");

  return conditions;
};

export const getOrColumnForQuery = (key: string, values: Array<any>) => {
  const conditions: string = values
    .map((value) => `${key} = '${value}'`)
    .join(" OR ");

  return conditions;
};

export const getOrColumnForUpdateQuery = (object: object) => {
  const entries: Array<any> = Object.entries(object);

  const conditions: string = entries
    .map(([key, value]) => {
      if (key === "studentNum") {
        return `${key} = ${value}`;
      }
      return `${key} = '${value}'`;
    })
    .join(", ");

  return conditions;
};
