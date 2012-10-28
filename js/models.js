var sh = sh || {};

sh.models = {};

/*------------------------
    Individual Split
 -------------------------*/
sh.models.Split = Backbone.RelationalModel.extend({
	amount: 0.0
});

/*------------------------
 	Person
 -------------------------*/
sh.models.Person = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'splits',
        relatedModel: 'sh.models.Split',
        reverseRelation: {
            key: 'person'
        },
    }],

    initialize: function ()
    {
       /* var self = this;
        this.on("add:splits remove:splits update:splits", function ()
        {
            self.trigger("change");
        });*/
    },

    subtotal: function ()
    {
    	return _.reduce(this.splits, function(memo, value) { return memo + value.amount}, 0.0)
    },

    tax: function () {
        return this.subtotal() * .1;//this.options.tax;
    },

    tip: function () {
        return this.subtotal() * .15;//this.options.tip;
    },

    total: function () {
        return this.subtotal() + this.tax() + this.tip();
    }
});

/*------------------------
    Person Collection
 -------------------------*/
sh.models.PersonCollection = Backbone.Collection.extend({
    model: sh.models.Person
});