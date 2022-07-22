import { sequence } from "./parse/sequence";
import { or } from "./parse/or";
import { keyword, __, zeroToMany, oneToMany, endOfInput } from "./parse/util";
import { stmt } from "./parse";

// const result = sequence([keyword("a"), __, keyword("b"), __, keyword("c")])({
//   str: "a b r",
//   pos: 0,
// });

const result = sequence([
  sequence([keyword("a"), __, keyword("b")]),
  endOfInput,
])({
  str: "a ",
  pos: 0,
});

console.log(result, result.expected[0].tokens);
