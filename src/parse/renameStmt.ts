import {
  Rule,
  sequence,
  __,
  transform,
  ALTER,
  TABLE,
  RENAME,
  identifier,
  or,
  quotedString,
  COLUMN,
  TO,
  combineComments,
  _,
  endOfStatement,
} from "./util";
import { RenameStmt, RenameType, RelationType } from "../types";
import { rangeVar } from "./rangeVar";

export const renameStmt: Rule<RenameStmt> = transform(
  sequence([
    _,
    ALTER,
    __,
    TABLE,
    __,
    rangeVar, // 5
    __,
    RENAME,
    __,
    COLUMN,
    __,
    or([identifier, transform(quotedString, (v) => v.value)]), // 11
    __,
    TO,
    __,
    or([identifier, transform(quotedString, (v) => v.value)]), // 15
    endOfStatement,
  ]),
  (v, ctx) => {
    const result: RenameStmt = {
      renameType: RenameType.OBJECT_COLUMN,
      relationType: RelationType.OBJECT_TABLE,
      relation: v[5].value.RangeVar,
      subname: v[11],
      newname: v[15],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[5].codeComment,
        v[6],
        v[8],
        v[10],
        v[12],
        v[14],
        v[16]
      ),
    };

    return result;
  }
);
