'use strict';

// CR - Very nice and clean. Nice modulation. Thorough commenting. Nice CSS work. Great job!!!


// functions list: 
// initGame() - This is called when page loads
// setLevel(gLevelsIndex) - sets level of the game
// startGame() - starts a new game
// buildBoard() - Builds the board 
// setMines(board, cellI, cellJ) - called on first click.
//                                 setting mines at random locations except cell clicked
//                                 and then calling the setMinesNegsCount() 
//                                 Then return the created board
// setMinesNegsCount(board, mineIdx) - Sets mines-count to neighbours of the mine
// renderBoard(board) - Prints the board as a <table> to the page
// renderHeader() - renders the mines-count, smily and record
// renderMinesCount(minesCount) - renders the count of cell suspected as mines (flagged placed)
// checkGameOver() - Game ends when all mines are marked 
//                   and all the other cells are shown
// endGame(isWin) - handles end of game if win or lose
// checkRecord(time, level) - checks if game time better than level record
// renderTime(time) - shows current time
// activateHover(ev) - if left cell is clicked - activates hover effect on cells
// removeActivateHover - removes hover effect when mouse is up

// globals list:
// gBoard - Matrix contains cell objects: 
//          { minesAroundCount: 4, isShown: true, 
//            isMine: false, isMarked: true, }
// gLevels - array of possible game levels objects: 
//          {LEVEL: level name, SIZE: board size, MINES: mines to put}
// gLevel - current level of the game
// gState - { isGameOn: boolean, when true we let the user play, 
//            shownCount: how many cells are shown,
//            minesMarkedCount: how many mines are marked (with a flag), 
//            secsPassed: how many seconds passed }
// gMines - array of mines indexes
// gFlags - array of flags indexes
// gIsFirst - boolean, true on start game, false after first click
// gTimeInterval - interval of seconds passed in the game

// CR - using gFlags and gMines seems to offer a very slight optimization when game is lost,
// CR... but I'm not sure it does throughout the game. Nice way of thinking anyway.

var gBoard;
var gLevels;
var gLevel;
var gState;
var gMines;
var gFlags;
var gIsFirst;

var gTimeInterval;

// CR - Great. Could have extended it through to 8, though.
const COLOR_BY_COUNT = {
    1: "blue",
    2: "green",
    3: "red"
};

const MINE_IMG = '<img class="img-mine" src="img/mine.png"/>';
const FLAG_IMG = '<img class="img-flag" src="img/flag.png"/>';
const PLAY_SMILY = '<img src="img/play-smily.png"/>';
const WIN_SMILY = '<img src="img/win-smily.png"/>';
const LOSE_SMILY = '<img src="img/lose-smily.png"/>';

function init() {
    gLevels = [{ LEVEL: 'Begginer', SIZE: 4, MINES: 2 },
    { LEVEL: 'Medium', SIZE: 6, MINES: 5 },
    { LEVEL: 'Expert', SIZE: 8, MINES: 15 }];

    // sets records on local storage if don't exist
    for (var i = 0; i < gLevels.length; i++) {
        var key = gLevels[i].LEVEL + " record";
        if (!localStorage[key]) {
            localStorage[key] = Infinity;
        }
    }

    // begins with begginer level
    setLevel(0);
}

// sets level for the game
function setLevel(gLevelsIndex) {
    gLevel = gLevels[gLevelsIndex];
    // starts new game
    startGame();
}

function startGame() {

    // resets variables
    gIsFirst = true;
    gFlags = [];

    gState = {
        isGameOn: true,
        shownCount: 0,
        minesMarkedCount: 0,
        secsPassed: 0
    };

    // builds board and render game
    gBoard = buildBoard();
    renderBoard(gBoard);
    renderHeader();

    // if there is time interval - clears it
    if (gTimeInterval) {
        clearInterval(gTimeInterval);
        renderTime(0);
    }
}

// builds the model with no mines yet
function buildBoard() {
    var SIZE = gLevel.SIZE;
    var board = [];

    // creates board
    for (var i = 0; i < SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isToCheck: true
            };
        }
    }

    return board;
}

// places mines
function setMines(board, cellI, cellJ) {
    var SIZE = gLevel.SIZE;
    gMines = [];

    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomIndex(SIZE);

        // if allready a mine or current cell - generates another index
        while (board[randIdx.i][randIdx.j].isMine || (cellI === randIdx.i && cellJ === randIdx.j)) {
            randIdx = getRandomIndex(SIZE);
        }

        board[randIdx.i][randIdx.j].isMine = true;

        // updates mines array
        gMines.push(randIdx);

        // updates neigbors of current mine and get the new board
        board = setMinesNegsCount(board, randIdx);
    }

    return board;
}

// CR - Different approach than what we expect, but works just as well. Good.
// sets minesAroundCount of all neighbors to +1
function setMinesNegsCount(board, mineIdx) {
    var mineI = mineIdx.i;
    var mineJ = mineIdx.j;

    for (var i = mineI - 1; i <= mineI + 1; i++) {
        // if legal index
        if (i >= 0 && i < board.length) {
            for (var j = mineJ - 1; j <= mineJ + 1; j++) {
                // if not self and legal index
                if ((i !== mineI || j !== mineJ) && j >= 0 && j < board.length) {
                    board[i][j].minesAroundCount++;
                }
            }
        }
    }

    return board;
}

// shows board
function renderBoard(board) {
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]; // CR - cell is not being used
            var className = `cell-${i}-${j}`;
            strHtml += `<td class="cell ${className} covered unflagged" 
                        onmousedown="activateHover(event)"
                        onmouseup="cellClicked(this, event)">
                            <span class="container">
                                <span class="wrong"></span>
                                <span class="content"></span>
                            </span>
                        </td>\n`;
        }
        strHtml += '</tr>\n';
    }

    // updates dom
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function renderHeader() {
    // shows record
    var elRecord = document.querySelector('.record');
    var record = localStorage.getItem(gLevel.LEVEL + " record");
    if (record === "Infinity") record = '--';
    elRecord.innerHTML = record;

    // shows smily
    var elSmily = document.querySelector('.play-again-smily');
    elSmily.innerHTML = PLAY_SMILY;

    // shows mines counter
    renderMinesCount(gLevel.MINES);
}

// CR - I imagine thought about using the getStrTime function for this as well, as 
// CR... you did add the digitsToShowCount parameter to that function. That is a good thought.
// CR... It seems like for 2 digits it would have worked too, even for negative numbers.
// CR... Of course the name of that function would need to change to getStrNum or something of the sort.
// shows mines counter
function renderMinesCount(minesCount) {
    var elMinesCount = document.querySelector('.mines-count');
    var strMinesCount = '';

    // 1 - 9: - add 0
    if (minesCount < 10 && minesCount >= 0) strMinesCount += '0';
    strMinesCount += minesCount;
    elMinesCount.innerHTML = strMinesCount;
}

// called when cell revealed or marked with flag
function checkGameOver() {
    // game is over if all mines are marked and all cells are shown
    var minesCount = gLevel.MINES;
    if (gState.minesMarkedCount == minesCount &&
        gState.shownCount === gLevel.SIZE ** 2 - minesCount) {
        endGame(true);
    }
}

// handles game end if win or lose
function endGame(isWin) {

    // if win
    if (isWin) {
        console.log('WIN');
        var strHtml = WIN_SMILY;
        // checks record
        checkRecord(gState.secsPassed, gLevel);
        // if lose
    } else {
        console.log('LOSE');
        var strHtml = LOSE_SMILY;
    }

    clearInterval(gTimeInterval);
    gState.isGameOn = false;

    // updates smily
    var elSmily = document.querySelector('.play-again-smily');
    elSmily.innerHTML = strHtml;
}

// called when win to check if a new record
function checkRecord(time, level) {
    var record = localStorage[level.LEVEL + " record"];
    if (time < record) {

        // sets new record
        localStorage[level.LEVEL + " record"] = time;

        // shows new record
        var elRecord = document.querySelector('.record');
        elRecord.innerHTML = localStorage.getItem(level.LEVEL + " record");
    }
}

// shows time of game
function renderTime(time) {
    var elTime = document.querySelector('.timer');
    elTime.innerHTML = getStrTime(time, 3);
}

// if cell is clicked - activates hover over cells
function activateHover(ev) {
    if (gState.isGameOn) {
        // if right click
        if (ev.which === 1) {
            var elTable = document.querySelector('.board');
            elTable.classList.add('activate');
        }
    }
}

// CR - Nice feature, first I'm seeing anyone do something like this here.
// when mouse is up - removes activate hover over cells
function removeActivateHover() {
    var elTable = document.querySelector('.board');
    // CR - You can simply call classList.remove(). It won't throw any errors for non contained classes.
    if (elTable.classList.contains('activate')) elTable.classList.remove('activate');
}