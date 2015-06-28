var randomDirection = function () {
    return ['L', 'R', 'U', 'D'][_.random(0, 3)];
};
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

        function GridView(grid) {
            var CELL_width = grid.cellWidth
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
        function Grid(size, snake) {
            this.snake = snake;

        }

        function Snake(list) {
            var movements = {
                L: [-1, 0],
                R: [1, 0],
                U: [0, -1],
                D: [0, 1]
            };
            var ignoredMovements = {
                L: 'R',
                R: 'L',
                U: 'D',
                D: 'U'
            };
            this.print = list;
            this.clear = {};
            this.lastDirection = null;

            this.move = function (key) {
                if (key === ignoredMovements[this.lastDirection]) {
                    key = this.lastDirection;
                }
                this.lastDirection = key;
                var last = _.last(list);
                this.clear = list.shift();
                var node = [last[0] + movements[key][0], last[1] + movements[key][1]];
                var MAX_X = CELL_COUNT - 1,
                    MAX_Y = CELL_COUNT - 2;
                if (node[1] >= MAX_X) {
                    node[1] = 0;
                }
                if (node[1] < 0) {
                    node[1] = MAX_Y;
                }

                if (node[0] >= MAX_X) {
                    node[0] = 0;
                }

                if (node[0] < 0) {
                    node[0] = MAX_Y;
                }

                console.log(_.find(list, node));
                list.push(node);
            }.bind(this);
        }

        var s = new Snake([
            [0, 1],
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [2, 4]
        ]);
        var g = new Grid(CELL_COUNT, s)
        var gv = new views.GridView(g);
        var sv = new views.SnakeView(s);
        gv.render();
        sv.render();
        var move = function (direction) {
            s.move(direction);
            sv.render();
        };

        var onRequest = function () {
            move(randomDirection());
        };
        setInterval(onRequest, 1000);
    })(Views);

})();