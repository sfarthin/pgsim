import { aExprBooleanSpecialCase } from "../parse/aExpr";

const result = aExprBooleanSpecialCase({
  str: "true= true",
  pos: 0,
});

console.log(result);
