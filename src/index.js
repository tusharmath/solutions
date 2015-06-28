(function () {
    "use strict";
    var CELL_WIDTH = 20,
        LINE_WIDTH = 1,
        GAME_SPEED = 100,
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
        randomCell = function () {
            return [_.random(0, CELL_COUNT - 2), _.random(0, CELL_COUNT - 2)];
        },
        cellEqual = function (a, b) {
            return a[0] === b[0] && a[1] == b[1];
        },
        keyCodeToDirection = function (val) {
            return ['L', 'U', 'R', 'D'][val - 37];
        },
        normalizeDirection = function (lastStep, currentStep) {
            if (!currentStep) {
                return lastStep;
            }
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
        },
        drawBlock = function (context, fillStyle, _pos) {
            var pos = toCellPixelXY(_pos);
            context.fillStyle = fillStyle;
            context.fillRect(pos.x + LINE_WIDTH, pos.y + LINE_WIDTH, CELL_WIDTH - LINE_WIDTH, CELL_WIDTH - LINE_WIDTH);
        },
        drawGrid = function (context) {
            var viewPort = CELL_WIDTH * CELL_COUNT;
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

    //var Views = (function (element) {
    //    var context = element.getContext("2d"),
    //        _drawBlock = _.partial(drawBlock, context);
    //
    //    function GridView(grid) {
    //        var viewPort = CELL_WIDTH * CELL_COUNT;
    //        element.height = element.width = viewPort + CELL_WIDTH * 2;
    //        this.render = _.partial(drawGrid, context);
    //        this.colorCell = _drawBlock;
    //    }
    //
    //    return {GridView};
    //})(document.getElementById('game'));

    (function (element) {
        var context = element.getContext("2d"),
            _drawBlock = _.partial(drawBlock, context),
            _drawGrid = _.partial(drawGrid, context);
        var viewPort = CELL_WIDTH * CELL_COUNT;
        element.height = element.width = viewPort + CELL_WIDTH * 2;

        function Game() {
            this.direction = 'D';
            this.snake = [[0, 0]];
            this.apple = [0, 5];
            this._directionQueue = [];
            this.colorRed = _.partial(_drawBlock, '#F00');
            this.colorBlue = _.partial(_drawBlock, '#00F');
            this.colorWhite = _.partial(_drawBlock, '#FFF');

            //Start
            _drawGrid();
            this.colorRed(this.snake[0]);
            this.colorBlue(this.apple);
        }

        Game.prototype.move = function () {

            this.direction = normalizeDirection(this.direction, this._directionQueue.pop());
            var last = _.last(this.snake);
            var step = getStep(this.direction);
            var node = [last[0] + step.x, last[1] + step.y];

            normalizeNode(CELL_COUNT, node);
            this.snake.push(node);

            //Screen Color;
            this.colorRed(node);
            var tail = this.snake.shift();
            if (cellEqual(this.apple, tail)) {
                this.snake.unshift(tail);
                this.apple = randomCell();
                this.colorBlue(this.apple);
            } else {
                this.colorWhite(tail);
            }
        };

        Game.prototype.pushDirection = function (direction) {
            if (direction) {
                this._directionQueue.push(direction);
            }
        };

        var g = new Game();

        setInterval(g.move.bind(g), GAME_SPEED);
        document.addEventListener('keydown', _.partial(_.flowRight(g.pushDirection.bind(g), keyCodeToDirection, _.partialRight(_.get, 'keyCode'))));
    })(document.getElementById('game'));

})();
