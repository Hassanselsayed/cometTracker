
// app object
const cometApp = {};

// using regex to add commas to numbers - imported from stackoverflow https://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
cometApp.commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
};

// event listeners

// collect planet selection 
cometApp.selectListener = function() {
    $('.closestObjFlex').empty();
    const userChoice = $(this).children("option:selected").text();
    const userChoiceVal = $('#body').val();

    cometApp.ajaxCall(userChoice, userChoiceVal);

};

// collect user input date
cometApp.$minDateInput = $('#min-date');
cometApp.$maxDateInput = $('#max-date');

cometApp.formListener = function(e){
    e.preventDefault();
    const userInputMinDate = cometApp.$minDateInput.val();
    console.log(cometApp.userInputMinDate);
    const userInputMaxDate = cometApp.$maxDateInput.val();

    const userChoice = $(this).children("option:selected").text();
    const userChoiceVal = $('#body').val();

    cometApp.ajaxCall(userChoice, userChoiceVal, userInputMinDate);

    }



// callback function to be used in the .filter method
cometApp.findIndex = function(value, index) {
    return index <= 2;
};

// AJAX call function
cometApp.ajaxCall = function(planetName, planetValue, minDate = 'now') {
    // start of AJAX call
    console.log(planetValue);
    $.ajax({
        url: `https://ssd-api.jpl.nasa.gov/cad.api`,
        method: 'GET',
        dataType: 'json',
        data: {
            fullname: true,
            body: planetValue,
            'date-min': minDate,
        } 

    }).then(function(result) {
        console.log(result);
        if (result.count === '0') {
            console.log(`sorry, no comets around ${planetName} now`);
        } else {

            // creating a new filtered array using the .filter method on the result.data array to get the first 3 values only
            const $filteredObjects = result.data.filter(cometApp.findIndex);

            // appending h3 to container div
            if (result.count === '1') {
                const h3ToAppend = `<h3>Closest ${$filteredObjects.length} object</h3>`;
                $('.closestObjFlex').append(h3ToAppend);
            } else {
                const h3ToAppend = `<h3>Closest ${$filteredObjects.length} objects</h3>`;
                $('.closestObjFlex').append(h3ToAppend);
            }

            // looping over the new filtered array using the .forEach method
            $filteredObjects.forEach(function(currentVal, i) {
                const $convertedDistance = $filteredObjects[i][4] * 149597871;
                const $commaSeperatedDistance = cometApp.commaSeparateNumber($convertedDistance.toFixed(0));
                
                const htmlToAppend = `
                <ul>
                    <li>Name: ${$filteredObjects[i][11]}</li>
                    <li>Time of closest approach: ${$filteredObjects[i][3]}</li>
                    <li>Distance from ${planetName}: ${$commaSeperatedDistance} km </li>
                </ul>
                `;
                $('.closestObjFlex').append(htmlToAppend);
            // end of forEach method
            });
        // end of else condition
        }
    // end of .then method
    })
    .fail(err => console.log(err))
// end of AJAX call function
};

cometApp.init = function () {
    $('select').change(cometApp.selectListener);
    $('form').on('submit', cometApp.formListener);

}
    
$(() => {
    cometApp.init();
});
