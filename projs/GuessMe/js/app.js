'use strict';

const KEY_TREE = 'gQuestsTree';
var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
var gLastRes = null;

$(document).ready(init);

function init() {
    // if exist in local stroage
    var tree = getFromLocalStorage(KEY_TREE);
    if (tree) {
        gQuestsTree = tree;
    } else {
        gQuestsTree = createQuest('Male?');
        gQuestsTree.yes = createQuest('Gandhi');
        gQuestsTree.no = createQuest('Rita');
        saveToLocalStorage(KEY_TREE, gQuestsTree);
    }

    gCurrQuest = gQuestsTree;

    renderStart();
}

function renderStart() {
    // hide and show start button
    var $btn = $('.gameStart>button');
    $btn.text('Reading your minds...');
    $btn.prop('disabled', true);
    $btn.css('cursor', 'wait');


    setTimeout(function () {
        $btn.text('I\'m ready!');
        $btn.prop('disabled', false);
        $btn.css('cursor', 'pointer');
    }, 3000);
}

function startGuessing() {
    // hide the gameStart section
    $('.gameStart').hide();
    renderQuest();
    // show the gameQuest section
    $('.gameQuest').fadeIn('slow');
}

function renderQuest() {
    // select the <h2> inside gameQuest and update its text by the currQuest text
    // diable button
    $('.gameQuest > button').prop('disabled', true);
    $('.gameQuest > button').css('cursor', 'auto');
    $('.gameQuest').fadeOut('slow', function () {
        $('.gameQuest > h2').text(gCurrQuest.txt);
    });
    
    $('.gameQuest').fadeIn('slow', function () {
        // enable button
        $('.gameQuest > button').prop('disabled', false);
        $('.gameQuest > button').css('cursor', 'pointer');
    });
}

function userResponse(res) {

    // If this node has no children
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            
            $('#winModal').modal('show');

        } else {
            // alert('I dont know...teach me!')
            // hide and show gameNewQuest section
            $('.gameQuest').hide();
            $('.gameNewQuest').fadeIn('slow');
        }
    } else {
        // update the prev, curr and res global vars
        gPrevQuest = gCurrQuest;
        gCurrQuest = gCurrQuest[res];
        gLastRes = res;

        renderQuest();
    }
}

function addGuess(ev) {
    // create 2 new Quests based on the inputs' values
    ev.preventDefault();
    var quest = $('#newQuest').val();
    var answer = $('#newGuess').val();
    if (quest && answer) {
        // connect the 2 Quests to the quetsions tree
        gPrevQuest[gLastRes] = createQuest(quest);
        gPrevQuest[gLastRes].yes = createQuest(answer);
        gPrevQuest[gLastRes].no = gCurrQuest;

        saveToLocalStorage(KEY_TREE, gQuestsTree);

        $('#helpModal').modal('show');
    }
}

function restartGame() {
    renderStart();
    $('.gameNewQuest').hide();
    $('.gameQuest').hide();
    $('.gameStart').show();
    gCurrQuest = gQuestsTree;
    gPrevQuest = null;
    gLastRes = null;
}