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
            var drinkName = results.drinks[0].strDrink;
            var drinkInstructions = results.drinks[0].strInstructions;
            modal.find('.modal-title').empty();
            modal.find('.modal-body').empty();
            modal.find('.modal-title').text(drinkName);
            renderDrinkIngredients += "<div class='row'><div class='col'>";
            renderDrinkIngredients += "<b>Instructions:</b> "+ drinkInstructions;
            renderDrinkIngredients += "<hr>";
            renderDrinkIngredients += "</div></div>"
            renderDrinkIngredients += "<div class='row'><div class='col'>";
            var ingredients = formatDrinkIngredients(results.drinks);
            for (var key in ingredients){
                renderDrinkIngredients += "<div class='row'>";
                renderDrinkIngredients += "<div class='col'>";
                renderDrinkIngredients += key +"</div>";
                renderDrinkIngredients += "<div class='col'>";
                renderDrinkIngredients += ingredients[key];
                renderDrinkIngredients += "</div></div>";
            }       
            modal.find('.modal-body').append(renderDrinkIngredients);
        })
    })

    function formatDrinkIngredients(drinksArray){
        var ingredients = {};
        for(var x = 1; x <= 15; x++){
            var ingredientNumber = "strIngredient"+x;
            var partNumber = "strMeasure"+x;

            var currentIngredient = drinksArray[0][ingredientNumber];
            if (currentIngredient == null){
                currentIngredient = "";
            }
            if (currentIngredient != ""){
                var parts = drinksArray[0][partNumber];
                if (parts == "" || parts == "\n" || parts == null|| parts == "\t\n"){
                    ingredients[currentIngredient] = "";
                }
                else if(parts == "\n"){
                    
                }
                else {
                    ingredients[currentIngredient] = parts;
                }          
            } 
        }
        return ingredients;
    }

    function renderRandom(result) {
        $('#results-area').empty();
        
        var searchRandomResult = "";
        //row
        searchRandomResult += "<div class='row'>";
        
        //col-4
        searchRandomResult += "<div class='col-4'>";
        searchRandomResult += "<a href='#'><img src='"+ result.drinks[0].strDrinkThumb + "' height='200' width='277'></a>"
        searchRandomResult += "<hr width='277'/>"
        searchRandomResult += "<p>" + result.drinks[0].strDrink + "</p>"
        searchRandomResult += "</div>"; //close col-4 div
        
        //col-8
        searchRandomResult += "<div class='col-8'>";
        searchRandomResult += "<div class='instructions'>" + result.drinks[0].strInstructions + "</div>";
        searchRandomResult += "<hr />";
        
        searchRandomResult += "<div class='ingredients'>" + gatherIngredients(result) + "</div>";
        searchRandomResult += "</div>"; //close col-8 div
        
        searchRandomResult += "</div>"; //close div
        
        $('#results-area').append(searchRandomResult);
    }
    
    //gather list of ingredients for a drink
    function gatherIngredients(selectedDrink) {
        var ingredients = "Ingredients: ";
        
        for (ingredient = 1; ingredient <= 15; ingredient++) {
            var selector = "strIngredient" + ingredient.toString();
            if (selectedDrink.drinks[0][selector] === "") {
                break;
            } else {
                ingredients += selectedDrink.drinks[0][selector] + ", ";
            }
            
        }
        return ingredients.slice(0,length-2);
    }
    
    //using jquery ui - autocomplete function for search menu
    $('#drinkSearch').autocomplete({
        source: ingredients
    });
});


// scroll font change function
$(window).scroll(function() {
    if ($(document).scrollTop() > 600) {
        $('nav').addClass('shrink');
    }
    else {
        $('nav').removeClass('shrink');
    }
});