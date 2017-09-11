// JavaScript Document
//Ray TEMPLO


	//These variable names are purposely mirrored to the API querystring key names
	//This is a good practice. Don't go renaming what your referencing if you don't have to or you'll have to map them one by one which is more brain power.
    var api_key = "0fe6b57711124e81b9f1d3cf8e57d2f6";
    var queryURL;
    var q;
    var begin_date;
    var end_date;

	//not part of the API query keys so we made up this name
    var limit = 5;

    function getInputValues () {
		//base url is set here so that it is also effectively re-initialized to this base value everytime this function is called.
		queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key="+api_key;
		q = $("#q").val().trim();
		begin_date = $("#begin_date").val().trim();
		end_date = $("#end_date").val().trim();
		//not part of the API
		limit = Number.parseInt($("#limit").val().trim());

        if (q !== "" && q !== undefined) {
            queryURL += "&q="+q;
        }

        if (begin_date !== "" && begin_date !== undefined && begin_date !== "Select a Date") {
            queryURL += "&begin_date="+begin_date;
        }

        if (end_date !== "" && end_date !== undefined && begin_date !== "Select a Date") {
            queryURL += "&end_date="+end_date;
        }
    }

	function getData() {
		//value retrieval tends to get messy and complicated, especially if you have to validate user input (which we aren't doing here)
		//	for this reason we have seperated this out to it's own function which is always good practice.
		//	remember no function is too small if it is doing a clear and concise job. Unitize!
		getInputValues();
		
		console.log("queryURL: " + queryURL);
		$.ajax({
			method: "GET",
			url: queryURL
		}).done(function (response) {
			//instead of loading your anonymous function with logic that will bloat depending on the amount of manipulation you have to do with JSON
			//	separate this too to its own function.
			
			//clear the results from any previous search
			$("#results-layer").empty();
			//procees the latest results
			processJSON(response)
		});
	}

    function processJSON(response) {
		//weird a response object within a response object - data onion skinning by the NYT!
        var dataObj = response.response.docs;

		//basic overflow logic - what if there are less records returned than the limit we set? It would iterate for non existent data and blow up
		if (dataObj.length < limit) {
			limit = dataObj.length;
		}

		for (var i = 0; i < limit; i++) {
			//counter + 1 to offeset array indices starting at 0
			var counter = i+1;
			//multiple variable declarations at once - good in a pinch - maybe not as readable - here as demo.
			var headline, byline, snippet, article_url;
		 
			//get the template html model (in this case BS4 card copy/clone it and remove the id because you don't want to create multiple copies of it existing with the same id)
			var currentCard = $("#original-card").clone().removeAttr("id");
			
			//these are ternary operators - more concise than if/else blocks. If you need to evaluate a series of conditions and you want to keep it line by line this is a good syntax for accomplishing that. we need them here because sometimes the availability of the objects in JSON are not reliable.
			headline = (dataObj[i].hasOwnProperty("headline"))?(dataObj[i].headline.hasOwnProperty("main")?(dataObj[i].headline.main):("NA")):("NA");
			byline = (dataObj[i].hasOwnProperty("byline"))?(dataObj[i].byline.hasOwnProperty("original")?(dataObj[i].byline.original):("NA")):("NA");
			snippet = (dataObj[i].hasOwnProperty("snippet"))?(dataObj[i].snippet):("NA");
			article_url = (dataObj[i].hasOwnProperty("web_url"))?(dataObj[i].web_url):("#");
			
			//locate the sub node/element quickly and efficiently with .find() selector
			currentCard.find(".counter").html(counter);
			currentCard.find(".article-header").html(headline);
			currentCard.find(".article-author").html(byline);
			currentCard.find(".article-desc").html(snippet);
			currentCard.find(".article-link").html(article_url);

			//finally we take the newly cloned/copied element which currently exists nowhere and append it to the results area.
			//this is a different angle from the targetelement.append we've been doing in class because we are initiating the insertion from the child element.
			currentCard.appendTo("#results-layer");
		}
		
    }

	function resetForm() {
		$("#q").val("");
		$("#begin_date").val("Select a Date"); //default value is informational - do not change
		$("#end_date").val("Select a Date"); //default value is informational - do not change
		$("#limit").val(0);

		$("#results-layer").empty();
	}

	$(document).ready(function () {
		//click event handlers
		$("#search-btn").on("click", getData);
		$("#reset-btn").on("click", resetForm);

		//jQuery UI calendar pickers set to have the month and year available and for the dateformat required by the NYT API.
		// Note: the input field is set to readonly so people cannot freetype the date anymore. They must use the selector.
		$("#begin_date").datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: 'yymmdd',
			yearRange: "-100:+0", // last hundred years
		});
		$("#end_date").datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: 'yymmdd',
			yearRange: "-100:+0", // last hundred years
		});		
	});