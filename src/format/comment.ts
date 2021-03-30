import { Formatter, NEWLINE } from "./util";

// We always use sql style comments so we don't have to handle "*/" within comments
// and so we can easilly comment/uncomment.
export default function comment<T>(
  s: string | undefined,
  f: Formatter<T>
): T[][] {
  const { codeComment } = f;
  if (!s) {
    return [];
  }

  return s
    .split(NEWLINE)
    .filter(Boolean)
    .map((line) => [codeComment(`-- ${line}`)]);
}
