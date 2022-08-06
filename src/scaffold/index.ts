import scaffoldTypes from "./types";
import scaffoldParser from "./parse";
import scaffoldFormatter from "./format";
import scaffoldFixtures from "./fixtures";

async function scaffold() {
  await scaffoldTypes();
  await scaffoldParser();
  await scaffoldFormatter();
  await scaffoldFixtures();
}

export default scaffold;

if (require.main === module) {
  scaffold();
}
