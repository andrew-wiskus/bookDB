$(document).ready(function() {
    getBooks();
    getSearchItems();

    // add a book
    $('#book-submit').on('click', postBook);
    $('#book-list').on('click', '.update', putBook);
    $('#book-list').on('click', '.delete', deleteBook);
    $('.showAll').on('click', 'button', showAllBooks);
    $('.genreSelect').on('click', 'button', function() {
        updateList('genreSelect');
    });
    $('.authorSelect').on('click', 'button', function() {
        updateList('authorSelect');
    });
    //$('#dateSelect').on('click', 'button', dataSelect);
});
/**
 * Retrieve books from server and append to DOM
 */

function showAllBooks() {
    $('#book-list').empty();
    getBooks();
    getSearchItems();
}

function getSearchItems() {
    getAuthors();
    getGenres();
}

function getAuthors() {
    var bookAuthors = [];
    $.ajax({
        type: 'GET',
        url: '/books',
        success: function(books) {
            //console.log("bookList:", books);

            books.forEach(function(book, i) {
                if (bookAuthors.length === 0) {
                    bookAuthors.push(book.author);
                } else {
                    var unique = true;
                    bookAuthors.forEach(function(author, i) {
                        if (author == book.author) {
                            unique = false;
                        }
                    });
                    if (unique === true) {
                        bookAuthors.push(book.author);
                    }
                }

            });
            $('#authorSelect').empty();
            bookAuthors.forEach(function(author, i) {
                $('#authorSelect').append('<option value="' + author + '">' + author + '</option>');
            });
        },
        error: function() {
            console.log("/getAuthors didntWork");
        }
    });
}

function getGenres() {
    var bookGenres = [];
    $.ajax({
        type: 'GET',
        url: '/books',
        success: function(books) {
            //console.log("bookList:", books);

            books.forEach(function(book, i) {
                if (bookGenres.length === 0) {
                    bookGenres.push(book.genre);
                } else {
                    var unique = true;
                    bookGenres.forEach(function(genre, i) {
                        if (genre == book.genre) {
                            unique = false;
                        }
                    });
                    if (unique === true) {
                        bookGenres.push(book.genre);
                    }
                }

            });
            $('#genreSelect').empty();
            bookGenres.forEach(function(genre, i) {
                $('#genreSelect').append('<option value="' + genre + '">' + genre + '</option>');
            });
        },
        error: function() {
            console.log("/getGenresDIDNTWORK");
        }
    });
}

function updateList(selectID) {
    var selected = ($("#" + selectID + " option:selected").text());
    var selectedProperty = "";
    switch (selectID) {
        case "authorSelect":
            selectedProperty = "author";
            break;
        case "genreSelect":
            selectedProperty = "genre";
            break;
        default:
            console.log("updateList switch function broke");
    }
    $('#book-list').empty();

    $.ajax({
        type: 'GET',
        url: '/books',
        success: function(books) {

            console.log('GET /books returns:', books);
            books.forEach(function(book) {
                if (book[selectedProperty] == selected) {
                    var $el = $('<div></div>');

                    var bookProperties = ['title', 'author', 'published', 'genre'];
                    bookProperties.forEach(function(property) {

                        var inputType = 'text';
                        if (property == 'published') {
                            book[property] = new Date(book[property]);

                            //get strings for month/day/year
                            var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                            var day = book[property].getUTCDate(book[property]);
                            var year = book[property].getUTCFullYear(book[property]);

                            //catcatcanate into one string month/day/year and set to book.published as text
                            book[property] = month + "/" + day + "/" + year;
                        }
                        var $input = $('<input type="' + inputType + '" id="' + property + '"name="' + property + '" />');
                        $input.val(book[property]);
                        $el.append($input);
                    });
                    $el.data("bookId", book.id);
                    $el.append('<button class="update">Update</button>');
                    $el.append('<button class="delete">Delete</button>');

                    $('#book-list').append($el);
                }
            });

        },

        error: function(response) {
            console.log('select /books fail. No books could be retrieved!');
        },
    });

}

function searchGenre() {
    var selectedGenre = ($("#genreSelect option:selected").text());
    $('#book-list').empty();

    $.ajax({
        type: 'GET',
        url: '/books',
        success: function(books) {

            console.log('GET /books returns:', books);
            books.forEach(function(book) {
                console.log("GENRES:", book.genre);
                console.log("selectedGenre:", selectedGenre);
                if (book.genre == selectedGenre) {
                    console.log("matches?:", book.genre);
                    var $el = $('<div></div>');

                    var bookProperties = ['title', 'author', 'published', 'genre'];
                    bookProperties.forEach(function(property) {

                        var inputType = 'text';
                        if (property == 'published') {
                            book[property] = new Date(book[property]);

                            //get strings for month/day/year
                            var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                            var day = book[property].getUTCDate(book[property]);
                            var year = book[property].getUTCFullYear(book[property]);

                            //catcatcanate into one string month/day/year and set to book.published as text
                            book[property] = month + "/" + day + "/" + year;
                        }
                        var $input = $('<input type="' + inputType + '" id="' + property + '"name="' + property + '" />');
                        $input.val(book[property]);
                        $el.append($input);
                    });
                    $el.data("bookId", book.id);
                    $el.append('<button class="update">Update</button>');
                    $el.append('<button class="delete">Delete</button>');

                    $('#book-list').append($el);
                }
            });

        },

        error: function(response) {
            console.log('GET /books fail. No books could be retrieved!');
        },
    });

}

function deleteBook() {
    var bookId = $(this).parent().data('bookId');

    $.ajax({
        type: 'DELETE',
        url: '/books/' + bookId,
        success: function() {
            console.log('DELETED bookID:', bookId);

            $('#book-list').empty();
            $('#genreSelect').empty();
            getBooks();
            getSearchItems();
        },
        error: function() {
            console.log("error in delete");
        }
    });
}

function getBooks() {
    $.ajax({
        type: 'GET',
        url: '/books',
        success: function(books) {
            console.log('GET /books returns:', books);
            books.forEach(function(book) {
                var $el = $('<div></div>');

                var bookProperties = ['title', 'author', 'published', 'genre'];
                bookProperties.forEach(function(property) {

                    var inputType = 'text';
                    if (property == 'published') {
                        book[property] = new Date(book[property]);

                        //get strings for month/day/year
                        var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                        var day = book[property].getUTCDate(book[property]);
                        var year = book[property].getUTCFullYear(book[property]);

                        //catcatcanate into one string month/day/year and set to book.published as text
                        book[property] = month + "/" + day + "/" + year;
                    }
                    var $input = $('<input type="' + inputType + '" id="' + property + '"name="' + property + '" />');
                    $input.val(book[property]);
                    $el.append($input);
                });
                $el.data("bookId", book.id);
                $el.append('<button class="update">Update</button>');
                $el.append('<button class="delete">Delete</button>');

                $('#book-list').append($el);
            });
        },

        error: function(response) {
            console.log('GET /books fail. No books could be retrieved!');
        },
    });
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
    event.preventDefault();

    var book = {};

    $.each($('#book-form').serializeArray(), function(i, field) {
        book[field.name] = field.value;
    });

    $.ajax({
        type: 'POST',
        url: '/books',
        data: book,
        success: function() {
            console.log('POST /books works!');
            $('#genreSelect').empty();
            $('#book-list').empty();
            getBooks();
            getSearchItems();
        },

        error: function(response) {
            console.log('POST /books does not work...');
        },
    });
}

function putBook() {
    var book = {};
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        book[field.name] = field.value;
    });
    var bookId = $(this).parent().data('bookId');

    $.ajax({
        type: 'PUT',
        url: '/books/' + bookId,
        data: book,
        success: function() {
            $('#genreList').empty();
            $('#book-list').empty();
            getBooks();
            getSearchItems();
        },
        error: function() {
            console.log('Error: Put /books/' + bookId + ' did NOT work ya FOOL(jk<3)');
        }
    })
    console.log('book we are putting', book);
}
