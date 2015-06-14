(function () {
    "use strict";

    function Grid(size, count, element) {
        var blockSize = size,
            viewPort = size * count,
            c_canvas = element,
            context = c_canvas.getContext("2d");
        c_canvas.height = c_canvas.width = viewPort + blockSize * 2;
        this.render = function () {
            _.times(viewPort / blockSize, function (i) {
                var pos = i * blockSize + 0.5 + blockSize;
                context.moveTo(blockSize, pos);
                context.lineTo(viewPort, pos);
                context.moveTo(pos, blockSize);
                context.lineTo(pos, viewPort);
            });
            context.strokeStyle = "#000";
            context.stroke();
        };
    }

    function Snake(direction) {
        var movers = [
            function up () {

            }
        ];
        this.move = function () {
            movers[direction]();
        };

        this.turn = function (_direction) {
            direction = _direction;
        }
    }

})();