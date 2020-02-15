const cometApp = {};


// using regex to add commas to numbers - imported from stackoverflow https://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

// event listeners
$('select').change(function () {
    $('.closestObjFlex').empty();
    const $userChoice = $(this).children("option:selected");
    const $userChoiceVal = $userChoice.val();

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
            console.log(`sorry, no comets around ${$userChoice.text()} now`);
        } else {
            function findIndex(value, index){
                return index <= 2
            };
    
            const $filteredObjects = result.data.filter(findIndex);
    
            // append h3 div 
            const h3ToAppend = `<h3>Closest ${$filteredObjects.length} objects</h3>`;
            $('.closestObjFlex').append(h3ToAppend);
    
            // find first 3 objects from search 
            $filteredObjects.forEach(function(currentVal, i) {
                console.log($filteredObjects[i][4]);
                const $convertedDistance = $filteredObjects[i][4] * 149597871;

                const $commaSeperatedDistance = commaSeparateNumber($convertedDistance.toFixed(0));
                console.log($commaSeperatedDistance);
                
    
                const htmlToAppend = `
                <ul>
                    <li>Name: ${$filteredObjects[i][11]}</li>
                    <li>Time of closest approach: ${$filteredObjects[i][3]}</li>
                <li>Distance from ${$userChoice.text()}: ${$commaSeperatedDistance} km </li>
                </ul>
                `;
                $('.closestObjFlex').append(htmlToAppend);
            });          
        }

        })
    });


    
    
$(document).ready(function () {
});



// $('.closestObjFlex').append(`
// <h3>Closest ${$userChoiceArray.length} objects</h3>
// <ul>
//     <li>Name: ${$userChoiceArray[0][11]}</li>
//     <li>Time of closest approach: ${$userChoiceArray[0][3]}</li>
//     <li>Distance from ${$userChoice.text()}: ${$userChoiceArray[0][4]} astronomical unit</li>
// </ul>
// <ul>
//     <li>Name: ${$userChoiceArray[1][11]}</li>
//     <li>Time of closest approach: ${$userChoiceArray[1][3]}</li>
//     <li>Distance from ${$userChoice.text()}: ${$userChoiceArray[1][4]} astronomical unit</li>
// </ul>                <ul>
//     <li>Name: ${$userChoiceArray[2][11]}</li>
//     <li>Time of closest approach: ${$userChoiceArray[2][3]}</li>
//     <li>Distance from ${$userChoice.text()}: ${$userChoiceArray[2][4]} astronomical unit</li>
// </ul>
// `);