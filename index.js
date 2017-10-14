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
            sessionStorage.setItem("results",JSON.stringify(results));
            renderSearchResults(results);
        });
    });
    
    //get results from random search
    $('#randomButton').on('click', function(e){
        e.preventDefault(); //prevent page from refreshing
        
        var searchUrl = "http://www.thecocktaildb.com/api/json/v1/1/random.php";
        $.ajax({
            url: searchUrl,
            method: 'GET'
        })
        .done(function(result){
            renderRandom(result);
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
                renderSearchResults += "<div class='searchRow row'>";
            }
            renderSearchResults += "<div class='col-3'>";
            renderSearchResults += "<a data-toggle='modal' data-target='#drinkModal' data-drinkid='"+element.idDrink+"'><img class = 'rounded' src='"+ element.strDrinkThumb + "' height='200' width='277'>"
            renderSearchResults += element.strDrink + "</a>";
            renderSearchResults += "</div>"; //close col div
            

            if((counter + 1) % 4 == 0){
                renderSearchResults += "</div>" //close row div is next count = 0;
            }
            counter++;
            
        });
        $('#searchResults').append(renderSearchResults);

    }
    //
    $('#drinkModal').on('show.bs.modal', function(e){
        var clickedDrink = $(e.relatedTarget);
        var drinkId = clickedDrink.data('drinkid');
        var url = "http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;
        var modal = $(this);
        var renderDrinkIngredients = "";
        $.ajax({
            url: url,
            method: "GET"
        })
        .done(function(results){
            console.log(results);
            /* var drinkName = results.drinks[0].strDrink;
            var drinkInstructions = results.drink[0].strInstructions;
            
             
            modal.find('.modal-title').text(drinkName);
            renderDrinkIngredients += "<div class='row'><div class='col'>";
            renderDrinkIngredients += drinkInstructions;
            renderDrinkIngredients += "</div></div>" */
        })
    })
    function renderRandom(result) {
        $('#results-area').empty();
        
        var searchRandomResult = "";
        searchRandomResult += "<div class='row'>";
        searchRandomResult += "<div class='col-3'>";
        searchRandomResult += "<a href='#'><img src='"+ result.drinks[0].strDrinkThumb + "' height='200' width='277'></a>"
        searchRandomResult += result.drinks[0].strDrink;
        searchRandomResult += "</div></div>"; //close col div
        
        $('#results-area').append(searchRandomResult);
    }
    
    //using jquery ui - autocomplete function for search menu
    $('#drinkSearch').autocomplete({
        source: ingredients
    });
});