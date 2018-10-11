'use strict';


// function list:
// getCellIdx(elCell) - returns i and j indexes from cell element
// getCellClass - returns class name from i and j indexes
// getStrTime - returns time with 3 digits
// getRandomIndex - returns a random index from a square matrix
// generateNum - generates a random number between params min and max

// CR - Good, however, referring to classList at a certain index seems somewhat unsafe and unsustainable.
// CR... As a side note: For such cases it is possible to use the special 'data-xxx' property,
// CR... to which an element object has direct access. 
// CR... e.g. for '<td data-i="4" data-j="5"...></td>', elCell.dataset.i would equal '4' 
// CR... and elCell.dataset.j === '5'.
// gets i and j from cell element
function getCellIdx(elCell) {
    var className = elCell.classList[1];
    var classParts = className.split('-');
    var i = +classParts[1];
    var j = +classParts[2];
    return { i: i, j: j };
}

// gets class name from i and j indexes
function getCellClass(i, j) {
    return `.cell-${i}-${j}`;
}

// gets the time with 3 digits
function getStrTime(time, digitsToShowCount) {

    var digitsCount = time.toString().length;

    var strTime = '';
    if (time >= 1000) {
        strTime = "999";
        console.log('You suck!'); // CR - that hurts 
    } else {
        for (var i = 0; i < digitsToShowCount - digitsCount; i++) {
            strTime += "0";
        }
        strTime += time;
    }

    return strTime;
}

// gets random index on board
function getRandomIndex(boardSize) {
    var randI = generateNum(0, boardSize - 1);
    var randJ = generateNum(1, boardSize - 1);

    var randIdx = { i: randI, j: randJ };

    return randIdx;
}

// generates a random number between params min and max
function generateNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}