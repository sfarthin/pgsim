import yargs from "yargs/yargs";
import { readFileSync } from "fs";
import "regenerator-runtime/runtime.js";
import parse from "./parse";
import format from "./format";
import { resolve } from "path";

Error.stackTraceLimit = Infinity;
yargs(process.argv.splice(2))
  .command(
    "parse <filename>",
    "parse SQL file and return AST JSON",
    {
      filename: {
        alias: "f",
        type: "string",
        required: true,
      },
    },
    (r) => {
      const str = readFileSync(resolve(process.cwd(), r.filename)).toString();
      const response = parse({ str, filename: r.filename, pos: 0 });

      console.log(JSON.stringify(response, null, 2));
    }
  )
  .command(
    "format <filename>",
    "parse SQL file and return formmated SQL",
    {
      filename: {
        type: "string",
        required: true,
        describe: "Path to file SQL file",
      },
      lineNumbers: {
        type: "boolean",
        default: false,
        describe: "Include line number on each line",
      },
      colors: {
        type: "boolean",
        default: true,
        describe: "Remove ansi colors from output",
      },
    },
    (r) => {
      const str = readFileSync(resolve(process.cwd(), r.filename)).toString();
      const response = format(str, r);

      console.log(response);
    }
  )
  .demandCommand(1, 1, "Choose a command")
  .strict()
  .help().argv;

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
