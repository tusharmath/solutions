var Views = (function (element) {
    "use strict";
    var context = element.getContext("2d"),
        cellSize = 20,
        cellCount = 20,
        toXY = function (pos) {
            return {
                x: (pos[0] + 1 ) * cellSize,
                y: (pos[1] + 1) * cellSize
            };
        },
        drawBlock = function (pos) {
            context.fillStyle = "#F00";
            context.fillRect(pos.x, pos.y, cellSize, cellSize);
        };

    function GridView() {
        var viewPort = cellSize * cellCount;
        element.height = element.width = viewPort + cellSize * 2;
        this.render = function () {
            _.times(viewPort / cellSize, function (i) {
                var pos = i * cellSize + 0.5 + cellSize;
                context.moveTo(cellSize, pos);
                context.lineTo(viewPort, pos);
                context.moveTo(pos, cellSize);
                context.lineTo(pos, viewPort);
            });
            context.strokeStyle = "#cef";
            context.stroke();
        };
    }

    function SnakeView(snake) {
        this.render = function () {
            var positions = _.map(snake, toXY);
            _.each(positions, drawBlock);
        };
    }

    return {GridView, SnakeView};
})(document.getElementById('game'));

(function (views, el) {
    "use strict";
    function Snake(direction) {
        var movers = [
            function up() {

            }
        ];
        this.move = function () {
            movers[direction]();
        };

        this.turn = function (_direction) {
            direction = _direction;
        }
    }

    var g = new views.GridView();
    var s = new views.SnakeView([
        [0, 1],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 4]
    ]);
    g.render();
    s.render();

})(Views);