import * as d from "decoders";
import { rawValueDecoder, RawValue } from "./rawExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { SortBy, sortByDecoder } from "./sortBy";
import { JoinExpr, joinExprDecoder } from "./joinExpr";
import { ColumnRef, columnRefDecoder } from "./columnRef";
import { ResTarget, resTargetDecoder } from "./resTarget";

export type CommonTableExpr = {
  ctename: string;
  ctematerialized: "CTEMaterializeDefault";
  ctequery: {
    SelectStmt: SelectStmt;
  };
  location: number;
};

export type SelectStmt = {
  op: "SETOP_NONE";
  limitOption: "LIMIT_OPTION_DEFAULT";
  targetList: {
    ResTarget?: ResTarget;
  }[];
  fromClause?: ({ RangeVar: RangeVar } | { JoinExpr: JoinExpr })[];
  whereClause?: RawValue;
  groupClause?: { ColumnRef: ColumnRef }[];
  withClause?: {
    ctes: {
      CommonTableExpr: CommonTableExpr;
    }[];
    location: number;
  };
  // intoClause?: unknown; // SELECT * INTO TABLE onek2 FROM onek;
  // limitOffset?: unknown;
  // limitCount?: unknown;
  // distinctClause?: unknown;
  // havingClause?: unknown;
  // lockingClause?: unknown; // SELECT ctid,cmin,* FROM combocidtest FOR UPDATE;
  sortClause?: {
    SortBy: SortBy;
  }[];
  codeComment?: string;
  codeComments?: {
    targetList?: string[];
    fromClause?: string[];
    whereClause?: string[];
    groupClause?: string[];
  };
};
// | {
//     op: number;
//     valuesLists?: unknown;
//     fromClause?: unknown;
//     whereClause?: unknown;
//     sortClause?: unknown;
//   }

// // (SELECT * FROM distinct_hash_1 EXCEPT SELECT * FROM distinct_group_1) UNION ALL (SELECT * FROM distinct_group_1 EXCEPT SELECT * FROM distinct_hash_1);
// // https://doxygen.postgresql.org/parsenodes_8h.html#a29d933d0f4ff963ca56745a8da93526b
// | {
//     op: number;
//     larg?: unknown;
//     rarg?: unknown;
//     all?: unknown;
//     sortClause?: unknown;
//     lockingClause?: unknown;
//     limitCount?: unknown;
//   };

export const selectStmtDecoder: d.Decoder<SelectStmt> = d.exact({
  targetList: d.array(
    d.exact({
      ResTarget: resTargetDecoder,
      codeComment: d.optional(d.string),
    })
  ),
  fromClause: d.optional(
    d.array(
      d.either(
        d.exact({
          RangeVar: rangeVarDecoder,
          codeComment: d.optional(d.string),
        }),
        d.exact({
          JoinExpr: joinExprDecoder,
          codeComment: d.optional(d.string),
        })
      )
    )
  ),
  whereClause: d.optional((blob) => rawValueDecoder(blob)),
  groupClause: d.optional(d.array(d.exact({ ColumnRef: columnRefDecoder }))),
  // intoClause: d.fail,
  withClause: d.optional(
    d.exact({
      ctes: d.array(
        d.exact({
          CommonTableExpr: d.exact({
            ctename: d.string,
            ctematerialized: d.constant("CTEMaterializeDefault"),
            ctequery: d.exact({
              SelectStmt: d.lazy(() => selectStmtDecoder),
            }),
            location: d.number,
          }),
        })
      ),
      location: d.number,
    })
  ),
  // limitOffset: d.unknown,
  // limitCount: d.unknown,
  // havingClause: d.unknown,
  // distinctClause: d.unknown,
  // lockingClause: d.unknown,
  sortClause: d.optional(d.array(d.exact({ SortBy: sortByDecoder }))),
  op: d.constant("SETOP_NONE"),
  limitOption: d.constant("LIMIT_OPTION_DEFAULT"),
});
//   ,
//   exact({
//     valuesLists: unknown,
//     fromClause: optional(array(unknown)),
//     whereClause: unknown,
//     sortClause: unknown,
//     op: number,
//   }),

//   exact({
//     op: number,
//     larg: unknown,
//     rarg: unknown,
//     all: unknown,
//     sortClause: unknown,
//     lockingClause: unknown,
//     limitCount: unknown,
//   })
// );
