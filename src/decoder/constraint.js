"use strict";
exports.__esModule = true;
exports.isNullable = exports.getReference = exports.isPrimaryKey = exports.constraintDecoder = exports.CheckConstraintDecoder = exports.foreignKeyConstraint = exports.uniqueConstraintDecoder = exports.defaultConstraintDecoder = exports.notNullConstraintDecoder = exports.primaryKeyConstraintDecoder = exports.ConType = void 0;
var decoders_1 = require("decoders");
var rangeVar_1 = require("./rangeVar");
var constant_1 = require("./constant");
var tuple1_1 = require("./tuple1");
var targetValue_1 = require("./targetValue");
var ConType;
(function (ConType) {
    ConType[ConType["NOT_NULL"] = 1] = "NOT_NULL";
    ConType[ConType["DEFAULT"] = 2] = "DEFAULT";
    ConType[ConType["CHECK"] = 4] = "CHECK";
    ConType[ConType["PRIMARY_KEY"] = 5] = "PRIMARY_KEY";
    ConType[ConType["UNIQUE"] = 6] = "UNIQUE";
    ConType[ConType["REFERENCE"] = 7] = "REFERENCE";
    ConType[ConType["FOREIGN_KEY"] = 8] = "FOREIGN_KEY";
})(ConType = exports.ConType || (exports.ConType = {}));
exports.primaryKeyConstraintDecoder = decoders_1.exact({
    contype: decoders_1.constant(ConType.PRIMARY_KEY),
    location: decoders_1.number,
    conname: decoders_1.optional(decoders_1.string),
    keys: decoders_1.optional(decoders_1.array(constant_1.stringDecoder))
});
exports.notNullConstraintDecoder = decoders_1.exact({
    contype: decoders_1.constant(ConType.NOT_NULL),
    location: decoders_1.number
});
exports.defaultConstraintDecoder = decoders_1.exact({
    contype: decoders_1.constant(ConType.DEFAULT),
    location: decoders_1.number,
    raw_expr: targetValue_1.targetValueDecoder
});
exports.uniqueConstraintDecoder = decoders_1.exact({
    contype: decoders_1.constant(ConType.UNIQUE),
    location: decoders_1.number,
    conname: decoders_1.optional(decoders_1.string),
    keys: decoders_1.optional(tuple1_1.tuple1(constant_1.stringDecoder))
});
exports.foreignKeyConstraint = decoders_1.exact({
    contype: decoders_1.either(decoders_1.constant(ConType.REFERENCE), decoders_1.constant(ConType.FOREIGN_KEY)),
    location: decoders_1.number,
    fk_upd_action: decoders_1.string,
    fk_del_action: decoders_1.string,
    fk_matchtype: decoders_1.string,
    initially_valid: decoders_1.boolean,
    pktable: decoders_1.exact({
        RangeVar: rangeVar_1.rangeVarDecoder
    }),
    pk_attrs: decoders_1.optional(tuple1_1.tuple1(constant_1.stringDecoder)),
    conname: decoders_1.unknown,
    fk_attrs: decoders_1.unknown
});
exports.CheckConstraintDecoder = decoders_1.exact({
    contype: decoders_1.constant(ConType.CHECK),
    conname: decoders_1.string,
    location: decoders_1.number,
    raw_expr: targetValue_1.targetValueDecoder,
    skip_validation: decoders_1.optional(decoders_1.boolean),
    initially_valid: decoders_1.optional(decoders_1.boolean)
});
exports.constraintDecoder = decoders_1.either6(exports.notNullConstraintDecoder, exports.defaultConstraintDecoder, exports.uniqueConstraintDecoder, exports.primaryKeyConstraintDecoder, exports.foreignKeyConstraint, exports.CheckConstraintDecoder);
function isPrimaryKey(constraints) {
    if (!constraints) {
        return false;
    }
    for (var _i = 0, constraints_1 = constraints; _i < constraints_1.length; _i++) {
        var constraint = constraints_1[_i];
        if (constraint.Constraint.contype === ConType.PRIMARY_KEY) {
            return true;
        }
    }
    return false;
}
exports.isPrimaryKey = isPrimaryKey;
function getReference(constraints) {
    var _a;
    if (!constraints) {
        return null;
    }
    for (var _i = 0, constraints_2 = constraints; _i < constraints_2.length; _i++) {
        var constraint = constraints_2[_i];
        if (constraint.Constraint.contype === ConType.REFERENCE) {
            var tablename = constraint.Constraint.pktable.RangeVar.relname;
            var colname = (_a = constraint.Constraint.pk_attrs) === null || _a === void 0 ? void 0 : _a[0].String.str;
            if (!colname) {
                throw new Error("Unsure of of reference");
            }
            return { tablename: tablename, colname: colname };
        }
    }
    return null;
}
exports.getReference = getReference;
function isNullable(constraints) {
    for (var _i = 0, constraints_3 = constraints; _i < constraints_3.length; _i++) {
        var constraint = constraints_3[_i];
        if (constraint.Constraint.contype === ConType.NOT_NULL) {
            return false;
        }
    }
    return true;
}
exports.isNullable = isNullable;
