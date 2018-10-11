'use strict';

var gProjs;

function createProjs() {
    gProjs = [{id: "Minesweeper", 
               name: "Minesweeper", 
               title: "try not to blown up", 
               desc: "try not to blown up", 
               url: "projs/Minesweeper", 
               publishedAt: getCurrDate(), 
               labels: ["Matrixes", "keyboard events"]},
               {id: "GuessMe", 
               name: "Guess Who", 
               title: "try to fool me", 
               desc: "reading your minds", 
               url: "projs/GuessMe", 
               publishedAt: getCurrDate(),
               labels: ["Matrixes", "keyboard events"]}
             ];

    return gProjs;
}





function getProjById(projId) {
    var proj = gProjs.find(function (proj) {
        return proj.id === projId;
    })
    return proj;
}