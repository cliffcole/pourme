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
    var ingredients = [];

    // Get request to cocktail api for all ingredients
    $.ajax({
        url: "http://www.thecocktaildb.com/api/json/v1/1/list.php?i=list",
        method: "GET"
    })
    .done(function(results){
        //passing results to function to format results
        formatIngredientResults(results);
    });
    
    //Format ingredients 
    function formatIngredientResults(results){
        //strip array out of results and push to ingredients array
        results.drinks.forEach(function(element){
            ingredients.push(element.strIngredient1);
        });
    }

    //get results from search
    $('#drinkSubmit').on('submit', function(e){
        e.preventDefault();
        var searchText = $('.searchInput').val();
        
        //clear search input after setting searchText variable
        $('.searchInput').val('');
        
        //api url + searchString
        var searchUrl = "http://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+searchText;
        $.ajax({
            url: searchUrl,
            method: 'GET'
        })
        .done(function(results){
            renderSearchResults(results);
        });
    });
    
    //get results from random search
    $('#randomize').on('submit', function(e){
        e.preventDefault(); //prevent page from refreshing
        
        var searchUrl = "http://www.thecocktaildb.com/api/json/v1/1/random.php";
        $.ajax({
            url: searchUrl,
            method: 'GET'
        })
        .done(function(result){
            console.log("put something new here for rendering")
            //renderRandom(result);
        });
    });

    //Hacky method to append all html after hours of trying .appends
    //Render results to page
    function renderSearchResults(results){
        $('#searchResults').empty();
        var counter = 0;

       var renderSearchResults = "";
        results.drinks.forEach(function(element){
            
            if(counter % 4 == 0){
                renderSearchResults += "<div class='row'>";
            }
            renderSearchResults += "<div class='col-3'>";
            renderSearchResults += "<a href='#'><img src='"+ element.strDrinkThumb + "' height='200' width='277'></a>"
            renderSearchResults += element.strDrink;
            renderSearchResults += "</div>"; //close col div
            

            if((counter + 1) % 4 == 0){
                renderSearchResults += "</div>" //close row div is next count = 0;
            }
            counter++;
            
        });
        $('#searchResults').append(renderSearchResults);

    }
    
    function renderRandom(results) {
        var counter = 0;
        
        var searchRandom = $('<div></div>');
        
        $('#results-area').append(searchResultsRow)
        counter++;
    }

    //using jquery ui - autocomplete function for search menu
    $('#drinkSearch').autocomplete({
        source: ingredients
    });
});