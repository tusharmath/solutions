var Grid = (function () {
    "use strict";
    var timesFill = function (count, filler) {
        return _.map(_.times(count), filler);
    };
    var zero = _.constant(0);

    function Grid(size) {

        this._mat = timesFill(size, function () {
            return timesFill(size, zero);
        });
        this.size = size;
    }

    Grid.prototype.applyCell = function (x, y) {

    };
    return Grid;
})();


new Grid(10)