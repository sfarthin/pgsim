import * as d from "decoders";

export type DropBehavior = "DROP_RESTRICT" | "DROP_CASCADE";
export const dropBehaviorDecoder: d.Decoder<DropBehavior> = d.either(
  d.constant("DROP_RESTRICT"),
  d.constant("DROP_CASCADE")
);
