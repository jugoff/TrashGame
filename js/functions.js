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
	if (param) context = param;
	
	//Do something
	backToMenu();

	iDol.output('module_output_event', outputParam);

}

/**
* Module reinitialization
* Function called from the app when the scenario restart for the next customer
* @param param context saved by the app
*/
function reStartModule(param)
{
	if (param) context = param;
	
	//Do something
	backToMenu();
	
	iDol.output('module_output_event', outputParam);

}

