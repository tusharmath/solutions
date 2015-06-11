"use strict";
var index = 0;
var input = [
    2, 3, 10, 2, 4, 8, 1
    //3, 2, 13, 11, 7, 9, 5, 6, 1, 2, 17
];

var min = input[0], maxDiff = input[1] - input[0];

for (var i = 1; i < input.length; i++) {
    var ith = input[i];

    var diff = ith - min;
    if (diff > maxDiff) {
        maxDiff = diff;
    }
    if (ith < min) {
        min = ith;
    }

    console.log(min, ith, maxDiff);
}

return maxDiff;

