$(document).ready(function () {

    $.ajax({
        url: 'https://ssd-api.jpl.nasa.gov/cad.api',
        method: 'GET',
        dataType: 'json',
        data: {
            fullname: 'true',
            
        } 
    }).then(function (data) {
        console.log(data);
        
    });


});