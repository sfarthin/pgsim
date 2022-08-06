import scaffoldTypes from "./types";
import scaffoldParser from "./parse";

async function scaffold() {
  await scaffoldTypes();
  await scaffoldParser();
}

export default scaffold;

if (require.main === module) {
  scaffold();
}
