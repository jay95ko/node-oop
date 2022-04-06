export const getColumnForQuery = (object: object) => {
  const entries: Array<any> = Object.entries(object);

  const conditions: string = entries
    .map(([key, value]) => `${key} = '${value}'`)
    .join("AND ");

  return conditions;
};
