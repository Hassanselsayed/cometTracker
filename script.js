const cometApp = {};

// event listeners
$('select').change(function () {
    let $selectedWeekday = $(this).children("option:selected").val();
    // console.log($selectedWeekday);

    $.ajax({
        url: 'https://ssd-api.jpl.nasa.gov/cad.api',
        method: 'GET',
        dataType: 'json',
        data: {
            fullname: 'true',
            body: $selectedWeekday
        } 
    }).then(function (data) {
        console.log(data);
        
    });
});

    
    
$(document).ready(function () {
});