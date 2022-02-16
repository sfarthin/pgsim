import yargs from "yargs/yargs";
import "regenerator-runtime/runtime.js";

const format = () => console.log("🎵 Oy oy oy");

const parse = async () => {
  console.log("parse");
  // console.log(
  //   JSON.stringify(parse(readFileSync(filepath).toString()), null, 2)
  // );
};

const argv = yargs(process.argv.splice(2))
  .command("parse", "parse SQL file and return AST JSON", () => {}, parse)
  .command(
    "format",
    "parse SQL file and return formmated SQL",
    () => {},
    format
  )
  .demandCommand(1, 1, "Choose a command")
  .strict()
  .help("h").argv;

// const argv = minimist(process.argv.slice(2));
// const command = argv._[0];
// const filepath = argv._[1] ? join(process.cwd(), argv._[1]) : null;

// function help() {
//   return `Use format:

//   pg-sim [ parse | format | dump ] ./path/to/file.sql

//   pg-sim migrate ./path/to/file.sql ./path/to/file2.sql

//   `;
// }

// if (!command || !filepath) {
//   console.error(help());
//   process.exit(1);
// }

// switch (command) {
//   case "parse":
// console.log(
//   JSON.stringify(parse(readFileSync(filepath).toString()), null, 2)
// );
//     process.exit(0);
//   case "format":
//     console.log(format(readFileSync(filepath).toString()));
//     process.exit(0);
//   case "dump":
//     console.log(dump(readFileSync(filepath).toString()));
//     process.exit(0);
//   case "migrate": {
//     const filepath2 = argv._[2] ? join(process.cwd(), argv._[2]) : null;
//     if (!filepath2) {
//       console.log(help());
//       process.exit(1);
//     }
//     console.log(
//       format(
//         migrate(
//           readFileSync(filepath).toString(),
//           readFileSync(filepath2).toString(),
//           {
//             fromFile: filepath,
//             toFile: filepath2,
//           }
//         )
//       )
//     );
//   }
// }
