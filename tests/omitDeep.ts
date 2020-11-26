export default function omitDeep(
  input: object,
  excludes: Array<number | string>
): object {
  return Object.entries(input).reduce((acc, [key, value]) => {
    const shouldExclude = excludes.includes(key);
    if (shouldExclude) return acc;

    if (Array.isArray(value)) {
      const arrValue = value;
      const nextValue = arrValue.map((arrItem) => {
        if (typeof arrItem === "object") {
          return omitDeep(arrItem, excludes);
        }
        return arrItem;
      });

      return {
        ...acc,
        [key]: nextValue,
      };
    } else if (typeof value === "object") {
      return {
        ...acc,
        [key]: omitDeep(value, excludes),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}
