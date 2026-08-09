export const excludeFields = (fields: string[], object: Record<string, any>) => {
  fields.forEach((el) => delete object[el]);
} 