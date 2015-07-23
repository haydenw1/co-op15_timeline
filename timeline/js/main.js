//sets width/height/padding variables for use...height of timeline determined with "totalHeight"
var width = document.documentElement.clientWidth,
  height = document.documentElement.clientHeight,
  padding = document.documentElement.clientHeight/2,

  textHolderWidth = width * 0.7,

  rightSpace = width - (width * 0.7),
  rightSpacePadding = rightSpace / 18,

  circleDimensions = rightSpace * (7 / 8),

  timelineXPos = width * (15.5 / 16),

  viewerWidth = rightSpace,
  viewerHeight = viewerWidth / 3,
  viewerXPos = timelineXPos - viewerWidth,
  viewerYPos = (height / 2) - (viewerHeight / 2),
  viewerTop = viewerYPos,
  viewerBottom = viewerYPos + viewerHeight;

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

//d3, line element that uses 'linePoints' array (above) to build main 'timeline' line
/*var timeline = d3.svg.line()
  .x(function(d){return d.x;})
  .y(function(d){return d.y;})
  .interpolate("linear");*/

//creates single div to hold event text and pics, appends to DOM
var textHolder = document.createElement("div");
  textHolder.setAttribute("class","text-holder");
  textHolder.style.width = (width * 0.7) + "px";
  textHolder.style.height = (height + 6) + "px";

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
//import json and create elements that need to reference the json
//

//array of objects for each school event. holds a description ("event"), a date ("date"), and an associated picture ("pic")
//d3.json("data/data.json", function(error, data){

//local dataset for testing//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var data = [
  {
    "description":"Mark Ellingson, President of the Rochester Athenaeum & Mechanics Institute (RAMI) takes over the Empire State School of Printing located in Ithaca, New York, and it becomes a two-year program.",
    "date":"1/1/1937",
    "pic":"cias.jpg"
  },

  {
    "description":"20 freshman enroll in the program with the first major printing project by the department being the student newspaper, PSIMAR.",
    "date":"1/1/1938",
    "pic":"cias.jpg"
  },

  {
    "description":"Students take over the editorial page of the Democrat and Chronicle for one issue.",
    "date":"1/1/1939",
    "pic":"cias.jpg"
  },

  {
    "description":"Rochester Athenaeum & Mechanics Institute becomes Rochester Institute of Technology.",
    "date":"1/1/1944",
    "pic":"cias.jpg"
  },

  {
    "description":"SPM moves into Clark Building with enrollment dramatically increasing to 136 due to the end of WWII.",
    "date":"1/1/1946",
    "pic":"cias.jpg"
  },

  {
    "description":"First 4-color illustration appears in Student Publication, Rochester Institute of Technology (SPRIT)",
    "date":"1/1/1947",
    "pic":"cias.jpg"
  },

  {
    "description":"RIT and the Lithographic Technical Foundation sponsor a Web Offset Conference and propose a new web press purchase for the school. Gannett Company donates a Teletypesetter system to the School of Printing.",
    "date":"1/1/1948",
    "pic":"cias.jpg"
  },

  {
    "description":"SPRIT changes its name to RIT Reporter.",
    "date":"1/1/1951",
    "pic":"cias.jpg"
  },

  {
    "description":"One-third of seniors major in offset lithography; two-thirds major in letterpress printing. Frank Gannett is presented the prestigious Founders Award for his service to the Institute.",
    "date":"1/1/1952",
    "pic":"cias.jpg"
  },

  {
    "description":"Ellen Eggleton becomes the first woman to receive an Associate of Applied from the School of Printing.",
    "date":"1/1/1953",
    "pic":"cias.jpg"
  },

  {
    "description":"Printing students Carl Nelson and Arthur Borock convince the Athletic Board to adopt the tiger emblem to represent RIT sports.",
    "date":"1/1/1955",
    "pic":"cias.jpg"
  },

  {
    "description":"A section of the Hand Composition Laboratory is dedicated in memoriam to prominent typography, Frederic W. Goudy.",
    "date":"1/1/1961",
    "pic":"cias.jpg"
  },

  {
    "description":"Flexography and gravure printing become part of the curriculum.",
    "date":"1/1/1965",
    "pic":"cias.jpg"
  },

  {
    "description":"New Goss C-38 publication press is installed on the campus.",
    "date":"1/1/1967",
    "pic":"cias.jpg"
  },

  {
    "description":"Melbert B. Cary Jr., Graphic Arts Collection is donated, housing historical and current examples of “fine” printing.",
    "date":"1/1/1969",
    "pic":"cias.jpg"
  },

  {
    "description":"250 freshman enter the program making the total number enrolled an impressive 661 students. MBO folding machine for bindery is donated. Now all major printing processes are represented with up-to-date equipment.",
    "date":"1/1/1977",
    "pic":"cias.jpg"
  },

  {
    "description":"150th Anniversary of RIT",
    "date":"1/1/1978",
    "pic":"cias.jpg"
  },

  {
    "description":"Renovation and rededication of the Cary Graphic Arts Collection is finished.",
    "date":"1/1/1979",
    "pic":"cias.jpg"
  },

  {
    "description":"Labs are updated with $4.2 million in computer equipment.",
    "date":"1/1/1982",
    "pic":"cias.jpg"
  },

  {
    "description":"A SCR-40 Scanning densitometer, a Linotype/Paul scanner, and a Compugraphics typesetter are donated.",
    "date":"1/1/1983",
    "pic":"cias.jpg"
  },

  {
    "description":"Cary Library no longer has a “look but don’t touch” policy and is open for use.",
    "date":"1/1/1984",
    "pic":"cias.jpg"
  },

  {
    "description":"The newspaper production lab that supported the degree program, News Paper Operations Management, begins using a digital page layout system.",
    "date":"1/1/1996",
    "pic":"cias.jpg"
  },

  {
    "description":"New Media courses are first offered as part of SPM curriculum.",
    "date":"1/1/1997",
    "pic":"cias.jpg"
  },

  {
    "description":"The Digital Publishing Center is established, printing student work at RIT.",
    "date":"1/1/1998",
    "pic":"cias.jpg"
  },

  {
    "description":"RIT is selected by the Alfred P. Sloan Foundation to become one of twenty-six Sloan Industry Centers. This center is dedicated to studying major business environment influences in the printing industry.",
    "date":"1/1/2001",
    "pic":"cias.jpg"
  },

  {
    "description":"The Printing Applications Lab at RIT is donated a Sunday 2000 press.",
    "date":"1/1/2005",
    "pic":"cias.jpg"
  },

  {
    "description":"Open Publishing Lab is founded, researching new methods of content creation and developing open source applications for publishing across various media.",
    "date":"1/1/2007",
    "pic":"cias.jpg"
  },

  {
    "description":"75th Anniversary of the School of Print Media.",
    "date":"1/1/2012",
    "pic":"cias.jpg"
  }
];
//end local data for testing//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //if(error) return console.log(error);

  var totalHeight = document.documentElement.clientHeight * (data.length/2.5);

  var xLow = new Date(data[0].date),
    xHigh = new Date(data[(data.length)-1].date);

  //d3, time scale for event placement on timeline
  var yScale = d3.time.scale()
    .domain([xLow, xHigh])
    .range([padding, totalHeight - padding]);

  var yScaleSideAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(d3.time.years, 1)
    .innerTickSize(20);

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
    .call(yScaleSideAxis);

  //creates circle for every data point and g to enclose them all
  var circles = svg
    .append("g") //group to hold all circles
      .selectAll(".circle")
      .data(data) //binds data (above) to elements
      .enter()
    .append("circle") //creates circle for every object in data array
      .attr("class", "circle")
      .attr("cx", timelineXPos) //sets x position of circle
      .attr("cy", function(d){return yScale(new Date(d.date));}) //sets y position (based on date of object in data)
      .attr("r", circleDimensions/15)
      .attr("stroke", "#0099CC")
      .attr("stroke-width", 1)
      .attr("fill", "#0099CC");

  var points = [];
  var cHolder = circles[0];

  for(var i = 0; i < cHolder.length; i++){
    points.push({
      "top": parseInt(cHolder[i].getAttribute("cy")) - parseFloat(cHolder[i].getAttribute("r")),
      "bottom": parseInt(cHolder[i].getAttribute("cy")) + parseFloat(cHolder[i].getAttribute("r"))
    });
  }

  // binds listener to html element that is looking for movement (scrolling with
  // finger)
  d3.select("html").on("touchmove",function(){
    isScrolledIntoView();
  });

  // calls 'isScrolledIntoView' every 1/4 second, necessary because of 'momentum'
  // scrolling on mobile (called at bottom of page)
  function scrollCheck(){
    setTimeout(function(){
      isScrolledIntoView();
      scrollCheck();
    },250);
  }

  //sees if circle elements are within certain bounds
  function isScrolledIntoView(){
    var badCounter = 0,                       //counter to see if all circle elements are out of bounds
      bodyScroll = $( "body" ).scrollTop(),   //jquery, how far page has been scrolled
      d3Circle,                               //
      element,                                //circle element being checked
      elementTop,                             //element top coordinate relative to scroll amound
      elementBottom;                          //element bottom coordinate relative to scroll amound


    for(var i = 0; i < circles[0].length; i++){
      element = circles[0][i],
      elementTop = points[i].top - bodyScroll,
      elementBottom = points[i].bottom - bodyScroll,
      elementCenter = (elementTop + elementBottom) / 2;
      d3Circle = d3.select(element);

      if(elementCenter >= viewerTop && elementCenter <= viewerBottom){
        d3Circle.transition().ease("elastic").attr("r", circleDimensions/6.3);
        showTP(i);
      }else{
        d3Circle.transition().ease("elastic").attr("r", circleDimensions/15);
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

  //selects correspoinding DOM text and picture objects using passed position and hides them
  function hideTP(){
    if(textElement){
      textElement.style.opacity = 0;
      deleteYearText();
    }
  }

  function makeYearText(pos){
    var yearText = d3.select(".viewer-svg").selectAll("text")
      .data([data[pos]]);

    yearText.text(function(d){return new Date(d.date).getYear() + 1900;});

    yearText.enter()
      .append("text")
        .attr("x", viewerWidth / 8)
        .attr("y", viewerHeight - (viewerHeight / 4))
        .attr("fill", "white")
        .style("font-size", "188%")
        .style("text-shadow","2px 2px 2px rgba(0,0,0,.5)")
        .text(function(d){return new Date(d.date).getYear() + 1900;});
  }

  function deleteYearText(){
    var d3Viewer = d3.select(".viewer-svg");
    d3Viewer.selectAll("text")
      .remove();
  }

  $( document ).ready(function(){
    var buttonNav = d3.select(".button.nav"); //button that will turn automatic showing of description and picture off/on
    var buttonPrev = d3.select(".button.prev");
    var buttonNext = d3.select(".button.next");


    buttonNav.on("touchstart", function(){
      d3.select(this).attr("id", "active");
    });

    buttonNav.on("touchend", function(){
      d3.select(this).attr("id", null);
    });

    buttonPrev.on("touchstart", function(){
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
      var scrollTop = $( "body" ).scrollTop() + viewerTop,
        scrollBottom = $( "body" ).scrollTop() + viewerBottom;

        console.log(scrollTop);
        console.log(scrollBottom);
        //console.log(direction);
          //scrollQuarter = scrollCenter - height/4,
          //scrollThreeQuarter = scrollCenter + height/4;

      if(direction === 0){
        for(var i = 0; i < circles[0].length; i++){
          var element = circles[0][i],
          elementTop = points[i].top,
          elementBottom = points[i].bottom,
          elementCenter = ((elementTop + elementBottom)/2);

          console.log(elementCenter);

          if(i > 0 && elementCenter >= scrollTop){
            console.log("going down");
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

          console.log(elementCenterA);

          if(elementCenterA >= scrollBottom){
            console.log("going up!");
            return elementCenterA;
          }else if(a == circles[0].length -1){
            return elementCenterA;
          }
        }
      }
    }
  });

  scrollCheck(); //starts reoccuring, time-delayed function (above)
//});



