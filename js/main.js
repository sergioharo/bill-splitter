$(function()
{
	var app = new sh.router({ 
		container: $("#container"),
		nav: $('.navbar')[0]
	});
	
	Backbone.history.start();
	/* Backbone.history.start({
		pushState: true,
		root: "/~Sergio/bill-splitter/"
	});	*/

	// Hide the address bar!
	setTimeout(function(){
	    //window.scrollTo(0);
	}, 0);
});
