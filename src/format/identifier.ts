import { Formatter } from "./util";

const NEEDS_TO_BE_QUOTED = /[^a-z0-9_]/;

export default function identifier<T>(c: string, f: Formatter<T>): T {
  const { identifier, literal } = f;

  return NEEDS_TO_BE_QUOTED.test(c) ? literal(`"${c}"`) : identifier(c);
}
