import { aExprBooleanSpecialCase } from "../parse/aExpr";

const result = aExprBooleanSpecialCase({
  str: "true= true",
  pos: 0,
  startOfNextStatement: [],
  endOfStatement: [],
});

console.log(result);
