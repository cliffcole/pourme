/*
Pour Me - Find a drink!

Main Javascript file

@Authors
-Cliff Cole
-Jarrod
-Kim
-Sunit
*/

$(function(){
    
    // Loading ingredients on page load.
    var ingredients = {}
    
    // Get request to cocktail api for all ingredients
    $.ajax({
        url: "http://www.thecocktaildb.com/api/json/v1/1/list.php?i=list",
        method: "GET"
    })
    .done(function(results){
        //passing results to function to format results
        formatIngredientResults(results);
    })

    function formatIngredientResults(results){
        //console.log(results.drinks);
        results.drinks.forEach(function(element) {
            console.log(element);
        });
    }
});