import { Decoder } from "decoders";
import { RangeVar } from "./rangeVar";
import { PGString } from "./constant";
import { TargetValue } from "./targetValue";
export declare enum ConType {
    NOT_NULL = 1,
    DEFAULT = 2,
    CHECK = 4,
    PRIMARY_KEY = 5,
    UNIQUE = 6,
    REFERENCE = 7,
    FOREIGN_KEY = 8
}
/**
 * Primary Key
 */
export declare type PrimaryKeyConstraint = {
    contype: ConType.PRIMARY_KEY;
    location: number;
    conname?: string;
    keys?: PGString[];
};
export declare const primaryKeyConstraintDecoder: Decoder<PrimaryKeyConstraint>;
/**
 * Not Null
 */
export declare type NotNullConstraint = {
    contype: ConType.NOT_NULL;
    location: number;
};
export declare const notNullConstraintDecoder: Decoder<NotNullConstraint>;
/**
 * Default
 */
export declare type DefaultConstraint = {
    contype: ConType.DEFAULT;
    location: number;
    raw_expr: TargetValue;
};
export declare const defaultConstraintDecoder: Decoder<DefaultConstraint>;
/**
 * Unique
 */
export declare type UniqueConstraint = {
    contype: ConType.UNIQUE;
    location: number;
    conname?: string;
    keys?: [PGString];
};
export declare const uniqueConstraintDecoder: Decoder<{
    location?: number;
    contype?: ConType.UNIQUE;
    conname?: string;
    keys?: [PGString];
}, unknown>;
/**
 * Foreign Key
 */
export declare type ForeignKeyConstraint = {
    contype: ConType.REFERENCE | ConType.FOREIGN_KEY;
    location: number;
    fk_upd_action: string;
    fk_del_action: string;
    fk_matchtype: string;
    initially_valid: boolean;
    pktable: {
        RangeVar: RangeVar;
    };
    pk_attrs?: [PGString];
    conname?: unknown;
    fk_attrs?: unknown;
};
export declare const foreignKeyConstraint: Decoder<ForeignKeyConstraint>;
/**
 * Check Constraint
 */
export declare type CheckConstraint = {
    contype: ConType.CHECK;
    conname: string;
    location: number;
    raw_expr: TargetValue;
    skip_validation?: boolean;
    initially_valid?: boolean;
};
export declare const CheckConstraintDecoder: Decoder<CheckConstraint>;
export declare type Constraint = NotNullConstraint | DefaultConstraint | UniqueConstraint | PrimaryKeyConstraint | ForeignKeyConstraint | CheckConstraint;
export declare const constraintDecoder: Decoder<Constraint>;
export declare function isPrimaryKey(constraints: {
    Constraint: Constraint;
}[] | void): boolean;
export declare function getReference(constraints: {
    Constraint: Constraint;
}[]): {
    tablename: string;
    colname: string;
} | null;
export declare function isNullable(constraints: {
    Constraint: Constraint;
}[]): boolean;
