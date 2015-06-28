(function () {
    "use strict";
    var CELL_WIDTH = 20,
        LINE_WIDTH = 1,
        GAME_SPEED = 100,
        BLOCK_COLOR = '#F00',
        GRID_SIZE = 20,
        getScore = function (len) {
            return (len - 1) * 100;
        },
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
            return [_.random(0, GRID_SIZE - 2), _.random(0, GRID_SIZE - 2)];
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
            return node;
        },
        drawBlock = function (context, fillStyle, _pos) {
            var pos = toCellPixelXY(_pos);
            context.fillStyle = fillStyle;
            context.fillRect(pos.x + LINE_WIDTH, pos.y + LINE_WIDTH, CELL_WIDTH - LINE_WIDTH, CELL_WIDTH - LINE_WIDTH);
        },
        drawGrid = function (context) {
            var viewPort = CELL_WIDTH * GRID_SIZE;
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
        },
        setText = function (context, text) {
            context.innerHTML = text;
        },
        create2dArray = function (size, start) {
            var mapRange = _.partial(_.map, _.times(size));
            return mapRange(_.partial(mapRange, _.constant(start)));
        },
        createSquareMap = function (size, start) {
            var map = create2dArray(size, start);
            return {
                set: function (item, val) {
                    var pos = toXY(item);
                    map[pos.x][pos.y] = val;
                },
                get: function (item) {
                    var pos = toXY(item);
                    return map[pos.x][pos.y];
                }
            }

        };

    (function (canvas, score) {
        var context = canvas.getContext("2d"),
            _drawBlock = _.partial(drawBlock, context),
            _drawGrid = _.partial(drawGrid, context),
            _setScore = _.partial(setText, score);
        var viewPort = CELL_WIDTH * GRID_SIZE;
        canvas.height = canvas.width = viewPort + CELL_WIDTH * 2;

        function Game() {
            this.direction = 'D';
            this.snake = [[0, 0]];
            this.apple = [0, 5];
            this.grid = createSquareMap(GRID_SIZE, 0);
            this._directionQueue = [];
            this.colorRed = _.partial(_drawBlock, '#F00');
            this.colorBlue = _.partial(_drawBlock, '#00F');
            this.colorWhite = _.partial(_drawBlock, '#FFF');

            //Start
            _drawGrid();
            this.grid.set(this.snake[0], 1);
            this.colorRed(this.snake[0]);
            this.colorBlue(this.apple);
        }

        Game.prototype.move = function () {

            this.direction = normalizeDirection(this.direction, this._directionQueue.pop());
            var last = _.last(this.snake),
                step = getStep(this.direction),
                node = normalizeNode(GRID_SIZE, [last[0] + step.x, last[1] + step.y]),
                tail = this.snake.shift();
            if (this.grid.get(node) === 1) {
                clearInterval(timer);
                return _setScore('GAME OVER: ' + getScore(this.snake.length));
            }

            this.snake.push(node);
            this.colorRed(node);
            this.grid.set(node, 1);
            this.grid.set(tail, 0);

            //Screen Color;
            if (cellEqual(this.apple, tail)) {
                this.snake.unshift(tail);
                this.apple = randomCell();
                this.colorBlue(this.apple);
            } else {
                this.colorWhite(tail);
            }
            _setScore(getScore(this.snake.length));
        };

        Game.prototype.pushDirection = function (direction) {
            if (direction) {
                this._directionQueue.push(direction);
            }
        };

        var g = new Game();

        var timer = setInterval(g.move.bind(g), GAME_SPEED);
        document.addEventListener('keydown', _.partial(_.flowRight(g.pushDirection.bind(g), keyCodeToDirection, _.partialRight(_.get, 'keyCode'))));
    })(document.getElementById('game'), document.getElementById('score'));

})();
