// We always use sql style comments so we don't have to handle "*/" within comments
// and so we can easilly comment/uncomment.
export default function comment(s: string | undefined, numTabs = 0): string {
  const tabs = [...new Array(numTabs)].map(() => "\t");
  if (!s) {
    return "";
  }

  return `${tabs}-- ${s.split("\n").filter(Boolean).join(`\n${tabs}-- `)}\n`;
}
