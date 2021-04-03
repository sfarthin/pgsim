import { Stmt } from "../types";

export const NEWLINE = "\n";
export const TAB = "\t";

export type Formatter<T> = {
  // basic tokens
  keyword: (s: string) => T;
  literal: (s: string | number | boolean) => T;
  codeComment: (s: string) => T;
  symbol: (s: string) => T;
  identifier: (s: string) => T;
  number: (s: number) => T;

  stmt: (s: T, stmt: Stmt) => T;

  _: T;
  indent: <R extends T[] | T[][]>(line: R) => R;
  empty: T;

  concat: (t: T[][]) => T;
};

export const textFormatter: Formatter<string> = {
  keyword: (s) => s.toUpperCase(),
  literal: (s) => `${s}`,
  codeComment: (s) => s,
  symbol: (s) => s,
  identifier: (s) => s,
  number: (s) => `${s}`,

  concat: (t) => {
    try {
      return t.map((r) => r.join("")).join(NEWLINE);
    } catch (e) {
      console.error(t);
      throw e;
    }
  },
  stmt: (s) => s,

  _: " ",
  // @ts-expect-error
  indent: (t) => {
    if (Array.isArray(t[0])) {
      return (t as string[][]).map((r) => [TAB, ...r]);
    }
    if (t.length) {
      return [TAB, ...(t as string[])];
    }

    return t;
  },
  empty: "",
};

export const join = <T>(lines: T[][], joinToken: T[]): T[] =>
  lines.reduce(
    (acc, v, index) =>
      index === lines.length - 1
        ? [...acc, ...v]
        : [...acc, ...v, ...joinToken],
    [] as T[]
  );

export const flatten = <T>(lines: T[][]) =>
  lines.reduce((acc, line) => [...acc, ...line], [] as T[]);

export const addToLastLine = <T>(lines: T[][], addition: T[]) => {
  return [...lines.slice(0, -1), [...lines[lines.length - 1], ...addition]];
};

// type Node =
//   | { type: "keyword"; value: string }
//   | { type: "literal"; value: string }
//   | { type: "codeComment"; value: string }
//   | { type: "symbol"; value: string }
//   | { type: "identifier"; value: string }
//   | { type: "space" }
//   | { type: "newline" };

// export const keyword = (value: string): Node => ({ type: "keyword", value });

// export const symbol = (value: string): Node => ({ type: "symbol", value });

// export const endOfStatement = symbol(";");

// export const _ = { type: "space" };

// export const newline = { type: "newline" };

// const concat;

// export const statement = (...l: Node[]) => [...l, endOfStatement, newline];
