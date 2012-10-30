var sh = sh || {};

// Extending Backbone prototype so parametrize the _configuration step
// so that we can new properties that should be copied to the object
_.extend(Backbone.View.prototype, {
	_viewOptions: ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'template', 'app'],

	// Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
		if (this.options) options = _.extend({}, this.options, options);
		_.extend(this, _.pick(options, this._viewOptions));
		this.options = options;
    },
});

sh.views = {
	UpdatingCollectionView: Backbone.View.extend({

		tagName: 'ul',
		className: 'collection',

		initialize : function(options) {
			_(this).bindAll('add', 'remove');

			if (!options.childViewConstructor) 
				throw 'no child view constructor provided';

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

		template: '#start_template',

		render: function() {
			var template = _.template( $(this.template).html(), {} );
			this.$el.html( template );
			return this;
		},
		
		events: {
			'click .btn': 'start',
		},

		start: function () {
			this.app.navigate('all', {trigger: true});
		}
	}),

	PersonsView: Backbone.View.extend({

		tagName: 'ul',
		className: 'people',
		template: '#all_template',

		initialize: function () {
			this._collectionView = new sh.views.UpdatingCollectionView({
				collection           : this.collection,
				childViewConstructor : sh.views.PersonView,
				childViewOptions    : {
					tagName: 'li',
					className: 'person',
					app: this.app
				}
			});
		},

		render: function() {
			// render template
			var template = _.template( $(this.template).html(), {} );
			this.$el.html( template );

			// render collection view
			this._collectionView.setElement(this.el);
			this._collectionView.render();
			return this;
		},

		events: {
			'click .add': 'add'
		},

		add: function () {
			this.app.navigate('add', {trigger: true});
		}
	}),

	PersonView: Backbone.View.extend({

		template: '#person_template',

		render: function() {
			var template = _.template( $(this.template).html(), {person: this.model} );
			this.$el.html( template );
			return this;
		},

		events: {
			'click': 'edit'
		},

		edit: function () {
			this.app.navigate('edit/' + this.model.cid, {trigger: true});
		}
	}),

	EditPersonView: Backbone.View.extend({

		className: 'editPerson',
		template: '#edit_person_template',

		initialize: function () {
			_.bindAll(this, ['setupItems']);

			this._items = this.model.get('items');

			this._collectionView = new sh.views.UpdatingCollectionView({
				className: 'items',
				collection: this._items,
				childViewConstructor: sh.views.BillItemView,
				childViewOptions: {
					tagName: 'li',
					className: 'person',
					app: this.app
				}
			});

			this._items.on('change', this.setupItems);
		},

		render: function() {
			this.setupItems();

			var template = _.template( $(this.template).html(), { 
				name: this.model.get('name'),
				mode: this.options.mode
			});
			this.$el.html(template)
					.append(this._collectionView.render().el);

			return this;
		},

		removeEmptyItems: function (exceptFor) {
			var items = this._items;
			var empty = items.filter(function (item) { return item.isNull(); });
			_.each(empty, function (item) { if (item != exceptFor) items.remove(item); });
		},

		setupItems: function () {
			var lastItem = this._items.last();
			this.removeEmptyItems(lastItem);

			if (!lastItem || !lastItem.isNull() )
				this._items.add(new sh.models.BillItem());
		},

		events: {
			'change .nameInput': 'nameChanged',
			'click .cancel': 'cancel',
			'click .save': 'save'
		},

		nameChanged: function () {
			this.model.set('name', this.$('.nameInput').val());
		},

		cancel: function () {
			if (this.options.mode == 'edit')
				this.removeEmptyItems();
			this.app.navigate('all', {trigger: true});
		},

		save: function () {
			if (this.options.mode == 'add' && this.model.get('name'))
				this.collection.add(this.model);

			this.removeEmptyItems();
			this.app.navigate('all', {trigger: true});
		}
	}),

	BillItemView: Backbone.View.extend({

		template: '#item_template',
		tagName: 'li',
		className: 'bill-item',

		render: function() {
			var template = _.template( $(this.template).html(), { val: this.getDisplayAmount() } );
			this.$el.html( template );
			return this;
		},

		events: {
			'focus .amtInput': 'amountFocused',
			'blur .amtInput': 'amountBlurred',
			'keydown .amtInput': 'amountChanged'
		},

		getDisplayAmount: function (isFocused) {
			if (this.model.isNull())
			{
				if (isFocused)
					return '0.00';
				else
					return '';
			}
			return this.model.get('amount').toFixed(2);
		},

		amountFocused: function () {
			this.$('.amtInput').val(this.getDisplayAmount(true));
		},

		amountBlurred: function () {
			this.$('.amtInput').val(this.getDisplayAmount());
		},

		amountChanged: function (e) {
			var amnt = this.$('.amtInput').val();
			var val = NaN;

			if (e.keyCode == 8) // backspace
			{
				amnt = amnt.slice(0, -1);
				var val = parseFloat(amnt) / 10.0;
			}
			else if (e.keyCode >= 48 && e.keyCode <= 57)
			{
				amnt += String.fromCharCode(e.keyCode);
				var val = parseFloat(amnt) * 10.0;
			}

			this.model.set('amount', val);
			this.$('.amtInput').val(this.getDisplayAmount(true));
			return false;
		},

	})
};