export enum PGErrorCode {
  // Any error not explicitly thrown
  INTERNAL_ERROR = "INTERNAL_ERROR",

  // The parser does not handle this case.
  NOT_UNDERSTOOD = "NOT_UNDERSTOOD",

  // The statement has an invalid reference or option.
  INVALID = "INVALID",

  // Refers to LINT OPTIONS
  NOT_QUERIES = "NOT_QUERIES",
  NOT_SCHEMA = "NOT_SCHEMA",
}

export class PGError extends Error {
  id: PGErrorCode;
  constructor(code: PGErrorCode, msg: string) {
    super(msg);
    this.id = code;
  }
}
