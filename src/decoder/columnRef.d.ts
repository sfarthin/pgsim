import { Decoder } from "decoders";
import { PGString, Star } from "./constant";
export declare type ColumnRef = {
    fields: [Star] | [PGString] | [PGString, PGString] | [PGString, Star];
    location: number;
};
export declare const columnRefDecoder: Decoder<ColumnRef>;
