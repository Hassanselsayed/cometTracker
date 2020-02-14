const cometApp = {};

// event listeners
$('select').change(function () {
    // $('.closestObjFlex').empty();
    let $userChoice = $(this).children("option:selected");
    let $userChoiceVal = $userChoice.val();

    $.ajax({
        url: 'https://ssd-api.jpl.nasa.gov/cad.api',
        method: 'GET',
        dataType: 'json',
        data: {
            fullname: 'true',
            body: $userChoiceVal
        } 
    }).then(function (result) {
        console.log(result);
        if (result.count === '0') {
            console.log(`sorry, no comets around the ${$userChoiceVal} now`);
        } else {
            const $userChoiceArray = result.data.slice(0, 3);
            console.log($userChoiceArray);
            $('.closestObjFlex').append(`
                <h3>Closest ${$userChoiceArray.length} objects</h3>
                <ul>
                    <li>Name: ${$userChoiceArray[0][11]}</li>
                    <li>Time of closest approach: ${$userChoiceArray[0][3]}</li>
                    <li>Distance from ${$userChoice.text()}: ${$userChoiceArray[0][4]} astronomical unit</li>
                </ul>
                <ul>
                    <li>Name: ${$userChoiceArray[1][11]}</li>
                    <li>Time of closest approach: ${$userChoiceArray[1][3]}</li>
                    <li>Distance from ${$userChoice.text()}: ${$userChoiceArray[1][4]} astronomical unit</li>
                </ul>                <ul>
                    <li>Name: ${$userChoiceArray[2][11]}</li>
                    <li>Time of closest approach: ${$userChoiceArray[2][3]}</li>
                    <li>Distance from ${$userChoice.text()}: ${$userChoiceArray[2][4]} astronomical unit</li>
                </ul>
            `);
        }
    });
});

    
    
$(document).ready(function () {
});