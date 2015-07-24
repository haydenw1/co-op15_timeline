//set width/height/padding variables for use...height of timeline determined with "totalHeight"
function setUp(){
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  var padding = document.documentElement.clientHeight/2;

  var textHolderWidth = width * 0.7;

  var rightSpace = width - (width * 0.7);
  var circleRadius = rightSpace * (7 / 120);

  var timelineXPos = width * (15.5 / 16);

  var viewerWidth = rightSpace;
  var viewerHeight = viewerWidth / 3;
  var viewerXPos = timelineXPos - viewerWidth;
  var viewerYPos = (height / 2) - (viewerHeight / 2);
  var viewerBottom = viewerYPos + viewerHeight;
  var viewerTop = viewerYPos;

  makeViewer(viewerHeight, viewerWidth, viewerXPos, viewerYPos);
  makeTextHolder(height, textHolderWidth);

  //array of objects for each school event. holds a description ("event"), a date ("date"), and an associated picture ("pic")
  //d3.json("data/data.json", function(error, data){
  //  if(error) return console.log(error);

    //sample data for local testing
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
      }
    ];

    var totalHeight = document.documentElement.clientHeight * (data.length/2.5);
    var earliest = new Date(data[0].date);
    var latest = new Date(data[(data.length)-1].date);

    makeSvgAndTimeline(circleRadius, data, earliest, height, latest, padding, rightSpace, timelineXPos, totalHeight, viewerBottom, viewerHeight, viewerTop, viewerWidth, width);

  //ending d3.json bracket
  //});
}

function makeViewer(h, w, x, y){
  var viewerLineData = [
    { "x": 0, "y": 0},
    { "x": w * (3 / 4), "y": 0},
    { "x": w, "y": h/2},
    { "x": w * (3 / 4), "y": h},
    { "x": 0, "y": h},
    { "x": 0, "y": 0}
  ];

  var viewerLine = d3.svg.line()
    .x(function(d){ return d.x;})
    .y(function(d){ return d.y;})
    .interpolate("linear");

  d3.select( "body" )
    .append("svg")
      .attr("class","viewer-svg")
      .attr("width", w)
      .attr("height", h)
      .attr("fill","black")
      .style("position", "fixed")
      .style("left", x)
      .style("top", y)
    .append("path")
      .attr("d",viewerLine(viewerLineData))
      //.attr("stroke","#9F6FE8")
      .attr("stroke-width","0px")
      .attr("fill","#9F6FE8");
}

//creates single div to hold event text and pics, appends to DOM
function makeTextHolder(h, w){
  var textHolder = document.createElement("div");
  var para = document.createElement("p");

  textHolder.setAttribute("class","text-holder");
  textHolder.style.width = w + "px";
  textHolder.style.height = h + "px";

  para.setAttribute("class","text");
  para.setAttribute("id","p");
  para.style.opacity = 0; //default state is hidden until user interacts with page

  textHolder.appendChild(para);//append para <p> to holder div
  document.body.appendChild(textHolder);//append holder div to body element
}

function makeSvgAndTimeline(circleRadius, data, earliest, height, latest, p, rightSpace, timelineX, totalH, viewerBottom, viewerHeight, viewerTop, viewerWidth, w){
  var circleCY = [];

  //d3, time scale for year event placement on timeline
  var yScale = d3.time.scale()
    .domain([earliest, latest])
    .range([p, totalH - p]);

  var yScaleSideAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(d3.time.years, 1)
    .innerTickSize(rightSpace / 5);

  //d3, svg element which is the size of the body that holds all generates svg
  var svg = d3.select("body")
   .append("svg")
    .attr("class","svg")
    .attr("width", w)
    .attr("height", totalH);

  svg.append("g")                   //creates and appends the main 'timeline' line
    .attr("class","timeline-path")
    .style("transform", "translate(" + timelineX + "px,0px)")
    .call(yScaleSideAxis);

  d3.selectAll(".tick text")
    .style("font-size", circleRadius * 2.5);

  //creates circle for every data point and g to enclose them all
  var circles = svg
    .append("g") //group to hold all circles
      .selectAll(".circle")
      .data(data) //binds data (above) to elements
      .enter()
    .append("circle") //creates circle for every object in data array
      .attr("class", "circle")
      .attr("cx", timelineX) //sets x position of circle
      .attr("cy", function(d){return d3.round(yScale(new Date(d.date)));}) //sets y position (based on date of object in data)
      .attr("r", circleRadius)
      .attr("stroke", "#0099CC")
      .attr("stroke-width", 1)
      .attr("fill", "#0099CC");

  for(var i = 0; i < circles[0].length; i++){
    circleCY.push(parseInt(circles[0][i].getAttribute("cy")));
  }

  isScrolledIntoView(circleCY, circleRadius, circles, data, viewerBottom, viewerHeight, viewerTop, viewerWidth);

  // binds listener to html element that is looking for movement (scrolling with finger)
  d3.select("html").on("touchmove",function(){
    isScrolledIntoView(circleCY, circleRadius, circles, data, viewerBottom, viewerHeight, viewerTop, viewerWidth);
  });

  $( document ).ready(function(){
    createButtons(circleCY, circles, height, viewerBottom, viewerTop);
    setInterval(function(){
      isScrolledIntoView(circleCY, circleRadius, circles, data, viewerBottom, viewerHeight, viewerTop, viewerWidth)
    },250); //starts reoccuring, time-delayed function (above)
  });
}

function isScrolledIntoView(circleCY, circleRadius, circles, data, viewerBottom, viewerHeight, viewerTop, viewerWidth){
  var badCounter = 0;                         //counter to see if all circle elements are out of bounds
  var bodyScroll = $( "body" ).scrollTop();   //jquery, how far page has been scrolled
  var d3Circle;
  var element;
  var elementCenter;                          //circle element being checked

  for(var i = 0; i < circles[0].length; i++){
    element = circles[0][i];
    d3Circle = d3.select(element);
    elementCenter = circleCY[i] - bodyScroll;

    if(elementCenter >= viewerTop && elementCenter <= viewerBottom){
      d3Circle.transition()
        .ease("elastic")
        .attr("r", circleRadius * 2.38);
      showTP(data, i, viewerHeight, viewerWidth);
    }else{
      d3Circle.transition().ease("elastic").attr("r", circleRadius);
      badCounter === data.length - 1 ? hideTP() : false; //***checks to see if all circles are out of bounds
      badCounter++;
    }
  }
}

function showTP(data, pos, viewerHeight, viewerWidth){
  var textElement = d3.select("#p"), textElement = textElement[0][0];
  var textObject = data[pos].description;

  makeYearText(data, pos, viewerHeight, viewerWidth);
  textElement.innerHTML = textObject;
  textElement.style.opacity = 1;
}

//selects correspoinding DOM text and picture objects using passed position and hides them
function hideTP(){
  var textElement = d3.select("#p"), textElement = textElement[0][0];

  if(textElement){
    deleteYearText();
    textElement.style.opacity = 0;
  }
}

function makeYearText(data, pos, viewerH, viewerW){
  var yearText = d3.select(".viewer-svg").selectAll("text")
    .data([data[pos]]);

  yearText.text(function(d){return new Date(d.date).getYear() + 1900;});

  yearText.enter()
    .append("text")
      .attr("x", viewerW / 10)
      .attr("y", viewerH - (viewerH / 4))
      .attr("fill", "white")
      .style("font-size", (viewerH - (viewerH / 8)) + "px")
      .style("text-shadow","2px 3px 4px rgba(0,0,0,.5)")
      .text(function(d){return new Date(d.date).getYear() + 1900;});
}

function deleteYearText(){
  var d3Viewer = d3.select(".viewer-svg");

  d3Viewer.selectAll("text")
    .remove();
}

function createButtons(circleCY, circles, height, viewerBottom, viewerTop){
  var buttonNav = d3.select(".button.nav"); //button that shows nav
  var buttonNext = d3.select(".button.next");
  var buttonPrev = d3.select(".button.prev");
  var buttonNavWidth = buttonNav.style("width");

  buttonNav.style("height", buttonNavWidth);
  buttonPrev.style("height", buttonNavWidth);
  buttonNext.style("height", buttonNavWidth);

  buttonNav.on("touchstart", function(){d3.select(this).attr("id", "active");})
           .on("touchend",   function(){d3.select(this).attr("id", null);});

  buttonPrev.on("touchstart", function(){goPrevNext(this, circleCY, circles, height, 0, viewerBottom, viewerTop)})
            .on("touchend",   function(){d3.select(this).attr("id", null);});

  buttonNext.on("touchstart", function(){goPrevNext(this, circleCY, circles, height, 1, viewerBottom, viewerTop)})
            .on("touchend",   function(){d3.select(this).attr("id", null);});
}

function goPrevNext(button, circleCY, circles, height, direction, viewerBottom, viewerTop){
  var elementCenter = goWhere(circleCY, circles, direction, viewerBottom, viewerTop);

  d3.select(button).attr("id", "active");
  $( 'html, body' ).animate({scrollTop: elementCenter - height/2}, 500);
}

function goWhere(circleCY, circles, direction, viewerB, viewerT){
  var scrollTop = d3.round($( "body" ).scrollTop() + viewerT);
  var scrollBottom = d3.round($( "body" ).scrollTop() + viewerB);

  for(var i = 0; i < circles[0].length; i++){
    var element = circles[0][i];
    var elementCenter = circleCY[i];

    if(direction === 0 && i > 0 && elementCenter >= scrollTop){
      --i;
      elementCenter = circleCY[i];
      return elementCenter;
    }else{
      if(elementCenter >= scrollBottom){
        return elementCenter;
      }else if(i == circles[0].length -1){
        return elementCenter;
      }
    }
  }
}

// full local dataset for testing///////////////////////////////////////////////
/*
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
];*/
