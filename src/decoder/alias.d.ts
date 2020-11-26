import { Decoder } from "decoders";
import { PGString } from "./constant";
export declare type Alias = {
    aliasname: string;
    colnames?: PGString[];
};
export declare const aliasDecoder: Decoder<Alias>;
