export enum PGErrorCode {
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NOT_UNDERSTOOD = "NOT_UNDERSTOOD",
  SCHEMA_ERROR = "SCHEMA_ERROR",
  NOT_ALLOWED = "NOT_ALLOWED",
  ARBITRARY = "ARBITRARY",
  NO_QUERIES = "NO_QUERIES",
  NO_ALTER_TABLE = "NO_ALTER_TABLE",
  NOT_EXISTS = "NOT_EXISTS",
}

export class PGError extends Error {
  id: PGErrorCode;
  constructor(code: PGErrorCode, msg: string) {
    super(msg);
    this.id = code;
  }
}
