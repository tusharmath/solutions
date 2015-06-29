(function (canvas, score) {
    "use strict";
    var CELL_WIDTH = 20,
        LINE_WIDTH = 1,
        GAME_SPEED = 100,
        BLOCK_COLOR = '#F00',
        GRID_SIZE = 20,
        MAX_CELL = (GRID_SIZE - 2),
        context = canvas.getContext("2d"),
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
            return [_.random(0, MAX_CELL), _.random(0, MAX_CELL)];
        },
        randomCell2 = _.partial(_.times, 2, randomCell),
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
            return ({
                L: [-1, 0],
                R: [1, 0],
                U: [0, -1],
                D: [0, 1]
            }[key]);
        },
        normalizeStep = function (CELL_COUNT, node) {
            if (node[1] > MAX_CELL) {
                node[1] = 0;
            }
            if (node[1] < 0) {
                node[1] = MAX_CELL;
            }

            if (node[0] > MAX_CELL) {
                node[0] = 0;
            }

            if (node[0] < 0) {
                node[0] = MAX_CELL;
            }
            return node;
        },
        drawBlock = function (context, fillStyle, block) {
            var pos = toCellPixelXY(block);
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

        },
        gameEnded = function (_collisionMatrix, node) {
            return _collisionMatrix.get(node) === 1;
        },
        _drawBlock = _.partial(drawBlock, context),
        _drawGrid = _.partial(drawGrid, context),
        _setScore = _.partial(setText, score),
        _colorSnake = _.partial(_drawBlock, '#F00'),
        _colorWormhole = _.partialRight(_.each, _.partial(_drawBlock, '#000')),
        _colorApple = _.partial(_drawBlock, '#00F'),
        _colorEmptiness = _.partial(_drawBlock, '#FFF'),
        _moveThrottle = _.partialRight(setInterval, GAME_SPEED);

    canvas.height = canvas.width = CELL_WIDTH * GRID_SIZE + CELL_WIDTH * 2;

    function Game() {
        var _stopThrottle,
            _previousDirection = randomDirection(),
            snake = [randomCell()],
            apple = randomCell(),
            wormhole = randomCell2(),
            _nextDirection = null,
            _snakeBodyMatrix = createSquareMap(GRID_SIZE, 0),
            _gameEnded = _.partial(gameEnded, _snakeBodyMatrix),
            _isOnApple = function (cell) {
                return cellEqual(apple, cell);
            },
            _isOnWormhole = function (cell) {
                return _.find(wormhole, _.partial(cellEqual, cell));
            }
            ;

        //Start

        _snakeBodyMatrix.set(snake[0], 'S');

        _colorSnake(snake[0]);
        _colorApple(apple);
        _colorWormhole(wormhole);
        this.move = function () {
            _previousDirection = normalizeDirection(_previousDirection, _nextDirection);
            var last = _.last(snake),
                step = getStep(_previousDirection),
                step = normalizeStep(GRID_SIZE, [last[0] + step[0], last[1] + step[1]]),
                tail = snake.shift();
            if (_gameEnded(step)) {
                _stopThrottle();
                _setScore('GAME OVER: ' + getScore(snake.length));
            } else {
                snake.push(step);
                _colorSnake(step);
                _snakeBodyMatrix.set(step, 1);
                _snakeBodyMatrix.set(tail, 0);

                _colorEmptiness(tail);
                //onApple(snake, apple, tail);

                if (_isOnApple(tail)) {
                    snake.unshift(tail);
                    apple = randomCell();
                    _colorApple(apple);
                } else if (_isOnWormhole(step)) {
                    var exit = cellEqual(step, wormhole[1]) ? wormhole[0] : wormhole[1];
                    snake.push(exit);
                    var removed = snake.shift();
                    _snakeBodyMatrix.set(removed, 0);
                    wormhole = randomCell2();
                    _colorWormhole(wormhole);
                    _colorEmptiness(removed);
                }

                _setScore(getScore(snake.length));
            }

        }.bind(this);

        this.setDirection = function (direction) {
            if (direction) {
                _nextDirection = direction;
            }
        }.bind(this);

        _stopThrottle = _.partial(clearInterval, _moveThrottle(this.move));
    }

    var g = new Game();
    _drawGrid();
    document.addEventListener('keydown', _.partial(_.flowRight(g.setDirection, keyCodeToDirection, _.partialRight(_.get, 'keyCode'))));

})(document.getElementById('game'), document.getElementById('score'));
