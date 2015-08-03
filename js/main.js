var timeline = {

  //An object that stores d3 'tools' that are reuseable between functions
  //(i.e d3 scales, axises, etc.)
  d3tools: {},

  //An object that stores DOM elements that are used between functions
  elements: {},

  //An object that stores dimensions and coordinates that functions use to
  //positions and resize elements dynamically based on screen size of device
  measurements: {},

  //A specific object to hold dimensions and positioning values of the polygon
  //'viewer', seperated from the measurements object due to its unique amount
  //of points and coordinates needed to contruct it
  viewer: {},



  /**
   * setUp
   *   file to start constructions of the timeline elements
   *
   * -called by:
   *   index.html
   *
   * +calls:
   *   buttons.createButtons,
   *   timeline.makeViewer,
   *   timeline.makeTextHolder,
   *   timeline.useData,
   *   timeline.bindEventsAndCall,
   *   timeline.onReady
   */
  setUp: function(){
    var tM = timeline.measurements; // var to make property assignments of the measurements object more readable
    var tV = timeline.viewer;       // var to make property assignments of the viewer object more readable

    tM.width = document.documentElement.clientWidth;
    tM.height = document.documentElement.clientHeight;
    tM.padding = document.documentElement.clientHeight/2; //padding that determines where timeline axis stops
    tM.textHolderWidth = tM.width * 0.7;
    tM.rightSpace = tM.width - (tM.width * 0.7);
    tM.circleRadius = tM.rightSpace * (7 / 120);
    tM.timelineXPos = tM.width * (15.5 / 16);

    tV.width = tM.rightSpace;
    tV.height = tV.width / 3;
    tV.xPos = (tM.timelineXPos - 1.5) - tV.width;
    tV.yPos = (tM.height / 2) - (tV.height / 2);
    tV.overhang = tM.textHolderWidth - tV.xPos;
    tV.bottom = tV.yPos + tV.height;
    tV.top = tV.yPos;

    timeline.makeViewer();
    timeline.makeTextHolder();

    timeline.useData();

    buttons.createButtons();

    timeline.bindEventsAndCall();
    timeline.onReady();
  },



  /**
   * makeViewer
   *   Constructs the viewer svg that gets filled in with the year of events when
   *   they are navigated to on the timeline.
   *
   * -called by:
   *   timeline.setUp
   */
  makeViewer: function(){
    var height = timeline.viewer.height;
    var overhang = timeline.viewer.overhang;
    var width = timeline.viewer.width;
    var xPos = timeline.viewer.xPos;
    var yPos = timeline.viewer.yPos;

    var viewerLineData = [                   //coordinate points to construct viewer path
      { "x": 0, "y": 0},
      { "x": width * (5 / 6), "y": 0},
      { "x": width, "y": height/2},
      { "x": width * (5 / 6), "y": height},
      { "x": 0, "y": height},
      { "x": 0, "y": 0}
    ];

    var viewerBackLineData = [                 //coordinate points to construct small addition path for style purposes
      { "x": 0, "y": height},
      { "x": overhang, "y": height},
      { "x": overhang, "y": height + overhang}
    ]

    var viewerLine = d3.svg.line()
      .x(function(d){ return d.x;})
      .y(function(d){ return d.y;})
      .interpolate("linear");

    var viewerSvg = d3.select("body")      //main svg that will hold viewer polygon paths
      .append("svg")
        .attr("class","viewer-svg")        //*viewer svg CSS CLASS*
        .attr("width", width)
        .attr("height", height + overhang)
        .attr("fill","black")
        .style("position", "fixed")
        .style("left", xPos)
        .style("top", yPos)

    viewerSvg.append("path")                  //uses 'viewerLine' and 'viewerLineData' to make main polygon path and append to svg
      .attr("d", viewerLine(viewerLineData))
      .attr("stroke-width","0px")
      .attr("fill","#e84a0c");

    viewerSvg.append("path")                     //uses 'viewerLine' and 'viewerBackLineData' to make small polygon path and append to svg
      .attr("d", viewerLine(viewerBackLineData))
      .attr("stroke-width","0px")
      .attr("fill","#333333");
  },



  /**
   * makeTextHolder
   *   Creates <div> and <p> to hold event texts and appends both to DOM
   *
   * -called by:
   *   timeline.setUp
   */
  makeTextHolder: function(){
    var height = timeline.measurements.height;
    var width = timeline.measurements.textHolderWidth;
    var textHolder = document.createElement("div");
    var para = document.createElement("p");

    textHolder.setAttribute("class","text-holder"); //*div CSS Class*
    textHolder.style.width = width + "px";
    textHolder.style.height = height + "px";

    para.setAttribute("class","text"); //*p CSS Class*
    para.setAttribute("id","p");
    para.style.opacity = 0;            //default state is hidden until user interacts with page

    textHolder.appendChild(para);
    document.body.appendChild(textHolder);
  },



  /**
   * useData
   *   Introduces data object and sets measurement values that need information
   *   from the data object. (This would be where AJAX call would be if used)
   *
   * -called by:
   *   timeline.setUp
   *
   * +calls:
   *   timeline.makeSvg
   */
  useData: function(){
    var data = timeline.data;

    timeline.measurements.totalHeight = document.documentElement.clientHeight * (data.length / 2.5); //sets total height of timeline vis based on data object length
    timeline.measurements.earliest = new Date(data[0].date);                                         //gets earliest date in data object (first event object)
    timeline.measurements.latest = new Date(data[(data.length) - 1].date);                           //gets latest date in data object (last event object)

    timeline.makeSvg();
  },



  /**
   * makeSvg
   *   Creates main svg that holds timeline path and timeline elements
   *
   * -called by:
   *   timeline.useData
   *
   * +calls:
   *   timeline.makeTimeline
   */
  makeSvg: function(){
    var totalHeight = timeline.measurements.totalHeight;
    var width = timeline.measurements.width;

    timeline.elements.svg = d3.select("body") //svg element which is the size of the body that holds all generates svg elements besides the viewer
      .append("svg")
        .attr("class","svg")          //*main svg CSS class*
        .attr("width", width)
        .attr("height", totalHeight);

    timeline.makeTimeline();
  },



  /**
   * makeTimeline
   *   Makes main timeline path and date ticks and appends them to main svg
   *
   * -called by:
   *   timeline.makeSvg
   *
   * +calls:
   *   timeline.makeCircles
   */
  makeTimeline: function(){
    var circleRadius = timeline.measurements.circleRadius;
    var earliest = timeline.measurements.earliest;
    var latest = timeline.measurements.latest;
    var padding = timeline.measurements.padding;
    var svg = timeline.elements.svg;
    var tickSize = timeline.measurements.rightSpace / 5;   //calculates ticksize of timeline axis based off size of right space
    var timelineX = timeline.measurements.timelineXPos;
    var totalHeight = timeline.measurements.totalHeight;

    var yScale = timeline.d3tools.yScale = d3.time.scale() //time scale for year event placement on timeline. Saved in 'd3tools' because it is used again in [timeline.makeCircles] to place circle points
      .domain([earliest, latest])
      .range([padding, totalHeight - padding]);

    var yScaleSideAxis = timeline.d3tools.yScaleSideAxis = d3.svg.axis() //makes main timeline path into an axis
      .scale(yScale)
      .orient("left")
      .ticks(d3.time.years, 1)                                           //determines spacing of ticks on timeline axis
      .innerTickSize(tickSize);                                          //determines length of ticks on timeline axis

    svg.append("g")                                             //creates and appends the main 'timeline' path to main svg
      .attr("class","timeline-path")                            //*timeline path CSS class*
      .style("transform", "translate(" + timelineX + "px,0px)")
      .call(yScaleSideAxis);

    d3.selectAll(".tick text")                 //dynamically resizes the tick text
      .style("font-size", circleRadius * 2.5);

    timeline.makeCircles();
  },



  /**
   * makeCircles
   *   Makes circles for every timeline event and appends them to the main svg,
   *   and adds y position to timeline.circleCY
   *
   * -called by:
   *   timeline.makeTimeline
   */
  makeCircles: function(){
    var circleCY = timeline.measurements.circleCY = [];    //array to hold y center position of all circle elements on screen. Saved in 'measurements' because it is used in [timeline.isScrolledIntoView] and [timeline.goWhere]
    var circleRadius = timeline.measurements.circleRadius;
    var data = timeline.data;
    var svg = timeline.elements.svg;
    var timelineX = timeline.measurements.timelineXPos;
    var yScale = timeline.d3tools.yScale;

    var circles = timeline.elements.circles = svg
      .append("g")
        .selectAll(".circle")
        .data(data)
        .enter()
      .append("circle")
        .attr("class", "circle")                                             //*circle element CSS class*
        .attr("cx", timelineX)                                               //sets x position of circle elements so they are on the timeline path
        .attr("cy", function(d){return d3.round(yScale(new Date(d.date)));}) //sets y position of circle elements (based on date of object in data)
        .attr("r", circleRadius)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("fill", "#bbbbbc");

    for(var i = 0; i < circles[0].length; i++){                  //pushes all center y points of the circle elements into array
      circleCY.push(parseInt(circles[0][i].getAttribute("cy")));
    }
  },



  /**
   * bindEventsAndCall
   *   Binds 'touchmove' listener to html DOM element that calls isScrolledIntoView
   *   function if fired
   *
   * -called by:
   *   timeline.setUp
   *
   * +calls:
   *   timeline.isScrolledIntoView
   */
  bindEventsAndCall: function(){
    d3.select("html").on("touchmove",function(){
      timeline.isScrolledIntoView();
    });

    timeline.isScrolledIntoView();
  },



  /**
   * isScrolledIntoView
   *   Anytime the user touches the screen and moves the timeline position this
   *   function is called. It checks to see if any of the circle event elements
   *   are now positioned within the bounds of the viewer. Circle elements are
   *   are animated and other functions are then called to hide or show text
   *   descriptions associated with and event. Called every 250 ms due to momentum
   *   scrolling on touch screen devices.
   *
   * -called by:
   *   timeline.bindEventsAndCall,
   *   timeline.onReady
   *
   * +calls:
   *   timeline.showText,
   *   timeline.hideText
   */
  isScrolledIntoView: function(){
    var circleCY = timeline.measurements.circleCY;
    var circleRadius = timeline.measurements.circleRadius;
    var circles = timeline.elements.circles;
    var data = timeline.data;
    var viewerBottom = timeline.viewer.bottom;
    var viewerHeight = timeline.viewer.height;
    var viewerTop = timeline.viewer.top;
    var viewerWidth = timeline.viewer.width;

    var badCounter = 0;                       //counter to see if all circle elements are out of bounds
    var bodyScroll = $( "body" ).scrollTop(); //jquery sees how far page has been scrolled
    var d3Circle;                             //circle element being checked
    var elementCenter;                        //center y coordinate of the element being checked

    for(var i = 0; i < circles[0].length; i++){ //goes through all circle elements
      d3Circle = d3.select(circles[0][i]);
      elementCenter = circleCY[i] - bodyScroll;

      if(elementCenter >= viewerTop && elementCenter <= viewerBottom){ //checks to see if any of the circle's centers are between the top or bottom of the viewer
        d3Circle.transition()                                          //animation effects for circle within the bounds
          .ease("elastic")
          .attr("r", circleRadius * 2.38)
          .attr("fill","#00adee");

        timeline.showText(i); //calls function to display event description associated with the circle element
      }else{                        //if circle isnt within bounds
        d3Circle.transition()       //animation effects for circles without of bounds
          .ease("elastic")
          .attr("r", circleRadius)
          .attr("fill","#bbbbbc");

        if(badCounter === data.length - 1){ //if all the way through elements and none within bounds
          timeline.hideText();              //calls function to hide displayed description text
        }

        badCounter++; //counter to make sure we checked all the circles before hiding the description text
      }
    }
  },



  /**
   * showText
   *   Selects <p> with id='p' from the DOM and adds the description of the circle
   *   element that is attached to this element in the main data object, and changes
   *   the opacity of the text so it is visible
   *
   * @param pos {number} - Position of circle element in the circle array that is within the bounds of the viewer svg
   *
   * -called by:
   *   timeline.isScrolledIntoView
   *
   * +calls:
   *   timeline.makeYearText
   */
  showText: function(pos){
    var data = timeline.data;
    var textElement = document.getElementById("p");
    var textObject = data[pos].description;         //gets the events associated description

    textElement.innerHTML = textObject;
    textElement.style.opacity = 1;      //makes text element visible

    timeline.makeYearText(pos);
  },



  //selects correspoinding DOM text and picture objects using passed position and hides them
  /**
   * hideText
   *   Selects <p> with id='p' from the DOM and changes the opacity of the text
   *   so that it is no longer visible. **DOESN'T DELETE THE INNER HTML OF <p>**
   *
   * -called by:
   *   timeline.isScrolledIntoView
   *
   * +calls:
   *   timeline.deleteYearText
   */
  hideText: function(){
    var textElement = document.getElementById("p");

    if(textElement){
      textElement.style.opacity = 0; //makes text element not visible

      timeline.deleteYearText();
    }
  },



  /**
   * makeYearText
   *   When a circle is scrolled into view this function displays the year of that
   *   event within the viewer
   *
   * @param pos {number} - Position of circle element in the circle array that is within the bounds of the viewer svg
   *
   * -called by:
   *   timeline.showText
   */
  makeYearText: function(pos){
    var data = timeline.data;
    var viewerHeight = timeline.viewer.height;
    var viewerWidth = timeline.viewer.width;
    var yearText = d3.select(".viewer-svg").selectAll("text")
      .data([data[pos]]);

    yearText.text(function(d){return new Date(d.date).getYear() + 1900;});

    yearText.enter()
      .append("text")
        .attr("x", viewerWidth / 10)
        .attr("y", viewerHeight - (viewerHeight / 4))
        .attr("fill", "white")
        .style("font-size", (viewerHeight - (viewerHeight / 8)) + "px")
        .style("text-shadow","2px 3px 4px rgba(0,0,0,.5)")
        .text(function(d){return new Date(d.date).getYear() + 1900;});
  },



  /**
   * deleteYearText
   *   selects text element within the viewer svg and removes it
   *
   * -called by:
   *   timeline.hideText
   */
  deleteYearText: function(){
    var d3Viewer = d3.select(".viewer-svg");

    d3Viewer.selectAll("text")
      .remove();
  },



  /**
   * onReady
   *   jquery function that waits until the DOM is completed and ready, then
   *   calls function to set up standard buttons and specific timeline buttons,
   *   and then sets jquery setInterval function to call isScrolledIntoView every
   *   250 ms due to momentum scrolling from touch devices.
   *
   * -called by
   *   timeline.setUp
   *
   * +calls
   *   timeline.createTimelineButtons
   *   timeline.isScrolledIntoView
   */
  onReady: function(){
    $( document ).ready(function(){
        timeline.createTimelineButtons();
        setInterval(function(){           //starts reoccuring, time-delayed function call
          timeline.isScrolledIntoView();
        }, 250);                          //time between reoccuring calls
    });
  },



  /**
   * createTimelineButtons
   *   Creates specific timeline buttons that controls navigation between previous
   *   and next events and adds them to the DOM
   *
   * -called by
   *   timeline.onReady
   *
   * +calls
   *   timeline.goPrevNext
   */
  createTimelineButtons: function(){
    var buttonNavWidth = d3.select(".button.nav").style("width"); //button that shows nav, width set by CSS
    var buttonNext = d3.select(".button.next");
    var buttonPrev = d3.select(".button.prev");

    $( ".button img" ).innerWidth(buttonNavWidth); //used to set .png image width until I get properly sized icon images

    buttonPrev.style("height", buttonNavWidth); //sets height to be equal to dynamic width of buttons so that it is a circle
    buttonNext.style("height", buttonNavWidth);

    buttonPrev.on("touchstart", function(){
                                  timeline.goPrevNext(this, 0); //0 for prev
                                })
              .on("touchend",   function(){
                                  d3.select(this).attr("id", null); //returns button element appearance to normal from CSS id applied on 'touchstart'
                                });

    buttonNext.on("touchstart", function(){
                                  timeline.goPrevNext(this, 1); //1 for next
                                })
              .on("touchend",   function(){
                                  d3.select(this).attr("id", null); //returns button element appearance to normal from CSS id applied on 'touchstart'
                                });
  },



  /**
   * goPrevNext
   *   gets the event element that is either directly before or directly after the
   *   bounds of the viewer element (with goWhere) and scrolls to this point using
   *   jquery.
   *
   * @param button {object} ---- The button that was pressed
   * @param direction {number} - The direction you want to move, based on button pushed (0 for prev, 1 for next)
   *
   * -called by
   *   timeline.createTimelineButtons
   *
   * +calls
   *   timeline.goWhere
   */
  goPrevNext: function(button, direction){
    var height = timeline.measurements.height;
    var elementCenter = timeline.goWhere(direction); //determines which element to scroll to with 'goWhere'

    d3.select(button).attr("id", "active");
    $( 'html, body' ).animate({scrollTop: elementCenter - height/2}, 500); //jquery scrolls to center of event element
  },

  /**
   * goWhere
   *   Loops through circle elements and returns an element the 'goPrevNext' uses
   *   to scroll to that element. If statements compare center y coordinates of
   *   circle elements to the top or bottom edge of the viewer object to determine
   *   which elements to return.
   *
   * @param  direction {number} - The direction you want to move, based on button pushed (0 for prev, 1 for next)
   *
   * -called by
   *   timeline.goPrevNext
   */
  goWhere: function(direction){
    var circleCY = timeline.measurements.circleCY;
    var circles = timeline.elements.circles;
    var viewerBottom = timeline.viewer.bottom;
    var viewerTop = timeline.viewer.top;
    var scrollTop = d3.round($( "body" ).scrollTop() + viewerTop);
    var scrollBottom = d3.round($( "body" ).scrollTop() + viewerBottom);

    for(var i = 0; i < circles[0].length; i++){
      var element = circles[0][i];
      var elementCenter = circleCY[i];

      if(direction === 0 && i > 0 && elementCenter >= scrollTop){ //if 'prev' gets the first circle element that is past the top of the viewer, then returns the element before that
        --i;
        elementCenter = circleCY[i];
        return elementCenter;
      }else{
        if(elementCenter >= scrollBottom){ //if 'next' gets the first circle past the bottom of the viewer, and returns that element
          return elementCenter;
        }else if(i == circles[0].length -1){ //if gone through all the elements stay on last one
          return elementCenter;
        }
      }
    }
  },


  //local data object, update to add or subtract events from the timeline
  data : [
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
  ]
}//end timeline object*******************
