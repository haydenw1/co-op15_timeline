
$( document ).ready(function() {
	var $sliderOne = $( '#slideshow-container-one' ),
		$sliderTwo = $( '#slideshow-container-two' ),
		$buttonNav = $( '.button.nav' );

	adobeDPS.Gesture.disableNavigation([$sliderOne[0], $sliderTwo[0]]);

	$buttonNav.attr( "onclick", "toggleNavUi();" );
	//$buttonNav.html( "SHOW NAV" );
});

$toggle = 0;

function toggleNavUi(){
	adobeDPS.Gesture.toggleNavigationUI();
  window.location = "navto://relative/last";
	//$toggle == 0 ? $( ".button.nav" ).html( "NAV!!!" ) && $toggle++ : $( ".button.nav" ).html( "SHOW NAV" ) && $toggle--;
}
