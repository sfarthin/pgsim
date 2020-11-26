import { Decoder } from "decoders";
import { PGString, A_Const } from "./constant";
export declare type TypeName = {
    names: PGString[];
    typemod: number;
    typmods?: [{
        A_Const: A_Const;
    }] | [{
        A_Const: A_Const;
    }, {
        A_Const: A_Const;
    }];
    location: number;
    arrayBounds?: unknown;
};
export declare const typeNameDecoder: Decoder<TypeName>;
export declare type TypeCast = {
    arg?: unknown;
    typeName: {
        TypeName: TypeName;
    };
    location: number;
};
export declare const typeCastDecoder: Decoder<TypeCast>;
