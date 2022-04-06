export const getColumnForQuery = (object: object) => {
  const keys: Array<string> = Object.keys(object);
  const values: Array<string | number> = Object.values(object);
  const entries: Array<any> = Object.entries(object);

  const conditions: string = entries
    .map(([key, value]) => `${key} = '${value}'`)
    .join("AND ");

  return conditions;
};
