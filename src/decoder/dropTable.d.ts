import { Decoder } from "decoders";
import { PGString } from "./constant";
export declare type DropStmt = {
    objects: [[PGString]];
    removeType: number;
    behavior: number;
};
export declare const dropStmtDecoder: Decoder<DropStmt>;
