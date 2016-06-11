/*
 * iDol Module Parameters
 * @author Dolmen Technologies
 *
 * Contains parameters passed to the module through the context object
 */

var context = moduleContext =
{
  type : 'ticket',
	prizes :
	[
	{
		'id'      : 'LOST',   // Prize id
		'message' : "",       // To request a vendor PIN entry at end of registration. Contains the message to display.
		'number'  : 50        // Number of items to win per day. If not any item remains, first price will occure systematicly
	},
  {
    'id'      : 'WIN',
    'message' : "",
    'number'  : 50
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  },
    {
    'id'      : '',
    'message' : "",
    'number'  : 0
  }
	]
};
