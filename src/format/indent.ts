import { Line, Block } from "./util";

// export default function indent(t: Line): Line;
// export default function indent(t: Block): Block;
export default function indent<T extends Line | Block>(t: T): T {
  // If its empty, it doesn't matter
  if (t.length === 0) {
    return t;
  }

  // If the first entry is an array, it must be a Block
  if (Array.isArray(t[0])) {
    return (t as Block).map((r) => [{ type: "tab" }, ...r]) as T;
  }

  // This must be a line
  return [{ type: "tab" }, ...t] as T;
}
