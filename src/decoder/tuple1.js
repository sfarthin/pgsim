"use strict";
exports.__esModule = true;
exports.tuple2 = exports.tuple1 = void 0;
var decoders_1 = require("decoders");
var Result_1 = require("lemons/Result");
var debrief_1 = require("debrief");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
var ntuple = function (n) {
    return decoders_1.compose(decoders_1.poja, decoders_1.predicate(function (arr) { return arr.length === n; }, "Must be a " + n + "-tuple"));
};
// Should be in future build: https://github.com/nvie/decoders/pull/488
function tuple1(decoder1) {
    return decoders_1.compose(ntuple(1), function (blobs) {
        var blob1 = blobs[0];
        var result1 = decoder1(blob1);
        try {
            return Result_1.Ok([result1.unwrap()]);
        }
        catch (e) {
            // If a decoder error has happened while unwrapping all the
            // results, try to construct a good error message
            return Result_1.Err(debrief_1.annotate([result1.isErr() ? result1.errValue() : result1.value()], ""));
        }
    });
}
exports.tuple1 = tuple1;
function tuple2(decoder1) {
    return decoders_1.compose(ntuple(2), function (blobs) {
        var blob1 = blobs[0], blob2 = blobs[1];
        var result1 = decoder1(blob1);
        var result2 = decoder1(blob2);
        try {
            return Result_1.Ok([result1.unwrap(), result2.unwrap()]);
        }
        catch (e) {
            // If a decoder error has happened while unwrapping all the
            // results, try to construct a good error message
            return Result_1.Err(debrief_1.annotate([result1.isErr() ? result1.errValue() : result1.value()], ""));
        }
    });
}
exports.tuple2 = tuple2;
