import scaffoldTypes from "./types";
import scaffoldParser from "./parse";
import scaffoldFormatter from "./format";

async function scaffold() {
  await scaffoldTypes();
  await scaffoldParser();
  await scaffoldFormatter();
}

export default scaffold;

if (require.main === module) {
  scaffold();
}
