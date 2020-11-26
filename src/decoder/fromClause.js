"use strict";
exports.__esModule = true;
exports.verifyFromClause = exports.fromClauseDecoder = exports.rangeSubselectDecoder = void 0;
var decoders_1 = require("decoders");
var joinExpr_1 = require("./joinExpr");
var alias_1 = require("./alias");
var rangeVar_1 = require("./rangeVar");
exports.rangeSubselectDecoder = decoders_1.exact({
    subquery: decoders_1.unknown,
    alias: decoders_1.exact({ Alias: alias_1.aliasDecoder }),
    lateral: decoders_1.optional(decoders_1.boolean)
});
exports.fromClauseDecoder = decoders_1.either4(decoders_1.exact({ JoinExpr: joinExpr_1.joinExprDecoder }), decoders_1.exact({ RangeVar: rangeVar_1.rangeVarDecoder }), decoders_1.exact({ RangeSubselect: exports.rangeSubselectDecoder }), // nested queries
decoders_1.exact({ RangeFunction: decoders_1.unknown }) // select * from generate_series(-5, 5) t(i)
);
exports.verifyFromClause = decoders_1.guard(exports.fromClauseDecoder);
