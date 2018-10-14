'use strict';

function init() {
    gBooks = createBooks();
    renderBooks();
    renderPageButtons();
}

function renderBooks() {
    var books = getBooks();

    var strHtmls = books.map(function (book) {
        return `<tr class="row">
                    <td class="col col-2">
                        ${book.id}
                    </td>
                    <td class="title-td col col-4">
                        ${book.title}
                    </td>
                    <td class="col col-2 book-${book.id}">
                        ${getIntlPrice(book.price)}
                    </td>
                    <td class="actions-buttons col col-4">
                        <button class="btn btn-primary" onClick="onReadBook('${book.id}')" data-lang="readBook">Read</button>
                        <button class="btn btn-warning" onClick="readAndUpdateBook('${book.id}')" data-lang="updateBook">Update</button>
                        <button class="btn btn-danger" onClick="onDeleteBook('${book.id}')" data-lang="deleteBook">Delete</button>
                    </td>
                </tr>`;
    });
    $('.book-table').html(strHtmls.join(''));

    renderBooksLang();
}

function renderPageButtons() {
    var $elPageNo = $('.page-no');
    var pageSize = getPageSize();
    var strHtml = '';
    for (var i = 0; i < Math.ceil(gBooks.length / pageSize); i++) {
        strHtml += `<button class="btn btn-dark ml-1" onclick="onGoToPage(${i})">${i + 1}</button>`;
    }

    $elPageNo.html(strHtml);
}

function renderRateButtons(rate) {
    // enables buttons
    $('.btn-rate-up').attr('disabled', false);
    $('.btn-rate-down').attr('disabled', false);
    if (rate === 10) {
        // disable rate-up-btn
        $('.btn-rate-up').attr('disabled', true);
    } else if (rate === 0) {
        // disable rate-down-btn
        $('.btn-rate-down').attr('disabled', true);
    }
}

function onDeleteBook(bookId) {
    // show modal
    $('#SureModalCenter').modal('show');
    // add bookId to modal
    $('#SureModalCenter').attr('data-bookId', bookId);
}

function onConfirmeDelete(el) {
    // hide modal
    $('#SureModalCenter').modal('hide');

    // get bookId
    var id = $('#SureModalCenter').attr('data-bookId');

    deleteBook(id);
    renderPageButtons();
    renderBooks();
}

function onNotToDelete() {
    // hide modal
    $('#SureModalCenter').modal('hide');
}

function readAndAddNewBook() {
    // show modal
    $('#modalNewBook').modal('show');
    $('#newBookTitle').val('');
    $('#newBookPrice').val('');
}

function addNewBook() {
    var title = $('#newBookTitle').val();
    var price = $('#newBookPrice').val();

    if (title && price && !isNaN(price) && price >= 0) {
        // hide modal
        $('#modalNewBook').modal('hide');

        addBook(title, price);
        renderPageButtons();
        renderBooks();
    }
}

function readAndUpdateBook(bookId) {
    // show modal
    $('#modalPrice').modal('show');
    $('#newPrice').val('');

    // add current book id to button so will identify current book
    $('.btn-update').attr('id', bookId)
}

function updatePrice() {
    var bookId = $('.btn-update').attr('id');
    var price = $('#newPrice').val();
    if (price && !isNaN(price) && price >= 0) {
        updateBook(price, bookId);
        renderBooks();
        // hide modal
        $('#modalPrice').modal('hide');
    }
}

function onReadBook(bookId) {
    // show modal
    $('#bookModalCenter').modal('show');

    var book = getBookById(bookId);

    $('.modal-title').text(book.title);
    $('#book-img').attr('src', book.imgUrl);
    // show price by currency
    $('.price').text(getIntlPrice(book.price));

    // show rate
    $('.rate-txt').text(book.rate);

    // render rate buttons
    renderRateButtons(book.rate);

    // add class of current book to modal rate
    $('.rate-change-container').attr('id', bookId);
}

function onRateUp() {
    // get book
    var id = $('.rate-change-container').attr('id');
    var book = getBookById(id);

    // update rate
    if (book.rate <= 9) {
        if (book.rate === 0) {
            // enable button
            $('.btn-rate-down').attr('disabled', false);
        }

        book.rate++;
        saveToLocalStorage('books', gBooks);
        // show rate
        $('.rate-txt').text(book.rate);

        if (book.rate === 10) {
            // disable button
            $('.btn-rate-up').attr('disabled', true);
        }
    }
}

function onRateDown() {
    // get book
    var id = $('.rate-change-container').attr('id');
    var book = getBookById(id);
    // update rate
    if (book.rate > 0) {
        if (book.rate === 10) {
            // enable button
            $('.btn-rate-up').attr('disabled', false);
        }

        book.rate--;
        saveToLocalStorage('books', gBooks);
        // show rate
        $('.rate-txt').text(book.rate);

        if (book.rate === 0) {
            // disable button
            $('.btn-rate-down').attr('disabled', true);
        }
    }
}

function onSortBooksByTitle() {
    gBooks.sort(sortBooksByTitle);
    renderBooks();
}

function onSortBooksByPrice() {
    gBooks.sort(sortBooksByPrice);
    renderBooks();
}

function onNextPage() {
    var currPage = getCurrPage();
    var pageSize = getPageSize();
    if (currPage < Math.floor((gBooks.length - 1) / pageSize)) {
        goNextPage();
        renderBooks();
    }
}

function onPrevPage() {
    var currPage = getCurrPage();
    if (gCurrPageNo > 0) {
        goPrevPage();
        renderBooks();
    }
}

function onGoToPage(pageIdx) {
    gCurrPageNo = pageIdx;
    renderBooks();
}
