import { Decoder } from "decoders";
import { Alias } from "./alias";
export declare type RangeVar = {
    schemaname?: string;
    relname: string;
    inhOpt?: number;
    relpersistence: string;
    location: number;
    inh?: boolean;
    alias?: {
        Alias: Alias;
    };
};
export declare const rangeVarDecoder: Decoder<RangeVar>;
