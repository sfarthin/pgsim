import { sequence } from "./parse/sequence";
import { or } from "./parse/or";
import {
  optional,
  keyword,
  __,
  zeroToMany,
  oneToMany,
  endOfInput,
} from "./parse/util";
import { stmt } from "./parse";

// const result = sequence([keyword("a"), __, keyword("b"), __, keyword("c")])({
//   str: "a b r",
//   pos: 0,
// });

const result = sequence([
  sequence([
    keyword("a"),
    __,
    sequence([optional(or([keyword("b"), keyword("k")])), __]),
    __,
    keyword("c"),
  ]),
  endOfInput,
])({
  str: "a b b",
  pos: 0,
});

console.log(result, result.expected[0].tokens);
