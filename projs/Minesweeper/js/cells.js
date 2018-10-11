// functions list:
// cellClicked(elCell, ev) - Called when a cell (td) is clicked
// revealCell(elCell) - reveals the cell 
// cellMarked(elCell) - Called on right click to mark a cell 
//                      as suspected to have a mine
// expandShown(cellI, cellJ) - opens neighbors when user clicks an empty place
// revealMines() - when lose, reveals all mines and wrong flags


// CR - A little over nested. A few nesting points could be avoided by returning early
// CR... e.g. 'if (!gState.gameIsOn)/(cell.isShown) return;'
// called when cell is clicked 
function cellClicked(elCell, ev) {

    // gets cell index
    var idx = getCellIdx(elCell);
    var i = idx.i;
    var j = idx.j;

    // on first click
    if (gIsFirst) {
        gIsFirst = !gIsFirst;
        // places mines
        gBoard = setMines(gBoard, i, j);
        // starts time interval
        gTimeInterval = setInterval(function () {
            gState.secsPassed++;
            renderTime(gState.secsPassed);
        }, 1000);
    }

    // if game on progress
    if (gState.isGameOn) {
        var cell = gBoard[i][j];
        // if not shown
        if (!cell.isShown) {
            // if right click
            if (ev.which === 3) {
                cellMarked(elCell);
                renderMinesCount(gLevel.MINES - gFlags.length);
                // if left click
            } else {
                // if not marked
                if (!cell.isMarked) {
                    // if mine - end game
                    if (cell.isMine) {
                        // paints cell red
                        elCell.classList.add('mine');
                        // reveals all mines
                        revealMines();
                        endGame(false);
                    } else {
                        // reveals cell
                        revealCell(elCell);
                        // if there are no mines around cell - expand
                        if (cell.minesAroundCount === 0) expandShown(i, j);
                        // get all cells of flags isToCheck boolean back to true so next expand will check it again
                        for (var flagIdx = 0; flagIdx < gFlags.length; flagIdx++) {
                            var flagCell = gBoard[gFlags[flagIdx].i][gFlags[flagIdx].j];
                            if (!flagCell.isToCheck) flagCell.isToCheck = true;
                        }
                        checkGameOver();
                    }
                }
            }
        }
    }
}

// reveals cell (called when cell clicked or when expand show)
function revealCell(elCell) {
    // gets cell
    var idx = getCellIdx(elCell);
    var cell = gBoard[idx.i][idx.j];

    cell.isShown = true;
    cell.isToCheck = false;
    elCell.classList.remove('covered');

    // if has mine-neigbors - shows mines-around count
    if (cell.minesAroundCount > 0) {
        var minesCount = '' + cell.minesAroundCount;
        var color = COLOR_BY_COUNT[minesCount];
        // CR - Don't use this method to set the font properties. It is obsolete.
        // CR... 'you can use elCell.style.color = color' instead (your span will inherit the color property)
        // CR... Here too - elCell.querySelector('.content') would have been better.
        elCell.children[0].children[1].innerHTML = minesCount.fontcolor(color);
    }
    gState.shownCount++;
}

// handles flags (right click)
function cellMarked(elCell) {

    // gets cell
    var idx = getCellIdx(elCell);
    var i = idx.i;
    var j = idx.j;
    var cell = gBoard[i][j];

    var flag = { i: i, j: j, isMine: cell.isMine }

    // if not marked with flag
    if (!cell.isMarked) {
        // add flag to model
        gFlags.push(flag);

        // adds flag to dom
        elCell.children[0].children[1].innerHTML = FLAG_IMG;
        elCell.classList.remove('unflagged');

        // if mine
        if (cell.isMine) {
            gState.minesMarkedCount++;
            checkGameOver();
        }
        // if allready marked with flag
    } else {

        // finds and removes current flag from the flags array
        for (var i = 0; i < gFlags.length; i++) {
            if (gFlags[i].i === flag.i && gFlags[i].j === flag.j) {
                gFlags.splice(i, 1);
                // // for expand function: to know to check it next time
                // if (!cell.isToCheck) cell.isToCheck = true;
                break;
            }
        }

        // removes flag from dom
        elCell.children[0].children[1].innerHTML = '';
        elCell.classList.add('unflagged');

        // if mine
        if (cell.isMine) {
            gState.minesMarkedCount--;
        }
    }

    cell.isMarked = !cell.isMarked;
}

// CR - a cell's 'isShown' and 'isMarked' properties should be 
// CR... sufficient indicators for wheather to reveal and or keep expanding.
// CR... Marked cells should not continue to expand, even if their minesAroundCount is zero.   
// expands show if cell has 0 neigbors
function expandShown(cellI, cellJ) {

    // checks neighbors
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i >= 0 && i < gBoard.length) {
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {

                // if not self and legal index
                if ((i !== cellI || j !== cellJ) && j >= 0 && j < gBoard.length) {

                    // if need to be checked (was not checked and not allready revealed)
                    if (gBoard[i][j].isToCheck) {

                        // if flag - marks it as checked
                        if (gBoard[i][j].isMarked) {
                            gBoard[i][j].isToCheck = false;
                        }
                        // if not flag - reveals it
                        else {
                            // gets cell
                            var cellClass = getCellClass(i, j);
                            // CR - elCell
                            var cell = document.querySelector(cellClass);
                            revealCell(cell);
                        }

                        // if 0 neigbors - checks its neigbors
                        if (gBoard[i][j].minesAroundCount === 0) {
                            expandShown(i, j);
                        }
                    }
                }
            }
        }
    }
}

// reveals all mines and wrong flags when lost
function revealMines() {

    // reveals all mines
    for (var i = 0; i < gMines.length; i++) {
        var mineI = gMines[i].i;
        var mineJ = gMines[i].j;
        // if not marked
        if (!gBoard[mineI][mineJ].isMarked) {
            // gets cell class
            var cellClass = getCellClass(mineI, mineJ);
            var elCell = document.querySelector(cellClass);
            // CR - elCell.querySelector('.content') would have been a little better. Below as well.
            elCell.children[0].children[1].innerHTML = MINE_IMG;
        }
    }

    // CR - nice!
    // reveals wrong flags
    for (var i = 0; i < gFlags.length; i++) {
        if (!gFlags[i].isMine) {
            var cellClass = getCellClass(gFlags[i].i, gFlags[i].j);
            var elCell = document.querySelector(cellClass);
            elCell.children[0].children[1].innerHTML = MINE_IMG;
            elCell.children[0].children[0].innerHTML = 'X';
        }
    }
}