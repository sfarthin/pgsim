import {
  AExpr,
  Alias,
  AlterEnumStmt,
  AlterOwnerStmt,
  AlterSeqStmt,
  AlterTableStmt,
  BooleanTest,
  BoolExpr,
  ColumnRef,
  A_Const,
  Constraint,
  CreateEnumStmt,
  CreateSeqStmt,
  ColumnDef,
  CreateStmt,
  DefElem,
  DropStmt,
  RangeSubselect,
  FuncCall,
  IndexElem,
  IndexStmt,
  InsertStmt,
  JoinExpr,
  NullTest,
  RangeVar,
  RowExpr,
  ResTarget,
  SelectStmt,
  SortBy,
  SubLink,
  TypeCast,
  TypeName,
  VariableSetStmt,
  ViewStmt,
  Float,
  String,
  Integer,
  A_Star,
  Null,
  AlterTableCmd,
  CaseWhen,
  CaseExpr,
} from "../types";

// Full list here: https://doxygen.postgresql.org/nodes_8h.html#a83ba1e84fa23f6619c3d29036b160919
export type Node =
  | { A_Expr: AExpr }
  | { Alias: Alias }
  | { AlterEnumStmt: AlterEnumStmt }
  | { AlterOwnerStmt: AlterOwnerStmt }
  | { AlterSeqStmt: AlterSeqStmt }
  | { AlterTableCmd: AlterTableCmd }
  | { AlterTableStmt: AlterTableStmt }
  | { BooleanTest: BooleanTest }
  | { BoolExpr: BoolExpr }
  | { ColumnRef: ColumnRef }
  | { A_Const: A_Const }
  | { Constraint: Constraint }
  | { CreateEnumStmt: CreateEnumStmt }
  | { CreateSeqStmt: CreateSeqStmt }
  | { ColumnDef: ColumnDef }
  | { CreateStmt: CreateStmt }
  | { DefElem: DefElem }
  | { DropStmt: DropStmt }
  | { RangeSubselect: RangeSubselect }
  | { FuncCall: FuncCall }
  | { IndexElem: IndexElem }
  | { IndexStmt: IndexStmt }
  | { InsertStmt: InsertStmt }
  | { JoinExpr: JoinExpr }
  | { NullTest: NullTest }
  | { RangeVar: RangeVar }
  | { RowExpr: RowExpr }
  | { SelectStmt: SelectStmt }
  | { ResTarget: ResTarget }
  | { SortBy: SortBy }
  | { SubLink: SubLink }
  | { TypeCast: TypeCast }
  | { TypeName: TypeName }
  | { VariableSetStmt: VariableSetStmt }
  | { ViewStmt: ViewStmt }
  | { Float: Float }
  | { String: String }
  | { Integer: Integer }
  | { Null: Null }
  | { A_Star: A_Star }
  | { CaseWhen: CaseWhen }
  | { CaseExpr: CaseExpr };

// Converts a union of two types into an intersection
// i.e. A | B -> A & B
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// Flattens two union types into a single type with optional values
// i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K] extends any[]
      ? T[K]
      : T[K] extends object
      ? FlattenUnion<T[K]>
      : T[K]
    : UnionToIntersection<T>[K] | undefined;
};

// Takes all the names from above ^^ and puts them into a union.
export type NodeName = keyof FlattenUnion<Node>;

export type NodeFromName<T extends NodeName> = Exclude<
  FlattenUnion<Node>[T],
  undefined
>;

export type Visitor = { [s in NodeName]: (node: NodeFromName<s>) => void };

// Have some kind of test that looks for children in parsed AST and suggests adding it here.
export function children(node: Node): Node[] {
  if ("A_Expr" in node) {
    return [
      node.A_Expr.lexpr,
      ...(Array.isArray(node.A_Expr.rexpr)
        ? node.A_Expr.rexpr
        : node.A_Expr.rexpr
        ? [node.A_Expr.rexpr]
        : []),
    ].flatMap((r) => (r ? [r] : []));
  } else if ("Alias" in node) {
    return [];
  } else if ("AlterEnumStmt" in node) {
    return [];
  } else if ("AlterOwnerStmt" in node) {
    return [];
  } else if ("AlterSeqStmt" in node) {
    return [];
  } else if ("AlterTableStmt" in node) {
    return node.AlterTableStmt.cmds;
  } else if ("BooleanTest" in node) {
    return [];
  } else if ("BoolExpr" in node) {
    return node.BoolExpr.args;
  } else if ("ColumnRef" in node) {
    return node.ColumnRef.fields;
  } else if ("A_Const" in node) {
    return [];
  } else if ("Constraint" in node) {
    return [];
  } else if ("CreateEnumStmt" in node) {
    return node.CreateEnumStmt.typeName;
  } else if ("CreateSeqStmt" in node) {
    return [node.CreateSeqStmt.sequence];
  } else if ("ColumnDef" in node) {
    return [
      node.ColumnDef.typeName,
      ...(node.ColumnDef.constraints ? node.ColumnDef.constraints : []),
    ];
  } else if ("CreateStmt" in node) {
    return [...(node.CreateStmt.tableElts ?? [])];
  } else if ("DefElem" in node) {
    return [
      ...(Array.isArray(node.DefElem.arg)
        ? node.DefElem.arg
        : node.DefElem.arg
        ? [node.DefElem.arg]
        : []),
    ];
  } else if ("DropStmt" in node) {
    return [];
  } else if ("RangeSubselect" in node) {
    return [];
  } else if ("FuncCall" in node) {
    return [];
    // return [...(node.FuncCall.args?.flat() ?? [])];
  } else if ("IndexElem" in node) {
    return [];
  } else if ("IndexStmt" in node) {
    return [];
  } else if ("InsertStmt" in node) {
    return [];
  } else if ("JoinExpr" in node) {
    return [node.JoinExpr.larg, node.JoinExpr.rarg];
  } else if ("NullTest" in node) {
    return [];
  } else if ("RangeVar" in node) {
    return [];
  } else if ("RowExpr" in node) {
    return node.RowExpr.args;
  } else if ("SelectStmt" in node) {
    return node.SelectStmt.fromClause ? node.SelectStmt.fromClause : [];
  } else if ("ResTarget" in node) {
    return [];
  } else if ("SortBy" in node) {
    return [];
  } else if ("SubLink" in node) {
    return [node.SubLink.subselect];
  } else if ("TypeCast" in node) {
    return node.TypeCast.arg ? [node.TypeCast.arg] : [];
  } else if ("TypeName" in node) {
    return [];
  } else if ("VariableSetStmt" in node) {
    return [];
  } else if ("ViewStmt" in node) {
    return [node.ViewStmt.view];
  } else if ("CaseWhen" in node) {
    return [node.CaseWhen.expr, node.CaseWhen.result];
  } else if ("CaseExpr" in node) {
    return node.CaseExpr.args;
  }

  return [];
}
