'use strict';

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function saveToLocalStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}