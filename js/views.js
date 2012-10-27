var sh = sh || {};

sh.views.MainView = Backbone.View.extend({

	className: "list",

	events: {
		"click .addSplitBtn": "add",
	},

	render: function() {

	},

	add: function () {
		$(this.openingMsg).hide("fast");
	}

});

sh.views.PersonView = Backbone.View.extend({

	className: "li",

	events: {
		"click .addSplitBtn": "add",
	},

	render: function() {

	},

	add: function () {
		$(this.openingMsg).hide("fast");
	}

});