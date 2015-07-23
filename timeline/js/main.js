//
//start pre-json js
//

//sets width/height/padding variables for use...height of timeline determined with "totalHeight"
var width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight,
    padding = document.documentElement.clientHeight/2,

    textHolderWidth = width * 0.7,
    rightSpace = width - (width * 0.7),
    rightSpacePadding = rightSpace / 18,
    circleDimensions = rightSpace * (7 / 8),
    timelineXPos = width * (15.5 / 16),

    viewerWidth = rightSpace, //* (9 / 8),
    viewerHeight = viewerWidth / 3, // * (2 / 3),
    viewerXPos = timelineXPos - viewerWidth,
    viewerYPos = (height / 2) - (viewerHeight / 2),

    viewerTop = viewerYPos,
    viewerBottom = viewerYPos + viewerHeight;

console.log(viewerBottom);
console.log(viewerTop);

var viewerLineData = [
    { "x": 0, "y": 0},
    { "x": viewerWidth * (3 / 4), "y": 0},
    { "x": viewerWidth, "y": viewerHeight/2},
    { "x": viewerWidth * (3 / 4), "y": viewerHeight},
    { "x": 0, "y": viewerHeight},
    { "x": 0, "y": 0}
  ]

var viewerLine = d3.svg.line()
  .x(function(d){ return d.x;})
  .y(function(d){ return d.y;})
  .interpolate("linear");

var viewer = d3.select( "body" )
    .append("svg")
    .attr("class","viewer-svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    .attr("fill","black")
    .style("position", "fixed")
    .style("left", viewerXPos)
    .style("top", viewerYPos)
  .append("path")
    .attr("d",viewerLine(viewerLineData))
    .attr("stroke","black")
    .attr("stroke-width","0px")
    .attr("fill","#9F6FE8");

    //dark = #830CE8;

    //.attr("x", viewerXPos)
    //.attr("y", viewerYPos);




//for fixed total timeline on side...removed for now
/*var sideAxisDiv = document.createElement("div");
    sideAxisDiv.setAttribute("class","sideAxisDiv");
    sideAxisDiv.style.height = height;
  document.body.appendChild(sideAxisDiv);*/

//d3, line element that uses 'linePoints' array (above) to build main 'timeline' line
var timeline = d3.svg.line()
  .x(function(d){return d.x;})
  .y(function(d){return d.y;})
  .interpolate("linear");
/*
//function used to limit the year to last two digits..taken out for right now
function checkDate(date){
  date = date.toString();
  var dateLength = date.toString().length;

  if(dateLength > 2){
    return date.slice(1,3);
  }
  return date;
}*/

//creates single div to hold event text and pics, appends to DOM
var textHolder = document.createElement("div");
    textHolder.setAttribute("class","text-holder");
    textHolder.style.width = (width * 0.7) + "px";
    textHolder.style.height = (height + 6) + "px";

/*
//creates text and img elements to hold event pic and text, and appends both to 'textHolder' div (above)..taken out for now
var pic = document.createElement("img");
    pic.setAttribute("class","picture");
    pic.setAttribute("id","pic");
    pic.style.opacity = 0; //default state is hidden until user interacts with page
    pic.style.width = (width * 0.6) + "px";*/

var para = document.createElement("p");
    para.setAttribute("class","text");
    para.setAttribute("id","p");
    para.style.opacity = 0; //default state is hidden until user interacts with page

//textHolder.appendChild(pic);//append pic <img> to holder div...see above
textHolder.appendChild(para);//append para <p> to holder div
document.body.appendChild(textHolder);//append holder div to body element

console.log(width - (width * 0.7));
console.log((width - (width * 0.7))/18);
console.log((width - (width * 0.7))/(9/8));

//
//end pre-json js
//

//
//import json and create elements that need to reference the json
//

//array of objects for each school event. holds a description ("event"), a date ("date"), and an associated picture ("pic")
d3.json("data/data.json", function(error, data){
  if(error) return console.log(error);

  var totalHeight = document.documentElement.clientHeight * (data.length/2.5);//height of main timeline determined with "totalHeight"

  //saves earliest and latest dates (based on order in array)
  var xLow = new Date(data[0].date),
      xHigh = new Date(data[(data.length)-1].date);

  //d3, time scale for event placement on timeline
  var yScale = d3.time.scale()
    .domain([xLow, xHigh])//uses saved earliest and latest dates (above) to determine range of scale
    .range([padding, totalHeight - padding]);//determines how far first and last event are to screen edge w/ 'padding' variable (above)

  /*var yScaleSide = d3.time.scale()
    .domain([xLow, xHigh])
    .range([padding/5,totalHeight]);*/

  var  yScaleSideAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(d3.time.years, 1);

  //array of coordinates used to build the main 'timeline' line, which runs the entire lenght of the screen
  var linePoints = [
    {"x": width/1.175, "y": 0},
    {"x": width/1.175, "y": totalHeight}
  ];

  //d3, svg element which is the size of the body that holds all generates svg
  var svg = d3.select("body")
    .append("svg")
    .attr("class","svg")
    .attr("width", width)
    .attr("height", totalHeight);

  //creates and appends the main 'timeline' line
  svg.append("g")
    .attr("class","timeline_path")
    .style("transform", "translate(" + timelineXPos + "px,0px)")
    //.attr("d", timeline(linePoints))
    .call(yScaleSideAxis);

    //.attr("stroke", "rgba(90,90,90,1)")
    //.attr("stroke-width", 2)
    //.attr("fill", "none");

  /*var sideScale = d3.select(".sideAxisDiv")
   .append("svg")
    .attr("width","50px")
    .attr("height",height)
   .append("g")
    .attr("class","sideScale_container")
    .style("transform", "translate(50px,0px)")
    .call(yScaleSideAxis);

  d3.selectAll(".tick text")
    .style("font-size","65%")
    .attr("dy",".30em");*/

  //creates circle for every data point and g to enclose them all
  var circles = svg.append("g") //group to hold all circles
    .selectAll(".circle")
    .data(data) //binds data (above) to elements
    .enter()
   .append("circle") //creates circle for every object in data array
    .attr("class", "circle")
    .attr("cx", width/1.225) //sets x position of circle
    .attr("cy", function(d){return yScale(new Date(d.date));}) //sets y position (based on date of object in data)
    .attr("r", circleDimensions/10)
    .attr("stroke", "#0099CC")
    .attr("stroke-width", 1)
    .attr("fill", "#0099CC");

  var points = []; //array to be filled with top and bottom coordinates of every circle, used in [verticle_touch.js]
  var cHolder = circles[0]; //variable to hold d3 array to simplify syntax below
  //fills points array with top and bottom coordinates of every circle
  for(var i = 0; i < cHolder.length; i++){
    points.push({
      "top": parseInt(cHolder[i].getAttribute("cy")) - parseFloat(cHolder[i].getAttribute("r")), //get center of circle and subtract radius to find top point, add to points[]
      "bottom": parseInt(cHolder[i].getAttribute("cy")) + parseFloat(cHolder[i].getAttribute("r")) //get center of circle and add radius to find bottom point, add to points[]
    });
  }

/*
  //creates year text node for every data point and g to enclose them all
  var yearTextG = svg.append("g") //group for year texts, used in [verticle_touch.js]
    .selectAll(".yearText")
    .data(data) //binds data (above) to elements
    .enter().append("text")
    .attr("class","yearText")
    .attr("x", width/1.175 - 20) //sets x position of year text, moved slightly to fit in circle
    .attr("y", function(d){return yScale(new Date(d.date)) + 11;}) //sets y position of year text (based on date of object in data) moved slightly to fit in circle
    .attr("fill", "gray")
    .text(function(d){
      return new Date(d.date).getYear() + 1900; //gets date from data object and converts into date object, concatenates single quote for year notation (ex. '82)
    });
*/

  //
  //start touch and and scroll interactive js (previously touch.js)
  //

  /*
  //select all circles and bind touch event listener which scrolls them to the middle of the screen..taken out for now
  svg.selectAll(".circle")
    .on("touchstart", function(){
      var pos = circles[0].indexOf(this), //index of clicked element in array of circle elements
        elementTop = points[pos].top, //gets top coordinate of element from array in [verticle.html] that was created when the elements were
          elementBottom = points[pos].bottom, //gets bottom coordinate of element from array in [verticle.html] that was created when the elements were
          elementCenter = (((elementTop + elementBottom)/2) - ((height)/2)); //finds middle coordinate of element

      $( 'html, body' ).animate({scrollTop: elementCenter}, 500);
    });
  */

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

  //sees if circle elements are within certain bounds
  function isScrolledIntoView(){
    var badCounter = 0,                         //counter to see if all circle elements are out of bounds
        bodyScroll = $( "body" ).scrollTop(),   //jquery, how far page has been scrolled
        d3Circle,                               //
        element,                                //circle element being checked
        elementTop,                             //element top coordinate relative to scroll amound
        elementBottom;                          //element bottom coordinate relative to scroll amound


    for(var i = 0; i < circles[0].length; i++){
      element = circles[0][i];
      elementTop = points[i].top - bodyScroll;
      elementBottom = points[i].bottom - bodyScroll;

      d3Circle = d3.select(element);

      if(elementBottom >= viewerTop && elementTop <= viewerBottom){
        d3Circle.transition().attr("stroke", "black");
        showTP(i);
      }else{
        d3Circle.transition().attr("stroke","#0099CC");
        badCounter === data.length - 1 ? hideTP() : false; //***checks to see if all circles are out of bounds
        badCounter++;
      }
    }
  }

  //var picElement = d3.select("#pic"), picElement = picElement[0][0];
    var textElement = d3.select("#p"), textElement = textElement[0][0];

  //selects corresponding DOM text and picture objects using passed position and displays them
  function showTP(pos){
    var picObject = data[pos].pic,
        textObject = data[pos].description;

    makeYearText(pos);

    textElement.innerHTML = textObject;

    textElement.style.opacity = 1;
  }

  function makeYearText(pos){
    var yearText = d3.select(".viewer-svg").selectAll("text")
      .data([data[pos]]);

    yearText.text(function(d){return new Date(d.date).getYear() + 1900;});

    yearText.enter().append("text")
      .attr("x", viewerWidth / 12)
      .attr("y", viewerHeight - (viewerHeight / 4))
      .text(function(d){return new Date(d.date).getYear() + 1900;});
  }

  //selects correspoinding DOM text and picture objects using passed position and hides them
  function hideTP(){
    if(textElement){
      textElement.style.opacity = 0;
      deleteYearText();
    }
  }

  function deleteYearText(){
    var d3Viewer = d3.select(".viewer-svg");
    d3Viewer.selectAll("text")
      .remove();
  }

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
      d3.select(this).attr("id", null);
    });

    buttonNext.on("touchstart", function(){
      d3.select(this).attr("id", "active");
      var elementCenterB = goPrevNext(1);
      $( 'html, body' ).animate({scrollTop: elementCenterB - height/2}, 500);
    });

    buttonNext.on("touchend", function(){
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
        }else if(a == circles[0].length -1){
          return elementCenterA;
        }
      }
    }
  }

  scrollCheck(); //starts reoccuring, time-delayed function (above)

  //
  //end touch and scroll interactive js (prevously touch.js)
  //
});

//
//end json import anonymous function
//


