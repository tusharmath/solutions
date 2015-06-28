(function () {
    "use strict";
    var CELL_WIDTH = 20,
        LINE_WIDTH = 1,
        BLOCK_COLOR = '#F00',
        CELL_COUNT = 20,
        toXY = function (pos) {
            return {x: pos[0], y: pos[1]};
        },
        toCellPixel = function (pos) {
            pos.x = (pos.x + 1) * CELL_WIDTH;
            pos.y = (pos.y + 1) * CELL_WIDTH;
            return pos;
        },
        toCellPixelXY = _.flowRight(toCellPixel, toXY),
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
            drawBlock = function (fillStyle, _pos) {
                var pos = toCellPixelXY(_pos);
                context.fillStyle = fillStyle;
                context.fillRect(pos.x + LINE_WIDTH, pos.y + LINE_WIDTH, CELL_WIDTH - LINE_WIDTH, CELL_WIDTH - LINE_WIDTH);
            };

        function GridView(grid) {
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

            this.colorCell = drawBlock;
        }

        return {GridView};
    })(document.getElementById('game'));

    (function (views, el) {

        function Game(view) {
            this.view = view;
            this.lastStep = null;
            this.snake = [[0, 0]];
            this.colorRed = _.partial(this.view.colorCell, '#F00');
            this.colorBlue = _.partial(this.view.colorCell, '#00F');
            this.colorWhite = _.partial(this.view.colorCell, '#FFF');

            //Start
            this.view.render();
            this.colorRed(this.snake[0]);
        }

        Game.prototype.move = function (step) {
            this.lastStep = step = normalizeStep(this.lastStep, step);
            var last = _.last(this.snake);
            var _movements = getStep(step);
            var node = [last[0] + _movements.x, last[1] + _movements.y];

            normalizeNode(CELL_COUNT, node);
            this.snake.push(node);

            //Screen Color;
            this.colorRed(node);
            this.colorWhite(this.snake.shift());
        };

        var gv = new views.GridView();
        var g = new Game(gv);

        var move = function (direction) {
            g.move(direction);
        };

        var onRequest = function () {
            move(randomDirection());
        };
        setInterval(onRequest, 500);
    })(Views);

})();
