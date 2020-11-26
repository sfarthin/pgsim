import { Decoder } from "decoders";
import { StringValue } from "./constant";
export declare type CreateEnumStmt = {
    typeName: [{
        String: StringValue;
    }] | [{
        String: StringValue;
    }, {
        String: StringValue;
    }];
    vals: {
        String: StringValue;
    }[];
};
export declare const createEnumStmtDecoder: Decoder<CreateEnumStmt>;
