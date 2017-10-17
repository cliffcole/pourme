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
    
    //clear any session Storage
    sessionStorage.removeItem("drinkResults");
    sessionStorage.removeItem("userSearches");
    
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
            //store results in session storage
            var previousResults = sessionStorage.getItem('drinkResults');
            //check for previous results
            if(previousResults == null){
                //check to see if results are empty
                if(results == ""){
                    $('#searchResults').empty();
                    $('#searchResults').append("<div class='container'><p>No Results for "+searchText+"... Please try again</p></div>");
                }
                //otherwise set current results to sessionStorage
                else{
                    sessionStorage.setItem("drinkResults",JSON.stringify(results));
                    
                    
                    var currentSearches = formatCurrentSearches(searchText);
                    renderCurrentSearch(currentSearches);
                    renderSearchResults(results.drinks);
                }
            }
            //else previous results
            else {
                var currentSearches = formatCurrentSearches(searchText);
                renderCurrentSearch(currentSearches);
                //compare previous results
                var filteredDrinks = filterDrinkResults(JSON.parse(previousResults), results);
                //store previous results
                sessionStorage.setItem("drinkResults",JSON.stringify(results));
                
                //renderCurrentSearch(searchText);
                renderSearchResults(filteredDrinks);
            }
            
        });
    });
    
    
    function formatCurrentSearches(searchText) {
        var currentSearches = JSON.parse(sessionStorage.getItem('userSearches'));
        if(currentSearches == null){
            var currentSearches = []
            currentSearches.push(searchText);
            sessionStorage.setItem("userSearches",JSON.stringify(currentSearches));
            
        }
        else {
            currentSearches.push(searchText);
            sessionStorage.removeItem("userSearches");
            sessionStorage.setItem("userSearches",JSON.stringify(currentSearches));
        }
        return currentSearches;
    }
    // Filter through previous results and current results
    function filterDrinkResults(previousResults, currentSearchResults){
        var returnDrinkResults = [];
        
        //loop through current and previous results and compare
        previousResults.drinks.forEach(function(prevResults){
            var prevName = prevResults.strDrink;
            currentSearchResults.drinks.forEach(function(currResults){
                var currName = currResults.strDrink;
                if(currName == prevName){
                    returnDrinkResults.push(currResults)
                }
            })
        })
        // return results that match
        return returnDrinkResults;
    }

    //Remove selected search and rerender
    $('#currentSearch').on('click', 'button', function(e){
        e.preventDefault();
        var removeSearch = $(e.currentTarget).data('search');
        deleteUserSearch(removeSearch);
    })

    function deleteUserSearch(removeSearch){
        var currentSearches = JSON.parse(sessionStorage.getItem('userSearches'));
        
        if (currentSearches.length == 1){
            if (currentSearches[0] == removeSearch){
                sessionStorage.removeItem('userSearches');
                $('#currentSearch').empty();
                $('#searchResults').empty();
            }
            
        }else {
            filteredCurrentSearches = currentSearches.filter(function(searchItem){
                return searchItem != removeSearch;
            })
            getAndFilterCurrentSearchResults(filteredCurrentSearches);
        } 
        
    }

    //loops through currentSearches for results
    function getAndFilterCurrentSearchResults(filteredCurrentSearches){
        sessionStorage.removeItem('drinkResults');
        sessionStorage.removeItem('userSearches');
        filteredCurrentSearches.forEach(function(element){
            var searchText = element
            var searchUrl = "http://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+searchText;
            $.ajax({
                url: searchUrl,
                method: 'GET'
            })
            .done(function(results){
                //store results in session storage
                var previousResults = sessionStorage.getItem('drinkResults');
                //check for previous results
                if(previousResults == null){
                    //check to see if results are empty
                    if(results == ""){
                        $('#searchResults').empty();
                        $('#searchResults').append("<div class='container'><p>No Results for "+searchText+"... Please try again</p></div>");
                    }
                    //otherwise set current results to sessionStorage
                    else{
                        sessionStorage.setItem("drinkResults",JSON.stringify(results));
                        
                        
                        var currentSearches = formatCurrentSearches(searchText);
                        console.log("Null: "+currentSearches);
                        renderCurrentSearch(currentSearches);
                        renderSearchResults(results.drinks);
                    }
                }
                //else previous results
                else {
                    var currentSearches = formatCurrentSearches(searchText);
                    console.log("ELSE: "+ currentSearches);
                    renderCurrentSearch(currentSearches);
                    //compare previous results
                    var filteredDrinks = filterDrinkResults(JSON.parse(previousResults), results);
                    //store previous results
                    sessionStorage.setItem("drinkResults",JSON.stringify(results));
                    
                    //renderCurrentSearch(searchText);
                    renderSearchResults(filteredDrinks);
                }
            })
        })
    }
    //rendering current searches
    function renderCurrentSearch(searchTextArray){
        
        $('#currentSearch').empty();
        var renderCurrentSearch = "<div class='row'>";
        renderCurrentSearch += "<div class='col'>";
        searchTextArray.forEach(function(search){
            
            renderCurrentSearch += "<button type='button' class='searches btn btn-secondary btn-sm' data-search='"+search+"'>"+search+"<span class='buttonDelete'> X</span></button>";
            
        })
        renderCurrentSearch += "</div>";
        renderCurrentSearch += "</div>";

        $('#currentSearch').append(renderCurrentSearch);
    }
    
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
       
        results.forEach(function(element){
            
            if(counter % 4 == 0){
                renderSearchResults += "<div class='searchRow row'>";
            }
            renderSearchResults += "<div class='col-sm-3'>";
            renderSearchResults += "<a data-toggle='modal' data-target='#drinkModal' data-drinkid='"+element.idDrink+"'><img class = 'rounded img-fluid' src='"+ element.strDrinkThumb + "' height='auto' width='100%'>"
            renderSearchResults += element.strDrink + "</a>";
            renderSearchResults += "</div>"; //close col div
            

            if((counter + 1) % 4 == 0){
                renderSearchResults += "</div>" //close row div is next count = 0;
            }
            counter++;
            
        });
        $('#searchResults').append(renderSearchResults);
    }
    //drink modal
    $('#drinkModal').on('show.bs.modal', function(e){
        var clickedDrink = $(e.relatedTarget);
        var drinkId = clickedDrink.data('drinkid');
        //lookup drinkId 
        var url = "http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;
        var modal = $(this);
        var renderDrinkIngredients = "";
        //send ajax request
        $.ajax({
            url: url,
            method: "GET"
        })
        .done(function(results){
            //parse various variables
            var drinkName = results.drinks[0].strDrink;
            var drinkInstructions = results.drinks[0].strInstructions;
            //empty any previous drinks
            modal.find('.modal-title').empty();
            modal.find('.modal-body').empty();
            modal.find('.modal-title').text(drinkName);
            //build modal
            renderDrinkIngredients += "<div class='row'><div class='col'>";
            renderDrinkIngredients += "<b>Instructions:</b> "+ drinkInstructions;
            renderDrinkIngredients += "<hr>";
            renderDrinkIngredients += "</div></div>"
            renderDrinkIngredients += "<div class='row'><div class='col'>";
            //format drink ingredients
            var ingredients = formatDrinkIngredients(results.drinks);
            //loop through ingredients 
            for (var key in ingredients){
                renderDrinkIngredients += "<div class='row'>";
                renderDrinkIngredients += "<div class='col'>";
                renderDrinkIngredients += key +"</div>";
                renderDrinkIngredients += "<div class='col'>";
                renderDrinkIngredients += ingredients[key];
                renderDrinkIngredients += "</div></div>";
            }       
            //append to modal
            modal.find('.modal-body').append(renderDrinkIngredients);
        })
    })
    //format drink ingredients 
    function formatDrinkIngredients(drinksArray){
        var ingredients = {};
        //15 possible ingredient strings based on API results
        for(var x = 1; x <= 15; x++){
            //increment ingredients and parts associated with ingredients
            var ingredientNumber = "strIngredient"+x;
            var partNumber = "strMeasure"+x;
            //only one results for drink search
            var currentIngredient = drinksArray[0][ingredientNumber];
            if (currentIngredient == null){
                currentIngredient = "";
            }
            if (currentIngredient != ""){
                var parts = drinksArray[0][partNumber];
                //check for empty parts
                if (parts == "" || parts == "\n" || parts == null|| parts == "\t\n"){
                    ingredients[currentIngredient] = "";
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
        searchRandomResult += "<p class='drinkname'>" + result.drinks[0].strDrink + "</p>"
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
    if ($(document).scrollTop() > 550) {
        $('nav').addClass('shrink');
    }
    else {
        $('nav').removeClass('shrink');
    }
});