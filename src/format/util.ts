import { NEWLINE } from "./print";

const MAX_INTELIGABLE_LINE = 80;

export type Node =
  | { type: "keyword"; text: string } // <-- We can be more specific than "string", reconcile with parser
  // Our formatter only does "sql" type, but when parsing we may come accross the "c" type
  | { type: "comment"; text: string; style: "c" | "sql" }
  | {
      type: "symbol";
      text: string; // <-- We can be more specific than "string", reconcile with parser
    }
  | { type: "identifier"; text: string }
  | { type: "numberLiteral"; text: string }
  | { type: "booleanLiteral"; text: "TRUE" | "FALSE" }
  | { type: "stringLiteral"; text: string }
  | { type: "tab" }
  | { type: "space" };

// spaces and newlines are encoded as a 2-dimensial array;
export type Line = Node[];
export type Block = Line[];
export type NodeType = Node["type"];

export type PartiallyParsedLine = (Node | { type: "unknown"; text: string })[];
export type PartiallyParsedBlock = PartiallyParsedLine[];

export const join = (lines: Block, joinToken: Line): Line =>
  lines.reduce(
    (acc, v, index) =>
      index === lines.length - 1
        ? [...acc, ...v]
        : [...acc, ...v, ...joinToken],
    [] as Line
  );

export const addToLastLine = (lines: Block, addition: Line) => {
  return [...lines.slice(0, -1), [...lines[lines.length - 1], ...addition]];
};

export function length(node: Node): number {
  switch (node.type) {
    case "tab":
      return 1;
    case "space":
      return 1;
    default:
      return node.text.length;
  }
}

export function lengthOfBlock(block: Block): number {
  return block.reduce(
    (acc, line) =>
      acc + line.reduce((subAcc, node) => subAcc + length(node), 0),
    0
  );
}

export function doesContainType(block: Block, type: NodeType): boolean {
  return block.some((line) => line.some((node) => node.type === type));
}

export function toSingleLineIfPossible(block: Block): Block {
  if (block.length === 0) {
    return block;
  }

  if (
    block[0].length === 1 &&
    block[0][0].type === "comment" &&
    block.length > 1
  ) {
    return [block[0], ...toSingleLineIfPossible(block.slice(1))];
  }

  if (
    lengthOfBlock(block) < MAX_INTELIGABLE_LINE &&
    // Comments have to have newlines, since they all use the "--" style
    !doesContainType(block, "comment")
  ) {
    const unformattedLine = block
      // Remove newlines
      .flatMap((line) => line.filter((n) => n.type !== "tab").concat(_))
      // flatten it out
      .flat();
    return [
      unformattedLine.reduce((acc, n, i) => {
        if (!acc.length) {
          return [n];
        }

        const lastNode = acc[acc.length - 1];
        const upcomingNodes = unformattedLine.slice(i);

        // If there is only whitespace left on line, trim those.
        const isOnlyWhitespaceLeftOnLine = !upcomingNodes.some(
          (n) => n.type !== "space" && n.type !== "tab"
        );
        if (isOnlyWhitespaceLeftOnLine) {
          return acc;
        }

        // No spaces before certain symbols
        if (
          lastNode.type === "space" &&
          n.type === "symbol" &&
          [",", "::", ";"].includes(n.text)
        ) {
          return [...acc.slice(0, -1), n];
        }

        // Lets make sure there is no space after an open parens/bracket.
        if (
          lastNode.type === "symbol" &&
          ["[", "("].includes(lastNode.text) &&
          n.type === "space"
        ) {
          return acc;
        }

        // Lets make sure we don't have spaces before our end parens/bracket
        if (
          lastNode.type === "space" &&
          n.type === "symbol" &&
          [")", "]"].includes(n.text) // "::", ","
        ) {
          return [...acc.slice(0, -1), n];
        }

        // Lets make sure we don't have duplicate spaces
        if (
          (lastNode.type === "space" || lastNode.type === "tab") &&
          n.type === "space"
        ) {
          return acc;
        }

        // We don't need tabs when we condence to a single line
        if (n.type === "tab") {
          return [...acc, { type: "space" }];
        }

        return [...acc, n];
      }, [] as Line),
    ];
  }

  return block;
}

export function indent(t: Node): Node;
export function indent(t: Block): Block;
export function indent(t: Line): Line;
export function indent(t: any): any {
  // Block
  if (Array.isArray(t) && Array.isArray(t[0])) {
    return (t as Block).map((r) => [{ type: "tab" }, ...r]);
  }

  // Line
  if (Array.isArray(t)) {
    return [{ type: "tab" }, ...t];
  }

  // Node
  return t;
}

const NEEDS_TO_BE_QUOTED = /[^a-z0-9_]/;
export function identifier(c: string): Node {
  return {
    type: "identifier",
    text: NEEDS_TO_BE_QUOTED.test(c) ? `"${c}"` : c,
  };
}

export function symbol(c: string): Node {
  return { type: "symbol", text: c };
}

export function keyword(c: string): Node {
  return { type: "keyword", text: c.toUpperCase() };
}

export const _: Node = { type: "space" };
export const TRUE: Node = { type: "booleanLiteral", text: "TRUE" };
export const FALSE: Node = { type: "booleanLiteral", text: "FALSE" };
export const NULL: Node = { type: "stringLiteral", text: "NULL" };

// We always use sql style comments so we don't have to handle "*/" within comments
// and so we can easilly comment/uncomment.
export function comment(s: string | undefined): Block {
  if (!s) {
    return [];
  }

  return s
    .split(NEWLINE)
    .filter(Boolean)
    .map((line) => [{ type: "comment", text: `-- ${line}`, style: "sql" }]);
}

// export function literal(s: string | number | boolean): Node {
//   if (typeof s === "string") {
//     return { type: "stringLiteral", text: s };
//   }
//   if (typeof s === "number") {
//     return { type: "numberLiteral", text: `${s}` };
//   }
//   if (typeof s === "boolean") {
//     return { type: "booleanLiteral", text: s ? "TRUE" : "FALSE" };
//   }

//   throw new Error(`Not a literal: ${s}`);
// }

export function stringLiteral(s: string): Node {
  return { type: "stringLiteral", text: `'${s}'` };
}

export function integerLiteral(s: number): Node {
  return { type: "numberLiteral", text: `${s}` };
}

export function floatLiteral(s: string): Node {
  return { type: "numberLiteral", text: s };
}
