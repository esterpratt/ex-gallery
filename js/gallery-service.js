'use strict';

var gProjs;

function createProjs() {
    gProjs = [{
        id: "Minesweeper",
        name: "Minesweeper",
        title: "try not to blown up",
        desc: "Coding Academy Sep18 course First Sprint",
        publishedAt: "September 2018",
        img: "Minesweeper.PNG",
        labels: ["Matrixes", "keyboard events"]
    },
    {
        id: "GuessMe",
        name: "Guess Who",
        title: "try to fool me",
        desc: "Coding Academy Binary Tree, Bootstrap and Jquery project",
        publishedAt: "October 2018",
        img: "GuessMe.png",
        labels: ["Binary tree", "bootstrap", "jquery"]
    },
    {
        id: "touch-nums",
        name: "Touch Nums",
        title: "try not to get crazy",
        desc: "coding academy project",
        publishedAt: "September 2018",
        img: "touch-nums.PNG",
        labels: ["mouse events"]
    },
    {
        id: "BallBoard",
        name: "Ball Board",
        title: "try eat the balls",
        desc: "Coding Academy matrix project",
        publishedAt: "September 2018",
        img: "BallBoard.png",
        labels: ["Matrixes", "keyboard events"]
    },
    {
        id: "book-shop",
        name: "Book Shop",
        title: "try read Dr Seuss",
        desc: "Coding Academy bootstrap and jquery project",
        img: "book-shop.png",
        publishedAt: "October 2018",
        labels: ["bootstrap", "jquery"]
    },
    {
        id: "design2LivePage",
        name: "Design to Live Page",
        title: "try spot the differences",
        desc: "Coding Academy CSS project. Design live page from PSD file",
        publishedAt: "October 2018",
        img: "design2LivePage.jpg",
        labels: ["css"]
    },
    ];

    return gProjs;
}


function getProjById(projId) {
    var proj = gProjs.find(function (proj) {
        return proj.id === projId;
    })
    return proj;
}