import { NEWLINE, TAB } from "./whitespace";

// We always use sql style comments so we don't have to handle "*/" within comments
// and so we can easilly comment/uncomment.
export default function comment(s: string | undefined, numTabs = 0): string {
  const tabs = [...new Array(numTabs)].map(() => TAB);
  if (!s) {
    return "";
  }

  return `${tabs}-- ${s
    .split(NEWLINE)
    .filter(Boolean)
    .join(`${NEWLINE}${tabs}-- `)}${NEWLINE}`;
}
