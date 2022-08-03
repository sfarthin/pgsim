import * as d from "decoders";

export const createEventTrigStmtDecoder = d.fail(
  "CreateEventTrigStmt not implemented"
);
export type CreateEventTrigStmt = d.DecoderType<
  typeof createEventTrigStmtDecoder
>;
