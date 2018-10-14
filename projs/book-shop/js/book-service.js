'use strict';

var gBooks;
const PAGE_SIZE = 3;
var gCurrPageNo = 0;

function createBooks() {
    if (localStorage.getItem('books')) {
        var books = JSON.parse(localStorage.getItem('books'));
    } else {
        var books = [createBook('No Man\'s Sky', 20, 'book-1'),
        createBook('The Cat in the Hat', 30, 'book-2'),
        createBook('There is a Wocket in My Pocket', 10, 'book-3'),
        createBook('book4', 20, 'book-3'),
        createBook('book5', 5, 'book-3')
        ];

        saveToLocalStorage('books', books);
    }

    return books;
}

function createBook(title, price, imgUrl) {
    return { id: makeId(), title: title, price: price, imgUrl: `img/${imgUrl}.jpg`, rate: 0 };
}

function deleteBook(bookId) {
    var bookIdx = getBookIndexById(bookId);
    gBooks.splice(bookIdx, 1);
    saveToLocalStorage('books', gBooks);
}

function addBook(title, price) {
    gCurrPageNo = 0;
    gBooks.unshift(createBook(title, price, ''));
    saveToLocalStorage('books', gBooks);
}

function updateBook(newPrice, bookId) {
    var book = getBookById(bookId);
    book.price = newPrice;
    saveToLocalStorage('books', gBooks);
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
    var books = gBooks.slice(fromBookIdx, fromBookIdx + PAGE_SIZE);
    // if no more books on page - get books of prev page
    var isAllDeleted = isAllBooksDeleted();
    if (!isAllDeleted) {
        if (books.length === 0) {
            goPrevPage();
            fromBookIdx = gCurrPageNo * PAGE_SIZE;
            books = gBooks.slice(fromBookIdx, fromBookIdx + PAGE_SIZE);
        }
    } else {
        console.log('no books');
    }
    return books;
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