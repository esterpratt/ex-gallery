'use strict';

// • User sees a board with 16 cells, containing numbers 1..16, in a random order
//      o Hint: use an HTML table
//      o Hint: Nice technique for building the board: 
//        place the 16 numbers in a simple array, shuffle it, 
//        then build the <table> by popping a number from the nums array.
//      o Note: there is no need to use as matrix in this exercise
// • User should click the buttons in a sequence (1, 2, 3,… 16)
// • When user clicks the a button - call a function cellClicked(clickedNum)
//      o If right – the button changes its color
//      o When user clicks the wrong button noting happen
// • When user clicks the first number, game time starts and presented 
//   (3 digits after the dot, like in: 12.086)
// • Add difficulties (larger boards: 25, 36)

var gNums;
var gCurrNum;
var gTimeInterval;
var gSize;
var gDifs;
var gDifsMap;
var gStartTime;

function init() {
    // sets difficulties
    gDifs = [{ dif: 16, name: "Easy", record: Infinity },
             { dif: 25, name: "Medium", record: Infinity },
             { dif: 36, name: "Difficult", record: Infinity }];

    gSize = gDifs[0].dif;

    var strHTML = `<div class="dif pressed" data-dif="${gDifs[0].dif}" \
                  onclick="setDif(this)">${gDifs[0].name}</div>`;
    for (var i = 1; i < gDifs.length; i++) {
        strHTML += `<div class="dif unpressed" data-dif="${gDifs[i].dif}" \
        onclick="setDif(this)">${gDifs[i].name}</div>`;
    }

    gDifsMap = getMapById(gDifs);
    var elDif = document.querySelector('.difs');
    elDif.innerHTML = strHTML;

    startGame();
}

// gets map by id of difs
function getMapById(difs) {
    var map = {};
    for (var i = 0; i < difs.length; i++) {
        var id = difs[i].dif;
        map[id] = difs[i];
    }
    return map;
}

// sets the difficulty of the game - 16, 25, or 36 numbers
function setDif(elDif) {
    // if not pressed allready
    if (elDif.classList.contains('unpressed')) {
        var dif = +elDif.dataset.dif;

        // shows right record
        var elRecord = document.querySelector('.record');
        if (gDifsMap[dif].record === Infinity) {
            var strTime = "0:00:00";
        } else {
            var time = gDifsMap[dif].record;
            var strTime = getStrTime(time);
        }
        elRecord.innerHTML = `Your record is: <br/>${strTime}`;

        elDif.classList.add('pressed');
        elDif.classList.remove('unpressed');

        // clears prev dif
        var prevElDif = document.querySelector(`[data-dif='${gSize}']`);
        prevElDif.classList.remove('pressed');
        prevElDif.classList.add('unpressed');
        
        // set size of game to the difficulty and start a new game
        gSize = dif;
        startGame();
    }
}

function startGame() {
    gCurrNum = 1;
    gNums = []

    // clear interval
    if (gTimeInterval) clearInterval(gTimeInterval);
    // set time to 0
    var elTime = document.querySelector('.time');
    elTime.innerHTML = `Time:<br/>0:00:00`;
    // set the array of numbers to build the game from
    for (var i = 1; i <= gSize; i++) {
        gNums.push(i);
    }

    // set game board
    var rowsCount = Math.sqrt(gSize);
    renderBoard(rowsCount);
}

function renderBoard(rowsCount) {
    var strHTML = '';
    for (var i = 0; i < rowsCount; i++) {
        // add tr
        strHTML += `<tr>`
        for (var j = 0; j < rowsCount; j++) {
            var num = getRandomNum();
            // add td
            strHTML += `<td class="unpressed" data-num=${num} \
                        onclick = "cellClicked(this)">${num}</td>`;
        }
        strHTML += `</tr>`
    }
    var elTable = document.querySelector('.nums-table');
    elTable.innerHTML = strHTML;
}

// get random number from the numbers array and splice it from the array
function getRandomNum() {
    var randIdx = generateNum(0, gNums.length - 1);
    var num = gNums[randIdx];
    gNums.splice(randIdx, 1);
    return num;
}

// generates a random number between params min and max
function generateNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// when a number was clicked
function cellClicked(elTd) {

    var numPressed = +elTd.dataset.num;
    var elTime = document.querySelector('.time');

    // if right number
    if (numPressed === gCurrNum) {
        // if 1 - start clock
        if (numPressed === 1) {
            gStartTime = new Date();
            gTimeInterval = setInterval(function () {
                var time = getTimeFromStart(gStartTime);
                var strTime = getStrTime(time);
                elTime.innerHTML = `Time: <br/>${strTime}`;
            }, 10);

            // if last number - stops clock and checks if a new record
        } else if (numPressed === gSize) {
            clearInterval(gTimeInterval);
            var time = getTimeFromStart(gStartTime);
            checkRecord(time);
        }

        gCurrNum++;
        elTd.classList.add('pressed');
        elTd.classList.remove('unpressed');
    }
}

// gets the time passed from start of game
function getTimeFromStart(startTime) {
    var time = new Date();
    time.setTime(Date.now() - startTime);
    return time;
}

// checks if time is less than the record
function checkRecord(time) {
    var record = getRecord();
    if (time < record) {
        // sets new record
        record = time;
        setRecord(record);
        var strTime = getStrTime(time);
        var elRecord = document.querySelector('.record');
        elRecord.innerHTML = `Your record is: <br/>${strTime}`;
    }
}

// gets the right record
function getRecord() {
    return gDifsMap[gSize].record;
}

// sets new record to the model
function setRecord(time) {
    gDifsMap[gSize].record = time;
    for (var i = 0; i < gDifs.length; i++) {
        if (gDifs[i].dif === gSize) {
            gDifs[i].record = time;
        }
    }
}

// gets time as a str
function getStrTime(time) {
    return time.getMinutes() + ":" + time.getSeconds() +
           ":" + Math.round(time.getMilliseconds() / 10);
}