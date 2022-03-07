import type { Expected } from "./util";
export const expectedReducer = (acc: Expected[], e: Expected): Expected[] => {
  // Lets ignore these comment and whitespace characters.
  if (['"/*"', '"--"', "/[ \\t\\r\\n]/", "/[ \\t\\r]/"].includes(e.value)) {
    return acc;
  }

  // If this is the first one use it.
  // If the error is furthor along, then use that one.
  if (!acc[0] || acc[0].pos < e.pos) {
    return [e];
  }

  // If its on the same line just concatenate them.
  // unless its a duplicate
  if (acc[0].pos === e.pos && !acc.some((v) => v.value === e.value)) {
    return acc.concat(e);
  }

  // if r is referes to a previes pos, ignore
  return acc;
};
