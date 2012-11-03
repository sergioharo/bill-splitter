var sh = sh || {};

sh.models = {};

sh.models.Settings = Backbone.Model.extend({
    defaults: {
        tax: 10,
        tip: 15,
        calculateTipBeforeTax: true
    },

    tax: function (amount) {
        return amount * (this.get('tax') / 100);
    },

    tip: function (amount) {
        if (this.get('calculateTipBeforeTax'))
            return amount * (this.get('tip') / 100);
        else
            return (amount + this.tax(amount)) * (this.get('tip') / 100);
    }
});

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

    },

    subtotal: function ()
    {
    	return this.get("items").reduce(function(memo, value) { return memo + value.get("amount"); }, 0.0);
    },

    tax: function () {
        return this.get('settings').tax(this.subtotal());
    },

    tip: function () {
        return this.get('settings').tip(this.subtotal());
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