(function () {
    "use strict";

    var CELL_WIDTH = 20,
        LINE_WIDTH = 1,
        BLOCK_COLOR = '#F00',
        CELL_COUNT = 20,
        toXY = function (pos) {
            return {
                x: (pos[0] + 1 ) * CELL_WIDTH,
                y: (pos[1] + 1) * CELL_WIDTH
            };
        },
        lastXY = _.flowRight(toXY, _.last);

    var Views = (function (element) {
        var context = element.getContext("2d"),
            drawBlock = function (fillStyle, pos) {
                context.fillStyle = fillStyle;
                context.fillRect(pos.x + LINE_WIDTH, pos.y + LINE_WIDTH, CELL_WIDTH - LINE_WIDTH, CELL_WIDTH - LINE_WIDTH);
            };

        function GridView() {
            var viewPort = CELL_WIDTH * CELL_COUNT;
            element.height = element.width = viewPort + CELL_WIDTH * 2;
            this.render = function () {
                _.times(viewPort / CELL_WIDTH, function (i) {
                    var pos = i * CELL_WIDTH + 0.5 + CELL_WIDTH;
                    context.moveTo(CELL_WIDTH, pos);
                    context.lineTo(viewPort, pos);
                    context.moveTo(pos, CELL_WIDTH);
                    context.lineTo(pos, viewPort);
                });
                context.strokeStyle = BLOCK_COLOR;
                context.lineWidth = LINE_WIDTH;
                context.stroke();
            };
        }

        function SnakeView(snake) {
            var _drawBlock = _.curry(drawBlock);
            this.render = function () {

                _.each(_.map(snake.print, toXY), _drawBlock(BLOCK_COLOR));
                _drawBlock('#FFF')(toXY(snake.clear));
            };
        }

        return {GridView, SnakeView};
    })(document.getElementById('game'));

    (function (views, el) {
        function Snake(list) {
            this.print = list;
            this.clear = {};
            this.right = function () {
                var last = _.last(list);
                this.clear = list.shift();
                var node = [last[0] + 1, last[1]];
                if (node[0] >= CELL_COUNT - 1) {
                    node[0] = 0;
                }
                list.push(node);
            }.bind(this);
        }

        var snake = new Snake([
            [0, 1],
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [2, 4]
        ]);
        var g = new views.GridView();
        var s = new views.SnakeView(snake);
        g.render();
        s.render();
        setInterval(function () {
            snake.right();
            s.render();
        }, 100);
    })(Views);

})();