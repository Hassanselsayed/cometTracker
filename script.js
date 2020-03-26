// app object
const cometApp = {};

// using regex to add commas to numbers - imported from stackoverflow https://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
cometApp.commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
};

// select a planet listener
cometApp.planetSelectListener = function() {
    $('.closestObjFlex').empty();
    const userChoice = $('#body option:selected').text();
    const userChoiceVal = $('#body').val();

    const pendingRespone = cometApp.ajaxCall(userChoiceVal); 
    
    pendingRespone.then(function(result) {
    
        cometApp.displayDefaultBodyResults(result, userChoice);

    })
};

// collect user input date
cometApp.$minDateInput = $('#minDate');
cometApp.$maxDateInput = $('#maxDate');

// date form listener 
cometApp.formListener = function(e){
    e.preventDefault();
    if ($('#body option:selected').val() !== 'planet' && $('#spaceObject option:selected').val() !== 'spaceObjectDefault') {
        $('.dateSearchResults').empty();
        const userInputMinDate = cometApp.$minDateInput.val();
        const userInputMaxDate = cometApp.$maxDateInput.val();
    
        // const userChoice = $("#body option:selected").text();
        const userChoiceVal = $('#body').val();  

        const spaceObjChoice = $('#spaceObject option:selected').text();
        const spaceObjChoiceVal = $('#spaceObject').val();
        
        const minDate = userInputMinDate ? userInputMinDate : 'now';
        const maxDate = userInputMaxDate ? userInputMaxDate : '+60';
    
        const pendingRespone = cometApp.ajaxCall(userChoiceVal, minDate, maxDate, spaceObjChoiceVal); 

        pendingRespone.then(function(result) {
            cometApp.displayDateResults(result, spaceObjChoice);
        })
    } else {
        $('.dateSearchResults').empty();
        const errorToAppend = `<h3>please choose a planet and a celestial object first</h3>`;
        $('.dateSearchResults').append(errorToAppend);
    }
}

// Display planet object search  
cometApp.displayDefaultBodyResults = function (result, planetName) {
    if (result.count === '0') {
        const htmlToAppend = `<h3>no results for ${planetName} at this time</h3>`;
        $('.closestObjFlex').append(htmlToAppend);
    } else {

        // creating a new array containing the first 3 results of the original array
        const $filteredObjects = result.data.slice(0, 3);

        // appending h3 to container div
        if (result.count === '1') {
            const h3ToAppend = `<p class = "pInfo">closest object between now and the next 60 days</p>`;
            $('.closestObjFlex').append(h3ToAppend);
        } else {
            const pToAppend = `<p class = "pInfo">closest ${$filteredObjects.length} objects between now and the next 60 days</h3>`;
            $('.closestObjFlex').append(pToAppend);
        }

        // looping over the new filtered array using the .forEach method
        $filteredObjects.forEach(function (currentVal, i) {
            const $convertedDistance = $filteredObjects[i][4] * 149597871;
            const $commaSeperatedDistance = cometApp.commaSeparateNumber($convertedDistance.toFixed(0));

            const htmlToAppend = `
                <ul>
                    <li class = "planetTextbox">
                        <p>Name: ${$filteredObjects[i][11]}</p>
                        <p>Approach date: ${$filteredObjects[i][3]}</p>
                        <p>Distance from ${planetName}: ${$commaSeperatedDistance} km </p>
                    </li>
                </ul>
                `;
            $('.closestObjFlex').append(htmlToAppend);
            // end of forEach method
        });
        // end of else condition
    }
}

// Display date search results 
cometApp.displayDateResults = function(result, kind) {
    if (result.count === '0') {
        const htmlToAppend = `<p class = "pInfo">no results for ${kind} during this period</p>`;
        $('.dateSearchResults').append(htmlToAppend);
    } else {
        const $filteredObjects = result.data.slice(0, 8);

        const headingToAppend = `<p class = "pInfo">showing up to 8 recorded close approches</p>`;
        $('.dateSearchResults').append(headingToAppend);
    
        // looping over the new filtered array using the .forEach method
        $filteredObjects.forEach(function (currentVal, i) {
    
            const $convertedDistance = $filteredObjects[i][4] * 149597871;
            const $commaSeperatedDistance = cometApp.commaSeparateNumber($convertedDistance.toFixed(0));
    
            const htmlToAppend = `
                <ul dateSearchGrid>
                    <li class = "planetTextbox">
                        <p>Name: ${$filteredObjects[i][11]}</p>
                        <p>Approach date: ${$filteredObjects[i][3]}</p>
                        <p>Distance: ${$commaSeperatedDistance} km</p>
                    </li>
                </ul>
                `;
            $('.dateSearchResults').append(htmlToAppend);
            // end of forEach method
        });
        $('select').change(function() {
            $('.dateSearchResults').empty();
        });
    }
}


// AJAX call function
cometApp.ajaxCall = function(planetValue, minDate, maxDate, userKind) {
    return $.ajax({
        url: `https://ssd-api.jpl.nasa.gov/cad.api`,
        method: 'GET',
        dataType: 'json',
        data: {
            fullname: true,
            body: planetValue,
            'date-min': minDate,
            'date-max': maxDate,
            kind: userKind
        } 
    })
};

// init function
cometApp.init = function () {
    $('#body').change(cometApp.planetSelectListener);
    $('#spaceObject').change(cometApp.spaceObjSelectListener);
    $('form').on('submit', cometApp.formListener);
}
    
// document ready
$(() => {
    cometApp.init();
});
