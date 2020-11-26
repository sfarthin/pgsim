import { Decoder } from "decoders";
import { A_Const } from "./constant";
export declare type VariableSetStmt = {
    kind: number;
    name: string;
    args?: [{
        A_Const: A_Const;
    }];
    is_local?: boolean;
};
export declare const variableSetStmtDecoder: Decoder<VariableSetStmt>;
