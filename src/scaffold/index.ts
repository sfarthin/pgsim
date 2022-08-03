import writeTypes from "./types";

async function scaffold() {
  await writeTypes();
}

export default scaffold;

if (require.main === module) {
  scaffold();
}
