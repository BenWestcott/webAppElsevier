// Array of titles from JSON file
var titleArray = [];

// Array of those titles to be currently displayed
var displayArray = [];

// Current maximum number of lines to display
var maxDisplayRows = 0;

// The default number of rows to display results in
var numberOfRowsToDisplay = 5;

// The current starting row of the block to display
var displayBlockStart = 0;

// Runs on when document is ready
$(document).ready(function () {

    //Set prev and next buttons to not display
    $('#Prev').css('display', 'none');
    $('#Next').css('display', 'none');

    //Load the JSON file
    loadJSON();
});

// Run loadJSON function
function loadJSON() {

    // AJAX query to load JSON
    $.ajax({
        type: 'GET',
        url: 'test.json',
        dataType: 'json',

        //On success, parse the JSON file
        success: jsonParser(),

        //If there is an error, report this
        error: function () {
            alert('Oops Problem Loading JSON File');
        }


    });


}

// Function to parse the JSON
function jsonParser(json) {

    $.getJSON('test.json', function (data) {

        //Get the title for each book via its worksById tag
        $.each(data.worksById, function (k, v) {

            //Create a book object with its EAN and Title
            var book = {EAN: k, Title: v.Title.TitleText};

            //Push this object to the titleArray
            titleArray.push(book)
        });
    });
}

//Filter used to work out what books to display given the current search text
function displayTitles(textToFilter) {

    // Index used for the display array - also used to find out the maximum number of rows to display
    var displayIndex = 0;

    //The array which contains the filtered titles to display
    displayArray = [];


    for (var index = 0; index < titleArray.length; index++) {

        //If there is specific text being sorted through
        if (textToFilter != "") {

            //Check if the array of book titles, contains any of the text in the search
            if (titleArray[index].Title.toLowerCase().indexOf(textToFilter.toLowerCase()) > -1) {

                //If it is contained, then add this specific title to the array of elements to be displayed
                displayArray[displayIndex] = titleArray[index];
                displayIndex++;
            }
        } else {

            //If there is no text to filter, add all the titles to the display array
            displayArray[displayIndex] = titleArray[index];
            displayIndex++;
        }
    }

    //Set the maximum display rows to how many are in the display row
    maxDisplayRows = displayIndex;


    displayNextRows(0);
}

// Function which adds the paragraph which displays in the container div
function addToContainer(index) {
    $('#container').append('<p class= "bookEntry">' + " " + displayArray[index].EAN + " " + displayArray[index].Title + '</p>');
}

// Function which clears the current container and updates the new block start for the display array
function nextBooks() {

    $('#container').html('');

    displayBlockStart += numberOfRowsToDisplay;
    displayNextRows(displayBlockStart);

}
// Function which clears the current container and updates the new block start for the display array
function prevBooks() {

    $('#container').html('');

    displayBlockStart -= numberOfRowsToDisplay;
    displayNextRows(displayBlockStart);
}

// Function which lists all titles
function listTitles() {

    //Clear container, sets the text search to nothing and then updates placeholder
    $('#container').html('');
    document.getElementById("txtSearch").value = "";
    $('#txtSearch').attr('placeholder', 'Search...');

    displayTitles("");
}

// Function which gets the search value in the search box and uses this to run the display title filter function
function searchByTitle() {

    var searchValue = document.getElementById('txtSearch').value;
    $('#container').html('');
    displayTitles(searchValue);
}

// Function which updates the number of rows to display in results
function updateDisplayNo() {

    $('#container').html('');
    var x = document.getElementById('noOfResults');
    numberOfRowsToDisplay = parseInt(x.options[x.selectedIndex].value);
    displayTitles("");
}

// Function which updates the current rows that should be displayed
function displayNextRows(displayBlockStart) {


    var index = displayBlockStart;

    // Checks if the index of the current block start row is less than either the max display rows or the number of rows to be displayed next
    // If this is the case, then add the next results to the container
    while (index < Math.min(numberOfRowsToDisplay + displayBlockStart, maxDisplayRows)) {
        addToContainer(index);
        index++;
    }

    // Updates whether the next or prev button should be displayed
    updatePrevOrNext(displayBlockStart);


}

// Function which updates whether to display the next or previous buttons based on what is and what will be displayed
function updatePrevOrNext(displayBlockStart) {
    
    if (maxDisplayRows <= numberOfRowsToDisplay) {
        $('#Next').css('display', 'none');
        $('#Prev').css('display', 'none');

        $('#container').append('<p class= bookEntry></p>');
        $('#container').append('<p class= bookEntry>  *** End of results *** </p>');

    } else if (displayBlockStart + numberOfRowsToDisplay >= maxDisplayRows) {
        $('#Next').css('display', 'none');
        $('#Prev').css('display', 'inline');
    } else if (displayBlockStart < numberOfRowsToDisplay) {

        $('#Next').css('display', 'inline');
        $('#Prev').css('display', 'none');
    } else {
        $('#Next').css('display', 'inline');
        $('#Prev').css('display', 'inline');
    }

}