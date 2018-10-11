'use strict';

// Note: It is convenient to have the images named by the quest id (e.g. : 1.jpg)
// If the player is correct, move on to next quest
// Some more functions:
//  a. initGame()
//  b. createQuests()
//  c. renderQuest()
//  d. checkAnswer(optIdx)
// Create 3 questions

var gQuests;
var gCurrQuestIdx;

function initGame() {
    gQuests = [{ id: 1, opts: ['The girl is angry', 'The girl is happy'], correctOptIndex: 0 },
    { id: 2, opts: ['The girl is sad', 'The girl is excited'], correctOptIndex: 1 },
    { id: 3, opts: ['The girl is afraid', 'The girl is sad'], correctOptIndex: 0 }];
    gCurrQuestIdx = 0;

    createQuests();
}

function createQuests() {

    var strHTML = '';
    for (var i = 0; i < gQuests[gCurrQuestIdx].opts.length; i++) {
        strHTML += `<li class="answer ${i}" onclick="checkAnswer(${i})"></li>`;
    }

    var elQuest = document.querySelector('.question');
    elQuest.innerHTML = strHTML;

    renderQuest();
}

function renderQuest() {

    // hide feedback
    var elFeedback = document.querySelector('.feedback');
    elFeedback.style.visibility = 'hidden';

    // puts correct img
    var elPic = document.querySelector('.pic');
    elPic.innerHTML = `<img src="img/${gQuests[gCurrQuestIdx].id}.jpg"/>`;

    // puts correct quests
    var elQuest = document.querySelector('.question');

    for (var i = 0; i < elQuest.children.length; i++) {
        elQuest.children[i].innerText = gQuests[gCurrQuestIdx].opts[i];
    }
}

function checkAnswer(optIdx) {
    var elFeedback = document.querySelector('.feedback');
    if (gCurrQuestIdx < gQuests.length) {
        if (optIdx === gQuests[gCurrQuestIdx].correctOptIndex) {
            gCurrQuestIdx++;
            elFeedback.innerText = "Correct!";
            elFeedback.classList.remove('wrong');
            if (gCurrQuestIdx == gQuests.length) {
                var elBtn = document.querySelector('.start-over');
                elBtn.style.visibility = 'visible';
            } else {
                setTimeout(renderQuest, 500);
            }
        } else {
            // hide feedback
            setTimeout(() => {
                var elFeedback = document.querySelector('.feedback');
                elFeedback.style.visibility = 'hidden';
            }, 1000);
            elFeedback.innerText = "Wrong";
            elFeedback.classList.add('wrong');
            console.log('Try again');
        }
        elFeedback.style.visibility = 'visible';
    }
}

function startOver(elBtn) {
    gCurrQuestIdx = 0;
    elBtn.style.visibility = 'hidden';
    renderQuest();
}

