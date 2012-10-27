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

    total: function ()
    {
    	return _.reduce(this.splits, function(memo, value) { return memo + value.amount}, 0.0)
    }

    tax: function () {
        return this.total() * this.options.tax;
    }

    tip: function () {
        return this.total() * this.options.tip;
    }
});

/*------------------------
    Person Collection
 -------------------------*/
sh.models.PersonCollection = Backbone.Collection.extend({
    model: sh.models.Person
});