import * as d from "decoders";

export const commentDecoder = d.string;
export type Comment = d.DecoderType<typeof commentDecoder>;
