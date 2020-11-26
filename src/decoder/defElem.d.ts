import { Decoder } from "decoders";
export declare type DefElem = {
    defname: "start" | "increment" | "maxvalue" | "cache" | "minvalue" | "cycle";
    arg?: {
        Integer: {
            ival: number;
        };
    };
    defaction: number;
    location: number;
} | {
    defname: "owned_by";
    arg: {
        String: {
            str: string;
        };
    }[];
    defaction: number;
    location: number;
};
export declare const defElemDecoder: Decoder<DefElem>;
