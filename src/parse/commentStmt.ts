import {
  transform,
  sequence,
  zeroToMany,
  whitespace,
  sqlStyleComment,
  cStyleComment,
  or,
} from "./util";

export const commentStatement = transform(
  sequence([
    zeroToMany(whitespace),
    or([cStyleComment, sqlStyleComment]),
    zeroToMany(whitespace),
  ]),
  (v) => {
    return { value: { Comment: v[1] }, eos: null };
  }
);
