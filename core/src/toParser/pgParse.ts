import {
  Decoder,
  guard,
  array,
  optional,
  exact,
  mixed,
  string,
} from "decoders";
import { createHash } from "crypto";
// @ts-expect-error - No declaration
import { parse as pgParse } from "pg-query-native-latest";

type ParsedResult = {
  query: unknown[];
  stderr?: string;
  error?: unknown;
};

const parserResultDecoder: Decoder<ParsedResult> = exact({
  // This is mixed because Error messages are hard to read if we do this here, we validate each query seperately
  query: array(mixed),
  stderr: optional(string),
  error: optional(mixed),
});

const validateParsedResult = guard(parserResultDecoder);

function toHash(str: string): string {
  return createHash("md5").update(str).digest("hex");
}

// Lets make reparsing a free operation so
// don't need to think about performance
const cache: { [str in string]: ParsedResult } = {};

export default function (str: string): ParsedResult {
  const hash = toHash(str);

  if (!cache[hash]) {
    const unSafeResult = pgParse(str);
    cache[hash] = validateParsedResult(unSafeResult);
  }

  return cache[hash];
}
