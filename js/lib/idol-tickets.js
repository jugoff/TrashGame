/*
 * iDol Tickets Game Library
 * Common function for all games based on tickets
 * @author Dolmen Technologies
 * V1.1.0 - 14/04/15
 *
 * context global variable must be setted
 */

var tickets = new Object(); //Namespace

/**
* Play
* @param prizes : array describing game prizes
* Each entry must have :
* 		'id' : 'GIFT_ID',
*		'image' : "./img/prize-image.png",
*		'message' : "Message to display immediatly at end of subscription with a PIN code to enter. Leave empty otherwise",
*		'number' : 39 //Number of tickets to win
*
* 	First entry must be the losing tickets
*
* 	@return prize index
*/
tickets.play = function()
{
	var prizes = context.prizes;

    // time range
    // Checking the range hour
    if(context.timeRange) {
      var currentDate = new Date();
      var currentTime = currentDate.getHours() + currentDate.getMinutes() / 100;

      var range = context.timeRange;
      // remove spaces, text with dots and parse into a float to get a number
      var start = parseFloat(range.start.replace(/\s+/g, '').replace(/[^\d]/g, '.'));
      var end = parseFloat(range.end.replace(/\s+/g, '').replace(/[^\d]/g, '.'));

      if(currentTime < start || currentTime > end) {
        return 0; // return LOST if it is
      }
    }

	// prize repartition

	var bag = [];
	for (p in  prizes){
		for (i=0;i<prizes[p]['number'];i++){
			// Put each prize index in the bag based on its quantity
			bag.push(p);
		}
	}

	if(bag.length > 0){
		// pick a prize from bag
		var ticket = Math.floor(Math.random()*bag.length);
		return bag[ticket];
	}else{
		// No more prizes in the bag, return the default one
		return 0;
	}
}

/**
* Send results
* Shall be called to send the tickets game results to the app
* @param array describing game prizes
* @param drawn_prize_index index of the prize drawn
*/
/**
* Send results
* Shall be called to send the tickets game results to the app
* @param array describing game prizes
* @param drawn_prize_index index of the prize drawn
*/
tickets.sendResults = function(drawn_prize_index,answers)
{
  // Alter the prizes number based on current prize, if number not 0
  var prize = context.prizes[drawn_prize_index];
  if (prize['number'] > 0) prize['number'] --;
  var param = {
      message : prize['message'],
      winner : drawn_prize_index>0 && prize['message'].length>0,
      misc : prize['id'],
      context : context
  };
  if(answers) param.answers = answers;

  if (tickets.isMobile){
    // Send results
    iDol.output('module_output_event', param);
  }
  else{
    alert("Message remonté :"+prize['message']);
    if(typeof(reStartModule) != 'undefined' ) setTimeout(function(){reStartModule(context)},1000);
  }
}

/**
* Get prize image for given index
* @param index of the prize
*/
tickets.getImage = function(index)
{
	return "./param/img/prizes/prize"+index+".png";
}

/**
* Get prize message for given index
* @param index of the prize
*/
tickets.getMessage = function(index)
{
	return context['prizes'][index]['message'];
}


/**
* Display status on the prizes (on the given DOM element, typically hidden at the bottom right)
* @param jquery selector of the DOM element, ex : '#results'
*/
tickets.displayStatus = function(element_id)
{
	var nb_tickets = 0;
	var text = '';
	for (p in  context['prizes']){
		nb_tickets += context['prizes'][p]['number'];
		text += context['prizes'][p]['number']+'.';
	}

	$(element_id).text(text.slice(0,-1));
}

// Usefful functino for UA dertermination
tickets.isMobile = new RegExp('/iphone|ipad|ipod|android|blackberry/i').test(navigator.userAgent.toLowerCase());

/**
* Function to use on all images URI to avoid UIWebview cache issue
* @param uri original URI
*/
tickets.uncacheable = function(uri)
{
  return uri+'?'+Math.floor((Math.random()*100000));
}
