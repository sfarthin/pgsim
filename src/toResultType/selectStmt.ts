import {
  FuncCall,
  SelectStmt,
  isNullable,
  FromClause,
  TargetValue,
  fromClauseDecoder,
  verifyTargetValue,
  verifySelectStatement,
  A_Const,
  ColumnRef,
  verifyColumnDef,
  verifyResTarget,
  CreateStmt,
  verifyFromClause,
} from "../decoder";
import { Schema } from "../toSchema";
import { getPrimitiveType } from "./getPrimitiveType";
import { PGErrorCode, PGError } from "../errors";
import { Source, Field } from "./types";
import { RangeVar } from "../decoder";
import { guard, array } from "decoders";

function fromFunctionCall(funcCall: FuncCall, sources: Source[]): Field {
  if (funcCall.funcname.length !== 1) {
    throw new PGError(
      PGErrorCode.NOT_UNDERSTOOD,
      "Does not handle member expression functions"
    );
  }
  const name = funcCall.funcname[0].String.str;
  switch (name) {
    case "count":
      return {
        name,
        type: "int8",
        isNullable: false,
      };
    case "max":
    case "min":
      if ("args" in funcCall) {
        if (funcCall.args.length !== 1) {
          throw new PGError(
            PGErrorCode.INVALID,
            `${name}() expects exactly one argument`
          );
        }

        const target = verifyTargetValue(funcCall.args[0]);
        const fieldsFromTarget = fromTargetValue(target, sources);

        if (fieldsFromTarget.length !== 1) {
          throw new PGError(PGErrorCode.INVALID, `invalid argument to ${name}`);
        }

        return { name, type: fieldsFromTarget[0].type, isNullable: true };
      } else {
        // This much mean star is used.
        throw new PGError(PGErrorCode.INVALID, `${name}(*) not allowed`);
      }
    default:
      throw new PGError(PGErrorCode.NOT_UNDERSTOOD, `Unknown method ${name}`);
  }
}

function fromConstant(constant: A_Const): Field {
  const type =
    "String" in constant.val
      ? "varchar"
      : "Float" in constant.val
      ? "real"
      : "Integer" in constant.val
      ? "integer"
      : null;

  if (!type) {
    throw new PGError(
      PGErrorCode.NOT_UNDERSTOOD,
      `Unhanded type ${Object.keys(constant.val)[0]}`
    );
  }

  return {
    isNullable: false,
    name: null,
    type,
  };
}

function fromColumnRef(columnRef: ColumnRef, sources: Source[]): Field[] {
  const fields = columnRef.fields;
  if (fields.length === 2 && "String" in fields[1]) {
    const sourceName = fields[0].String.str;
    const fieldName = fields[1].String.str;
    const source = sources.find((s) => s.name === sourceName);

    if (!source) {
      throw new PGError(
        PGErrorCode.INVALID,
        `${sourceName}.${fieldName} not found`
      );
    }

    const field = source.fields.find((f) => f.name === fieldName);

    if (!field) {
      throw new PGError(
        PGErrorCode.INVALID,
        `${sourceName}.${fieldName} not found`
      );
    }

    return [field];
  } else if (fields.length === 1 && "A_Star" in fields[0]) {
    if (sources.length !== 1) {
      throw new PGError(
        PGErrorCode.INVALID,
        `Cannot use * when multiple tables in FROM`
      );
    }

    return sources[0].fields;
  } else if (fields.length === 1 && "String" in fields[0]) {
    const fieldName = fields[0].String.str;

    const possibleSources = sources.filter(({ fields }) =>
      fields.find((f) => f.name === fieldName)
    );

    if (possibleSources.length !== 1) {
      throw new PGError(
        PGErrorCode.INVALID,
        `${fieldName} doesn't refer to a single source`
      );
    }

    const field = possibleSources[0].fields.find((f) => f.name === fieldName);

    if (!field) {
      throw new PGError(PGErrorCode.INVALID, `${fieldName} not found`);
    }

    return [field];
  }

  throw new PGError(
    PGErrorCode.NOT_UNDERSTOOD,
    `Unsure how to hanfle ${fields}`
  );
}

function fromTargetValue(target: TargetValue, sources: Source[]): Field[] {
  if ("ColumnRef" in target) {
    return fromColumnRef(target.ColumnRef, sources);
  } else if ("FuncCall" in target) {
    return [fromFunctionCall(target.FuncCall, sources)];
  } else if ("A_Const" in target) {
    return [fromConstant(target.A_Const)];
  }

  throw new PGError(
    PGErrorCode.NOT_UNDERSTOOD,
    `Unsure how to handle "${Object.keys(target)[0]}"`
  );
}

export function getFieldsFromTable(table: CreateStmt): Field[] {
  const fields: Field[] = [];
  const tableElts = table.tableElts || [];
  for (const t of tableElts) {
    if ("ColumnDef" in t) {
      const columnDef = verifyColumnDef(t.ColumnDef);
      fields.push({
        name: columnDef.colname,
        isNullable: isNullable(columnDef.constraints || []),
        type: getPrimitiveType(columnDef),
      });
    }
  }

  return fields;
}

function getSourceFromRangeVar(schema: Schema, rangeVar: RangeVar): Source {
  const name = rangeVar.alias
    ? rangeVar.alias.Alias.aliasname // is aliased table
    : rangeVar.relname; // is table name

  for (const table of schema.tables) {
    if (table.relation.RangeVar.relname === rangeVar.relname) {
      return {
        name,
        fields: getFieldsFromTable(table),
      };
    }
  }

  throw new PGError(
    PGErrorCode.INVALID,
    `Table "${rangeVar.relname}" does not exisit`
  );
}

function getSources(schema: Schema, fromClauses: FromClause[]): Source[] {
  let sources: Source[] = [];
  for (const fromClause of fromClauses) {
    if ("RangeVar" in fromClause) {
      sources = sources.concat(
        getSourceFromRangeVar(schema, fromClause.RangeVar)
      );
    } else if ("JoinExpr" in fromClause) {
      const larg = verifyFromClause(fromClause.JoinExpr.larg);
      const rarg = verifyFromClause(fromClause.JoinExpr.rarg);
      sources = sources
        .concat(getSources(schema, [larg]))
        .concat(getSources(schema, [rarg]))
        .filter(Boolean);
    } else if ("RangeSubselect" in fromClause) {
      sources = sources.concat({
        name: fromClause.RangeSubselect.alias.Alias.aliasname,
        fields: fromSelect(
          schema,
          verifySelectStatement(fromClause.RangeSubselect.subquery).SelectStmt
        ),
      });
    } else {
      throw new PGError(
        PGErrorCode.NOT_UNDERSTOOD,
        `Do not understand from clause - ${Object.keys(fromClause)[0]}`
      );
    }
  }

  return sources;
}

export function fromSelect(schema: Schema, query: SelectStmt): Field[] {
  const fromClauses =
    "fromClause" in query
      ? guard(array(fromClauseDecoder))(query.fromClause)
      : [];

  const sources = getSources(schema, fromClauses);

  const fields: Field[] = [];

  if ("targetList" in query) {
    for (const { ResTarget: t } of query.targetList) {
      const target = verifyResTarget(t);
      const fieldsFromTarget = fromTargetValue(target.val, sources);
      for (const { name, type, isNullable } of fieldsFromTarget) {
        fields.push({
          name: target.name ? target.name : name,
          type,
          isNullable,
        });
      }
    }

    return fields;
  }

  throw new PGError(PGErrorCode.NOT_UNDERSTOOD, `Do not understand valueLists`);
}
