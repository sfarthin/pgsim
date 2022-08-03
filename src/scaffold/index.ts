import writeTypesIndex from "./typesIndex";

async function scaffold() {
  await writeTypesIndex();
}

export default scaffold;

if (require.main === module) {
  scaffold();
}
