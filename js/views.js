var sh = sh || {};

sh.views = {
	UpdatingCollectionView: Backbone.View.extend({
		initialize : function(options) {
			_(this).bindAll('add', 'remove');

			if (!options.childViewConstructor) 
				throw "no child view constructor provided";
			if (!options.childViewOptions) 
				throw "no child view tag name provided";

			this._childViewConstructor = options.childViewConstructor;
			this._childViewOptions = options.childViewOptions;

			this._childViews = [];

			this.collection.each(this.add);

			this.collection.bind('add', this.add);
			this.collection.bind('remove', this.remove);
		},

		add : function(model) {
			var options = _.extend(this._childViewOptions, {model : model});
			var childView = new this._childViewConstructor(options);

			this._childViews.push(childView);

			if (this._rendered)
				this.$el.append(childView.render().el);
		},

		remove : function(model) {
			var viewToRemove = _(this._childViews).select(function(cv) { return cv.model === model; })[0];
			this._childViews = _(this._childViews).without(viewToRemove);

			if (this._rendered)
				viewToRemove.$el.remove();
		},

		render : function() {
			var that = this;
			this._rendered = true;

			if(this._childViewOptions.className)
				this.$(this._childViewOptions.className).remove();
			else
				this.$el.empty();

			_(this._childViews).each(function(childView) {
				that.$el.append(childView.render().el);
			});

			return this;
		}
	}),

	MainView: Backbone.View.extend({

		defaults: {
			template: "#start_template"
		},

		initialize: function () {
			_.defaults(this.options, this.defaults);
			Backbone.View.prototype._configure.apply(this, arguments);
		},

		render: function() {
			var template = _.template( $(this.options.template).html(), {} );
			this.$el.html( template );
			return this;
		},
		
		events: {
			"click .btn": "start",
		},

		start: function () {
			this.options.app.navigate("all", {trigger: true});
		}
	}),

	PersonsView: Backbone.View.extend({

		defaults: {
			tagName: "ul",
			className: "people",
			template: "#all_template"
		},

		initialize: function () {
			_.defaults(this.options, this.defaults);
			Backbone.View.prototype._configure.apply(this, arguments);

			this._collectionView = new sh.views.UpdatingCollectionView({
				collection           : this.collection,
				childViewConstructor : sh.views.PersonView,
				childViewOptions    : {
					tagName: 'li',
					className: "person"
				}
			});
		},

		render: function() {
			// render template
			var template = _.template( $(this.options.template).html(), {} );
			this.$el.html( template );

			// render collection view
			this._collectionView.setElement(this.el);
			this._collectionView.render();
			return this;
		},

		events: {
			"click .add": "add",
		},

		add: function () {
			this.options.app.navigate("add", {trigger: true})
		}

	}),

	PersonView: Backbone.View.extend({

		defaults: {
			template: "#person_template"
		},

		initialize: function () {
			_.defaults(this.options, this.defaults);
			Backbone.View.prototype._configure.apply(this, arguments);
		},

		render: function() {
			var template = _.template( $(this.options.template).html(), {person: this.model} );
			this.$el.html( template );
			return this;
		}

	})
};