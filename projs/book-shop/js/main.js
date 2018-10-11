'use strict';

function init() {
    gBooks = createBooks();
    renderBooks();
    renderPageButtons();
}

function renderBooks() {
    var books = getBooks();

    // if no more books on page - get books of prev page
    var isAllDeleted = isAllBooksDeleted();
    if (!isAllDeleted) {
        if (books.length === 0) {
            goPrevPage();
            books = getBooks();            
        }
    } else {
        console.log('no books');
    }
    
    var strHtmls = books.map(function (book) {
        return `<tr class="row">
                    <td class="col col-md-2">
                        ${book.id}
                    </td>
                    <td class="title-td col col-md-4">
                        ${book.title}
                    </td>
                    <td class="col">
                        ${book.price}
                    </td>
                    <td class="d-flex justify-content-between col col-md-4">
                        <button class="btn btn-primary" onClick="onReadBook('${book.id}')">Read</button>
                        <button class="btn btn-warning" onClick="readAndUpdateBook('${book.id}')">Update</button>
                        <button class="btn btn-danger" onClick="onDeleteBook('${book.id}')">Delete</button>
                    </td>
                </tr>`;
    });
    $('.book-table').html(strHtmls.join(''));
}

function renderPageButtons() {
    var $elPageNo = $('.page-no');
    var pageSize = getPageSize();
    var strHtml = '';
    for (var i = 0; i < Math.ceil(gBooks.length / pageSize); i++) {
        strHtml += `<button class="btn btn-dark ml-1" onclick="onGoToPage(${i})">${i+1}</button>`;
    }
    $elPageNo.html(strHtml);
}

function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderPageButtons();
    renderBooks();
}

function readAndAddNewBook() {
    // show collapse
    $('#collapseNewBook').collapse('show');
    $('#newBookTitle').val('');
    $('#newBookPrice').val('');

    // disable all buttons and enable current button
    $(':button').prop('disabled', true);
    $('.btn-add-book').prop('disabled', false);
}

function addNewBook() {
    var title = $('#newBookTitle').val();
    var price = $('#newBookPrice').val();

    if (title && price && !isNaN(price) && price >= 0) {
        // hide collapse and enable all buttons
        $('#collapseNewBook').collapse('hide');
        $(':button').prop('disabled', false);
        addBook(title, price);
        renderPageButtons();

        renderBooks();
    }
}

function readAndUpdateBook(bookId) {
    // show collapse
    $('#collapsePrice').collapse('show');
    $('#newPrice').val('');

    // disable all buttons and enable current button
    $(':button').prop('disabled', true);
    $('.btn-update').prop('disabled', false);

    // add current book id to button so will identify current book
    $('.btn-update').attr('id', bookId)
}

function updatePrice() {
    var bookId = $('.btn-update').attr('id');
    var price = $('#newPrice').val();
    if (price && !isNaN(price) && price >= 0) {
        updateBook(price, bookId);
        renderBooks();
        // hide collapse and enable all buttons
        $('#collapsePrice').collapse('hide');
        $(':button').prop('disabled', false);
    }
}

function onReadBook(bookId) {
    // show modal
    $('#bookModalCenter').modal('show');

    var book = getBookById(bookId);

    $('.modal-title').text(book.title);
    $('#book-img').attr('src', book.imgUrl);
    $('.price').text(book.price);
    $('.rate-txt').text(book.rate);

    // add class of current book to modal rate
    $('.rate-change-container').attr('id', bookId);
}

function onRateUp() {
    // get book
    var id = $('.rate-change-container').attr('id');
    var book = getBookById(id);
    // update rate
    if (book.rate <= 9) {
        book.rate++;
        // show rate
        $('.rate-txt').text(book.rate);
    }
}

function onRateDown() {
    // get book
    var id = $('.rate-change-container').attr('id');
    var book = getBookById(id);
    // update rate
    if (book.rate > 0) {
        book.rate--;
        // show rate
        $('.rate-txt').text(book.rate);
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