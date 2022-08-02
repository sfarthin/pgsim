import { List } from "~/types";

export function list<I, T>(n: List<I>, fn: (e: I, i: number) => T) {
  if (Array.isArray(n.items)) {
    return n.items.map(fn);
  } else {
    return [fn(n.items, 0)];
  }
}
