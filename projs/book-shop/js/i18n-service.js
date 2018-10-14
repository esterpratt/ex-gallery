'use strict';

var gCurrLang = 'en';

var gLangs = {
    en: {
        title: 'What\'s Booking?',
        enterNewPrice: 'Enter new Price',
        update: 'Update',
        enterTitle: 'Enter Title',
        enterPrice: 'Enter Price',
        addBook: 'Add',
        bookTitle: 'Title',
        bookPrice: 'Price',
        bookActions: 'Actions',
        newBook: 'Create New Book',
        rate: 'Rate',
        readBook: 'Read',
        updateBook: 'Update',
        deleteBook: 'Delete',
        id: 'Id',
        cancel: 'Cancel',
        sure: 'Are You Sure?',
    },

    he: {
        title: 'הספרים שלי',
        enterNewPrice: 'הכנס מחיר חדש בדולרים',
        update: 'עדכן',
        enterTitle: 'הכנס כותרת',
        enterPrice: 'הכנס מחיר בדולרים',
        addBook: 'הוסף',
        bookTitle: 'כותרת',
        bookPrice: 'מחיר',
        bookActions: 'פעולות',
        newBook: 'צור ספר חדש',
        rate: 'דירוג',
        readBook: 'קרא',
        updateBook: 'עדכן',
        deleteBook: 'מחק',
        id: 'קוד',
        cancel: 'ביטול',
        sure: 'אתה בטוח?',
    },
};

function changeLang(lang) {
    gCurrLang = lang;
    if (lang === 'he') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // render prices
    renderPrices(getBooks());

    // select all elements to be changed
    var elLangs = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < elLangs.length; i++) {
        var el = elLangs[i];
        var dataLang = elLangs[i].getAttribute('data-lang');
        var dataTranslated = gLangs[lang][dataLang];

        if (!dataTranslated) continue;

        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', dataTranslated);
        } else {
            el.innerHTML = dataTranslated;
        }
    }
}

function getIntlPrice(price) {
    if (gCurrLang === 'he') {
        var currency = 'ILS';
        price *= 3.5;
    } else {
        var currency = 'USD';
    }
    return new Intl.NumberFormat(gCurrLang, { style: 'currency', currency: currency }).format(price);
}

function renderPrices(books) {
    books.forEach(function (book) {
        var price = getIntlPrice(book.price);
        document.querySelector(`.book-${book.id}`).innerHTML = price;
    });
}

function renderBooksLang() {
    // render prices
    renderPrices(getBooks());

    var elLangs = document.querySelectorAll('table [data-lang]');
    for (var i = 0; i < elLangs.length; i++) {
        var el = elLangs[i];
        var dataLang = elLangs[i].getAttribute('data-lang');
        var dataTranslated = gLangs[gCurrLang][dataLang];

        if (!dataTranslated) continue;
        el.innerHTML = dataTranslated;
    }
}