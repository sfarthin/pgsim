export function assertError(e: unknown): asserts e is Error {
  if (e instanceof Error) {
    return;
  }

  throw e;
}
