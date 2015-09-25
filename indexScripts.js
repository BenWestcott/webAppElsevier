var titleArray = [];
var displayNumberV = 10;
var startIndex = 0;
var JSONParsed = 0;
$(document).ready(function () {
    $('#Prev').css('display', 'none');
    $('#Next').css('display', 'none');
});

function loadJSON() {
    if (JSONParsed == 0) {
        $.ajax({
            type: 'GET',
            url: 'test.json',
            dataType: 'json',
            success: jsonParser(),
            error: function () {
                alert('Oops Problem Loading JSON File');
            }


        });
        JSONParsed = 1;
    }
}


function jsonParser(json) {


    $.getJSON('test.json', function (data) {
        $.each(data.worksById, function (k, v) {

            var book = {EAN: k, Title: v.Title.TitleText};


            titleArray.push(book)


        });

        displayTitles(displayNumberV, startIndex, 1);

    });


}

function displayTitles(noToDisplay, startIndex, prevOrNext) {
    console.log('Displaying from : ' + startIndex)

    for (var index = 0; index < noToDisplay; index++) {

        if (index + startIndex < titleArray.length) {
            $('#container').append('<p class= "bookEntry">' + " " + titleArray[index + startIndex].EAN + " " + titleArray[index + startIndex].Title + '</p>')
        }

        if (startIndex + noToDisplay >= titleArray.length) {
            $('#Next').css('display', 'none');
        } else {
            $('#Next').css('display', 'inline');
        }

        if (index == noToDisplay || startIndex < 10) {
            $('#Prev').css('display', 'none');
        } else {
            $('#Prev').css('display', 'inline');
        }
    }

    if (prevOrNext == 1) {
        newStartIndex = startIndex + noToDisplay;
    } else {
        newStartIndex = startIndex;
    }

    return newStartIndex;
}

function nextBooks() {


    $('#container').html('');
    displayTitles(displayNumberV, newStartIndex, 1);


}

function prevBooks() {
    $('#container').html('');
    displayTitles(displayNumberV, newStartIndex - displayNumberV, 0);

}
