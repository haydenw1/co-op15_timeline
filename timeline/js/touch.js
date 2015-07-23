//select all circles and bind touch event listener which scrolls them to the middle of the screen
svg.selectAll(".circle")
	.on("touchstart", function(){
		var pos = circles[0].indexOf(this), //index of clicked element in array of circle elements
			elementTop = points[pos].top, //gets top coordinate of element from array in [verticle.html] that was created when the elements were
	    	elementBottom = points[pos].bottom, //gets bottom coordinate of element from array in [verticle.html] that was created when the elements were
	    	elementCenter = (((elementTop + elementBottom)/2) - ((height)/2)); //finds middle coordinate of element

		$( 'html, body' ).animate({scrollTop: elementCenter}, 500);
	});

//binds listener to html element that is looking for movement (scrolling with finger)
d3.select("html").on("touchmove",function(){
	isScrolledIntoView(); //send all elements and their positions to 'isScrolledIntoView'
});

//calls 'isScrolledIntoView' every 1/4 second, necessary because of 'momentum' scrolling on mobile (called at bottom of page)
function scrollCheck(){
	setTimeout(function(){
		isScrolledIntoView();
		scrollCheck(); //calls itself and runs as longer as user is on page
	},250); //time between checks
}

//var badCounter = 0;
//sees if circle elements are within certain bounds
function isScrolledIntoView(){
  var bodyScroll = $( "body" ).scrollTop(), //jquery, how far page has been scrolled
  	element, //circle element being checked
  	elementTop, //element top coordinate relative to scroll amound
    elementBottom, //element bottom coordinate relative to scroll amound
    textElement, //uses position of clicked element to find coresponding year text
    badCounter = 0; //counter to see if all circle elements are out of bounds

  for(var i = 0; i < circles[0].length; i++){
		element = circles[0][i];
		elementTop = points[i].top - bodyScroll;
		elementBottom = points[i].bottom - bodyScroll;
		textElement = yearTextG[0][i];

		d3Circle = d3.select(element).transition(); //variable to simplify syntax when selecting d3 circle element to change attributes
		d3Text = d3.select(textElement).transition(); //variable to simplify syntax when selecting d3 text element to change attributes

		if(elementTop >= height/4 && elementBottom <= window.innerHeight - height/4){ //*** taken from stack overflow ***, uses coordinates and window properties to check if element is within certain bounds
			d3Circle.attr("fill","#0099CC").attr("stroke", "white"); //circle fill to blue and stroke to white
			d3Text.attr("fill", "white").attr("stroke", "white"); //year text fill and stroke to white
			showTP(i); //calls fuction to show corresponding text and picture
		}else{
			d3Circle.attr("fill","white").attr("stroke", "gray"); //circle fill to white and stroke to gray
			d3Text.attr("fill","gray").attr("stroke", "none"); //text fill to gray and stroke to none
			badCounter === dataset.length - 1 ? hideTP() : false; //***checks to see if all circles are out of bounds, if so calls 'hideTP' (below)
			badCounter++;
		}
	}
}

var picElement = d3.select("#pic"), picElement = picElement[0][0], //select d3 picture element array and navigate to actual element
		textElement = d3.select("#p"), textElement = textElement[0][0]; //select d3 text element array and navigate to actual element

//selects corresponding DOM text and picture objects using passed position and displays them
function showTP(pos){
	var picObject = dataset[pos].pic,
			textObject = dataset[pos].event;

  picElement.setAttribute("src", picObject); //set source of img element to corresponding object image
  textElement.innerHTML = textObject; //set text in paragraph element to corresponding object text

	picElement.style.opacity = 1; //show picture
 	textElement.style.top = pic.height + "px"; //position text according to the height of picture
 	textElement.style.opacity = 1; //show text
}

//selects correspoinding DOM text and picture objects using passed position and hides them
function hideTP(){
  if(textElement && picElement){
    picElement.style.opacity = 0; //hide pic
    textElement.style.opacity = 0; //hide text
	}
}

//var state = 1; for ability to turn auto showing of descriptions and pictures off. 1 = auto on, 0 = auto off
console.log("coleslaw");
var buttonNav = d3.select(".button.nav"); //button that will turn automatic showing of description and picture off/on
var buttonPrev = d3.select(".button.prev");
var buttonNext = d3.select(".button.next");

	buttonNav.on("touchstart", function(){
		console.log(this);
		d3.select(this).attr("id", "active");
	});

	buttonNav.on("touchend", function(){
		console.log(this);
		d3.select(this).attr("id", null);
	});

	buttonPrev.on("touchstart", function(){
		console.log(this);
		d3.select(this).attr("id", "active");
		var elementCenter = goPrevNext(0);
		$( 'html, body' ).animate({scrollTop: elementCenter - height/2}, 500);
	});

	buttonPrev.on("touchend", function(){
		console.log(this);
		d3.select(this).attr("id", null);
	});

	buttonNext.on("touchstart", function(){
		console.log(this);
		d3.select(this).attr("id", "active");
		var elementCenterA = goPrevNext(1);
		$( 'html, body' ).animate({scrollTop: elementCenterA - height/2}, 500);
	});

	buttonNext.on("touchend", function(){
		console.log(this);
		d3.select(this).attr("id", null);
	});

function goPrevNext(direction){
	console.log("coleslaw prev");
	console.log(direction);
	var scrollCenter = $( "body" ).scrollTop() + height/2,
			scrollQuarter = scrollCenter - height/4,
			scrollThreeQuarter = scrollCenter + height/4;

	if(direction === 0){
		for(var i = 0; i < circles[0].length; i++){
			var element = circles[0][i],
			elementTop = points[i].top,
			elementBottom = points[i].bottom,
			elementCenter = ((elementTop + elementBottom)/2);

			if(i > 0 && elementCenter >= scrollQuarter){
				--i;
				elementTop = points[i].top;
				elementBottom = points[i].bottom;
				elementCenter = ((elementTop + elementBottom)/2);
				return elementCenter;
			}
		}
	}else{
		for(var a = 0; a < circles[0].length; a++){
			var elementA = circles[0][a],
			elementTopA = points[a].top,
			elementBottomA = points[a].bottom,
			elementCenterA = ((elementTopA + elementBottomA)/2);

			if(elementCenterA >= scrollThreeQuarter){
				return elementCenterA;
			}
		}
	}
}

scrollCheck(); //starts reoccuring, time-delayed function (above)
