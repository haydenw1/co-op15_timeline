function createButtons(){
  var buttonNav = d3.select(".button.nav"); //button that shows nav
  var buttonHelp = d3.select(".button.help");
  var buttonNavWidth = buttonNav.style("width");

  $( ".button img" ).innerWidth(buttonNavWidth);

  buttonNav.style("height", buttonNavWidth);
  buttonHelp.style("height", buttonNavWidth);

  buttonNav.on("touchstart", function(){d3.select(this).attr("id", "active");})
           .on("touchend",   function(){d3.select(this).attr("id", null);});

  buttonHelp.on("touchstart", function(){d3.select(this).attr("id", "active");})
            .on("touchend",   function(){d3.select(this).attr("id", null);});
}
