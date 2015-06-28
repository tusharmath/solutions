(function () {
    "use strict";
    var CELL_WIDTH = 20,
        LINE_WIDTH = 1,
        BLOCK_COLOR = '#F00',
        CELL_COUNT = 20,
        toXY = function (pos) {
            return {x: pos[0], y: pos[1]};
        },
        toCell = function (pos) {
            pos.x = (pos.x + 1) * CELL_WIDTH;
            pos.y = (pos.y + 1) * CELL_WIDTH;
            return pos;
        },
        randomDirection = function () {
            return ['L', 'R', 'U', 'D'][_.random(0, 3)];
        },
        normalizeStep = function (lastStep, currentStep) {
            var skipSteps = {
                L: 'R',
                R: 'L',
                U: 'D',
                D: 'U'
            };
            if (currentStep === skipSteps[lastStep]) {
                return lastStep;
            }
            return currentStep;
        },
        getStep = function (key) {
            return toXY({
                L: [-1, 0],
                R: [1, 0],
                U: [0, -1],
                D: [0, 1]
            }[key]);
        },
        normalizeNode = function (CELL_COUNT, node) {
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
        };

    var Views = (function (element) {
        var context = element.getContext("2d"),
            drawBlock = function (fillStyle, pos) {
                context.fillStyle = fillStyle;
                context.fillRect(pos.x + LINE_WIDTH, pos.y + LINE_WIDTH, CELL_WIDTH - LINE_WIDTH, CELL_WIDTH - LINE_WIDTH);
            };

        function GridView(grid) {
            var CELL_width = grid.cellWidth;
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
                _.each(_(snake.printSteps).map(toXY).map(toCell).value(), _drawBlock(BLOCK_COLOR));
                _drawBlock('#FFF')(toCell(toXY(snake.clearSteps)));
            };
        }

        return {GridView, SnakeView};
    })(document.getElementById('game'));

    (function (views, el) {
        function Grid(size, snake) {
            this.snake = snake;

        }

        function Snake(list) {
            this.printSteps = list;
            this.clearSteps = {};
            this.lastStep = null;
            this.move = function (step) {
                step = normalizeStep(this.lastStep, step);
                var last = _.last(list);
                this.clearSteps = list.shift();
                var _movements = getStep(step);
                var node = [last[0] + _movements.x, last[1] + _movements.y];
                normalizeNode(CELL_COUNT, node);
                list.push(node);
                this.lastStep = step;
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
        setInterval(onRequest, 200);
    })(Views);

})();
