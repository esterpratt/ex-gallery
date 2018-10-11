'use strict';

var gBooks;
const PAGE_SIZE = 3;
var gCurrPageNo = 0;

function createBooks() {
    var books = [createBook('No Man\'s Sky', 20, 'book-1'),
    createBook('The Cat in the Hat', 30, 'book-2'),
    createBook('There is a Wocket in My Pocket', 10, 'book-3'),
    createBook('book4', 20, 'book-3'),
    createBook('book5', 5, 'book-3')
    ];

    return books;
}

function createBook(title, price, imgUrl) {
    return { id: makeId(), title: title, price: price, imgUrl: `img/${imgUrl}.jpg`, rate: 0 };
}

function deleteBook(bookId) {
    var bookIdx = getBookIndexById(bookId);
    gBooks.splice(bookIdx, 1);
}

function addBook(title, price) {
    gBooks.push(createBook(title, price, ''));
}

function updateBook(newPrice, bookId) {
    var book = getBookById(bookId);
    book.price = newPrice;
}

function getBookById(id) {
    var book = gBooks.find(function (book) {
        return book.id === id;
    });
    return book;
}

function getBookIndexById(id) {
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === id;
    });
    return bookIdx;
}

function sortBooksByTitle(a, b) {
    var aTitle = a.title;
    var bTitle = b.title;
    if (aTitle < bTitle)
        return -1;
    if (aTitle > bTitle)
        return 1;
    return 0;
}

function sortBooksByPrice(a, b) {
    return a.price - b.price;
}

function goNextPage() {
    gCurrPageNo++;
}

function goPrevPage() {
    gCurrPageNo--;
}

function getBooks() {
    var fromBookIdx = gCurrPageNo * PAGE_SIZE;
    return gBooks.slice(fromBookIdx, fromBookIdx + PAGE_SIZE);
}

function getPageSize() {
    return PAGE_SIZE;
}

function getCurrPage() {
    return gCurrPageNo;
}

function isAllBooksDeleted() {
    if (gBooks.length === 0) return true;
    return false;
}