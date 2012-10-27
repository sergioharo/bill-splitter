var sh = sh || {};

sh.views = {
	MainView: Backbone.View.extend({

		render: function() {
			var template = _.template( $("#start_template").html(), {} );
			this.$el.html( template );
		}
		
	}),

	PersonsView: Backbone.View.extend({

		initialize: function () {
		},

		render: function() {
			var template = _.template( $("#search_template").html(), {} );
			this.$el.html( template );
		},

		events: {
			"click .addSplitBtn": "add",
		},

		add: function () {
			$(this.openingMsg).hide("fast");
		}

	}),

	PersonView: Backbone.View.extend({

		events: {
			"click .addSplitBtn": "add",
		},

		render: function() {

		},

		add: function () {
			$(this.openingMsg).hide("fast");
		}

	})
};