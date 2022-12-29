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
  endOfStatement,
  EOS,
} from "./util";
import { RenameStmt, RenameType, RelationType } from "~/types";
import { rangeVar } from "./rangeVar";

export const renameTableStmt: Rule<{
  eos: EOS;
  value: { RenameStmt: RenameStmt };
}> = transform(
  sequence([
    ALTER,
    __,
    TABLE,
    __,
    rangeVar, // 4
    __,
    RENAME,
    __,
    TO,
    __,
    or([identifier, transform(quotedString, (v) => v.value)]), // 15
    endOfStatement,
  ]),
  (v) => {
    const result: RenameStmt = {
      renameType: RenameType.OBJECT_TABLE,
      relationType: RelationType.OBJECT_ACCESS_METHOD,
      relation: v[4].value.RangeVar,
      newname: v[10],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[1],
        v[3],
        v[4].codeComment,
        v[5],
        v[7],
        v[9]
      ),
    };

    return { eos: v[11], value: { RenameStmt: result } };
  }
);

export const renameColumnStmt: Rule<{
  eos: EOS;
  value: { RenameStmt: RenameStmt };
}> = transform(
  sequence([
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
  (v) => {
    const result: RenameStmt = {
      renameType: RenameType.OBJECT_COLUMN,
      relationType: RelationType.OBJECT_TABLE,
      relation: v[4].value.RangeVar,
      subname: v[10],
      newname: v[14],
      behavior: "DROP_RESTRICT",
      codeComment: combineComments(
        v[1],
        v[3],
        v[4].codeComment,
        v[5],
        v[7],
        v[9],
        v[11],
        v[13],
        v[15].comment
      ),
    };

    return { eos: v[15], value: { RenameStmt: result } };
  }
);

export const renameStmt = or([renameColumnStmt, renameTableStmt]);
