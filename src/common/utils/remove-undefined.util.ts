export const removeUndefined = <T extends Record<string, any>>(obj: T): T => {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      delete obj[key];
    }
  }
  return obj;
};