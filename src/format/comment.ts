export default function comment(s: string | undefined, numTabs = 0): string {
  const tabs = [...new Array(numTabs)].map(() => "\t");
  if (!s) {
    return "";
  }

  if (!s.match(/\n/)) {
    return `${tabs}-- ${s}\n`;
  }

  /**
   * Comment
   * will look like this.
   */
  return `${tabs}/**\n${tabs} * ${s
    .split("\n")
    .filter(Boolean)
    .join(`\n${tabs} * `)}${tabs}\n${tabs} */\n`;
}
