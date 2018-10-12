'use strict';

var gProjs;

function createProjs() {
    gProjs = [{id: "Minesweeper", 
               name: "Minesweeper", 
               title: "try not to blown up", 
               desc: "Coding Academy Sep18 course First Sprint", 
               url: "projs/Minesweeper", 
               publishedAt: "September 2018", 
               img: "Minesweeper.PNG",
               labels: ["Matrixes", "keyboard events"]},
               {id: "GuessMe", 
               name: "Guess Who", 
               title: "try to fool me", 
               desc: "Coding Academy Binary Tree, Bootstrap and Jquery project", 
               url: "projs/GuessMe", 
               publishedAt: "October 2018",
               img: "GuessMe.png",
               labels: ["Binary tree", "bootstrap", "jquery"]},
               {id: "touch-nums", 
               name: "Touch The Nums", 
               title: "try not to get crazy", 
               desc: "coding academy project", 
               url: "projs/touch-nums", 
               publishedAt: "September 2018",
               img: "touch-nums.PNG",
               labels: ["mouse events"]},
               {id: "BallBoard", 
               name: "Ball Board", 
               title: "try eat the balls", 
               desc: "Coding Academy matrix project", 
               url: "projs/BallBoard", 
               publishedAt: "September 2018",
               img: "BallBoard.png",
               labels: ["Matrixes", "keyboard events"]},
               {id: "book-shop", 
               name: "Book Shop", 
               title: "try read Dr Seuss, he's good", 
               desc: "Coding Academy bootstrap and jquery project", 
               url: "projs/book-shop", 
               img: "book-shop.png",
               publishedAt: "October 2018",
               labels: ["bootstrap", "jquery"]},
               {id: "in-picture", 
               name: "In Picture", 
               title: "try it on your kid", 
               desc: "Coding Academy CSS project. These kind of questions can help identify Autism tendencies with young children", 
               url: "projs/in-picture", 
               publishedAt: "September 2018",
               img: "in-picture.png",
               labels: ["css", "jquery"]},
             ];

    return gProjs;
}





function getProjById(projId) {
    var proj = gProjs.find(function (proj) {
        return proj.id === projId;
    })
    return proj;
}