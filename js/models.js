var sh = sh || {};

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
});

sh.models.PersonCollection = Backbone.Collection.extend({
    model: sh.models.Person
})