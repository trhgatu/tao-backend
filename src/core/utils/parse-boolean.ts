export const parseBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
};
