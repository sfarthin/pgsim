import { Decoder } from "decoders";
import { RangeVar } from "./rangeVar";
import { DefElem } from "./defElem";
export declare type CreateSeqStmt = {
    sequence: {
        RangeVar: RangeVar;
    };
    options?: {
        DefElem: DefElem;
    }[];
};
export declare const createSeqStmtDecoder: Decoder<CreateSeqStmt>;
