'use strict';

const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';

const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';
const GLUE_IMG = '<img src="img/glue.png">';

var gGamerPos;
var gBoard;
var gIsAlowedToMove;
var gIsPaused;
var gIsStack;
var gGluesIdxs;

var gIntervalAddBalls;
var gIntervalAddGlues;

var gFullCellCount;
var gBallsCount;
var gBallsCollectedCount;

var gEatAudio;
var gGlueAudio;

function init() {
    gEatAudio = new Audio('sound/yummy.mp3');
    gEatAudio.playbackRate = 1.2;
    gGlueAudio = new Audio('sound/Squish.mp3');
    gGluesIdxs = [];
    gFullCellCount = 0;
    arrangeBoard();
}

function handleGame() {
    var elBtn = document.querySelector('.start');
    var btnTxt = elBtn.innerHTML;
    switch (btnTxt) {
        case 'Start Game':
            startGame(elBtn);
            break;
        case 'Play Again':
            gFullCellCount = 0;
            arrangeBoard();
            startGame(elBtn);
            break;
        case '▶':
            continueGame(elBtn);
            break;
        default:
            pauseGame(elBtn);
    }
}

function startGame(elBtn) {

    // shows pause button
    elBtn.innerHTML = '&#10074;&#10074;';

    // show balls collected
    renderBallsCollected(`You have collected 0 balls`);

    // init variables
    gIsAlowedToMove = true;
    gBallsCount = 0;
    gBallsCollectedCount = 0;

    gIsPaused = false;
    gIsStack = false;

    // start adding balls and glue
    addBalls();
    addGlue();
}

function continueGame(elBtn) {
    elBtn.innerHTML = '&#10074;&#10074;';
    addBalls();
    addGlue();

    // if the player isn't stuck on glue
    if (!gIsStack) {
        gIsAlowedToMove = true;
    }

    // if there is glue on board - hide it
    if (gGluesIdxs.length > 0) {
        hideGlue(gGluesIdxs);
    }
    gIsPaused = false;
}

function pauseGame(elBtn) {
    elBtn.innerHTML = '▶';
    clearInterval(gIntervalAddBalls);
    clearInterval(gIntervalAddGlues);
    gIsAlowedToMove = false;
    gIsPaused = true;
}

// build board and add passages
function arrangeBoard() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    addPassages(generateNum(1, 3));
}

function buildBoard() {
    // Create the Matrix
    var board = new Array(10);
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(12);
    }

    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: FLOOR, gameElement: null };
            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }
            board[i][j] = cell;
        }
    }

    // Place the gamer
    gGamerPos = { i: 4, j: 6 };
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place a ball
    // board[3][8].gameElement = BALL;
    // board[7][4].gameElement = BALL;
    gBallsCount++;

    console.log(board);
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

            if (currCell.gameElement === GAMER) {
                strHTML += '\t' + GAMER_IMG + '\n';
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    console.log('strHTML is:');
    console.log(strHTML);
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

    if (gIsAlowedToMove) {
        var targetCell = gBoard[i][j];
        if (targetCell.type === WALL) return;

        // Calculate distance to make sure we are moving to a neighbor cell
        var iAbsDiff = Math.abs(i - gGamerPos.i);
        var jAbsDiff = Math.abs(j - gGamerPos.j);

        // If the clicked Cell is allowed
        if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) ||
            (iAbsDiff === gBoard.length - 1 && jAbsDiff === 0) || (jAbsDiff === gBoard[0].length - 1 && iAbsDiff === 0)) {

            // eating ball
            if (targetCell.gameElement === BALL) {
                eatBall();
                // stuck on glue
            } else if (targetCell.gameElement === GLUE) {
                stuckOnGlue();
            }

            // MOVING
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
            renderCell(gGamerPos, '');

            gGamerPos.i = i;
            gGamerPos.j = j;

            gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
            renderCell(gGamerPos, GAMER_IMG);

        }
    }
}

// Move the player by keyboard arrows
function handleKey(event) {
    var i = gGamerPos.i;
    var j = gGamerPos.j;

    switch (event.key) {
        case 'ArrowLeft':
            if (j === 0) moveTo(i, gBoard[0].length - 1);
            else moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            if (j === gBoard[0].length - 1) moveTo(i, 0);
            else moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            if (i === 0) moveTo(gBoard.length - 1, j);
            else moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            if (i === gBoard.length - 1) moveTo(0, j);
            else moveTo(i + 1, j);
            break;
    }
}

// when eating a ball
function eatBall() {
    console.log('Collecting!');
    gEatAudio.play();
    gBallsCollectedCount++;
    gFullCellCount--;

    // shows correct ball collected message
    if (gBallsCollectedCount === gBallsCount) {
        var strBallsCollected = `Well done! You have collected all balls!`;
        finishGame();
    } else if (gBallsCount === 1) {
        var strBallsCollected = `You have collected 1 ball`;
    } else {
        var strBallsCollected = `You have collected ${gBallsCollectedCount} balls`;
    }
    renderBallsCollected(strBallsCollected);
}

// when steping on glue
function stuckOnGlue() {
    console.log('shit');
    gGlueAudio.play();
    gFullCellCount--;
    gIsStack = true;
    // handle moving - can move again after 3 seconds
    gIsAlowedToMove = false;
    setTimeout(function () {
        // if the game isn't paused
        if (!gIsPaused) {
            gIsAlowedToMove = true;
        }
        gIsStack = false;
    }, 3000);
}

function addBalls() {
    // adds ball every 2 seconds
    gIntervalAddBalls = setInterval(function () {
        // if the board is not full
        if (!isBoardFull()) {
            var randIdx = getRandomIndex();
            gBoard[randIdx.i][randIdx.j].gameElement = BALL;

            renderCell(randIdx, BALL_IMG);

            gBallsCount++;
            gFullCellCount++;
        }
    }, 2000);
}

function addGlue() {
    // adds glue every 2 seconds
    gIntervalAddGlues = setInterval(function () {
        
        // if the board is not full
        if (!isBoardFull()) {
            var randIdx = getRandomIndex();
            
            // update model
            gBoard[randIdx.i][randIdx.j].gameElement = GLUE;
            
            // update dom
            renderCell(randIdx, GLUE_IMG);

            gFullCellCount++;

            // hide glue after 3 seconds
            setTimeout(function () {
                // if hasn't allready been eaten
                if (gBoard[randIdx.i][randIdx.j].gameElement === GLUE) {
                    // add glue to the array of glues on board
                    gGluesIdxs.push(randIdx);
                    // if the game is not paused
                    if (!gIsPaused) {
                        // hide the glue
                        hideGlue(gGluesIdxs);
                    }
                }
            }, 3000);
        }
    }, 2000);
}

function hideGlue(glueIdxs) {
    // for all glues on board
    for (var i = glueIdxs.length - 1; i >= 0; i--) {
        var glueIdx = glueIdxs[i];

        //  hide glue
        gBoard[glueIdx.i][glueIdx.j].gameElement = null;
        renderCell(glueIdx, '');
        gFullCellCount--;

        // take it off the array
        glueIdxs.pop();
    }
}
function addPassages(passagesCount) {
    for (var i = 1; i <= passagesCount; i++) {

        // if even num of passage - add top passage
        if (i % 2 === 0) {
            var randJ = generateNum(1, gBoard[0].length - 2);

            // update model
            gBoard[0][randJ].type = FLOOR;
            gBoard[gBoard.length - 1][randJ].type = FLOOR;

            // update dom
            renderFloorCell({ i: 0, j: randJ });
            renderFloorCell({ i: gBoard.length - 1, j: randJ });

            // add right passage
        } else {
            var randI = generateNum(1, gBoard.length - 2);

            // update model
            gBoard[randI][0].type = FLOOR;
            gBoard[randI][gBoard[0].length - 1].type = FLOOR;

            // update dom
            renderFloorCell({ i: randI, j: 0 });
            renderFloorCell({ i: randI, j: gBoard[0].length - 1 });
        }
    }
    gFullCellCount -= passagesCount * 2;
}

function finishGame() {
    clearInterval(gIntervalAddBalls);
    clearInterval(gIntervalAddGlues);
    gIsAlowedToMove = false;

    // clears board (except gamer)
    clearBoard();

    // shows restart button
    var elBtn = document.querySelector('.start');
    elBtn.innerText = 'Play Again';
    elBtn.style.display = 'inline-block';
}

// clears board of elements
function clearBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameElement !== null) {

                // update model
                gBoard[i][j].gameElement = null;

                // update dom
                renderCell({ i: i, j: j }, '');
            }
        }
    }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var elCell = getCell(location);
    elCell.innerHTML = value;
}

// change wall cell into floor cell
function renderFloorCell(location) {
    var elCell = getCell(location);
    elCell.classList.remove('wall');
    elCell.classList.add('floor');
}

// get cell element by location
function getCell(location) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    return elCell;
}

// render ball collected message
function renderBallsCollected(str) {
    var elBallsCollected = document.querySelector('.balls-collected');
    elBallsCollected.innerText = str;
}

// checks if board is full of elements
function isBoardFull() {
    return (gFullCellCount === (gBoard.length - 2) * (gBoard[0].length - 2) - 1);
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// gets random cell on board
function getRandomIndex() {
    var randI = generateNum(0, gBoard.length - 1);
    var randJ = generateNum(0, gBoard[0].length - 1);

    // if not an empty cell - draws again
    while (gBoard[randI][randJ].type != FLOOR || gBoard[randI][randJ].gameElement != null) {
        randI = generateNum(0, gBoard.length - 1);
        randJ = generateNum(0, gBoard[0].length - 1);
    }

    return { i: randI, j: randJ };
}

// generates a random number between params min and max
function generateNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}