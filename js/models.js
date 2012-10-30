var sh = sh || {};

sh.models = {};

/*------------------------
    Individual Split
 -------------------------*/
sh.models.BillItem = Backbone.RelationalModel.extend({
    defaults: {
        amount: NaN
    },

    isNull: function () {
        var amount = this.get("amount");
        return isNaN(amount) || amount == 0.0;
    }
});

/*------------------------
 	Person
 -------------------------*/
sh.models.Person = Backbone.RelationalModel.extend({
    
    defaults: {
        name: ''
    },

    relations: [{
        type: Backbone.HasMany,
        key: 'items',
        relatedModel: 'sh.models.BillItem',
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
    	return this.get("items").reduce(function(memo, value) { return memo + value.get("amount"); }, 0.0);
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