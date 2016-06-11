/*
 * iDol scratch game
 * @author Dolmen Technologies
 * V1.0
 *
 * Use idol-tickets.js to manage tickets game
 */



/**
* Module initialization
* Function called from the app
* @param param context saved by the app
*/
function startModule(param)
{
  //jQuery("#validate button").bind(isMobile?'touchstart':'mousedown',function(){$(this).css("background-position","0 bottom");});
  //jQuery("#validate button").bind(isMobile?'touchend':'mouseup',function(){tickets.sendResults(my_prize_index);});

	if (param) context = param;
	jQuery("body").css("background-image","url("+tickets.uncacheable("param/img/bg.png")+")");
	jQuery("#validate button").css("background-image","url("+tickets.uncacheable("param/img/button.png")+")");

	my_prize_index = tickets.play();
	tickets.displayStatus('#results');

	// Display splash screen
	backToMenu();

	//iDol.output('module_output_event', outputParam);

}

/**
* Module reinitialization
* Function called from the app when the scenario restart for the next customer
* @param param context saved by the app
*/
function reStartModule(param)
{

 my_prize_index = tickets.play();
 tickets.displayStatus('#results');
 $('#validate').slideUp();
 $("#validate button").css("background-position","0 top");

 // Display splash screen
	backToMenu();

	//iDol.output('module_output_event', outputParam);

}
