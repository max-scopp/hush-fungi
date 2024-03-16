export function filterObject<T extends object>(
  obj: T,
  condition: (item: T[keyof T]) => boolean,
) {
  return Object.entries(obj).reduce((prev, [key, item]) => {
    if (condition(item)) {
      return { ...prev, [key]: item };
    }

    return prev;
  }, {} as T);
}
