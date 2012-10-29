var sh = sh || {};

sh.router = Backbone.Router.extend({

    routes: {
        '':             'home',
        'all':          'all',
        'add':          'add',
        'edit/:cid':    'edit'
    },

    initialize: function (options) {
        this.container = $(options.container);
        this.collection = new sh.models.PersonCollection();
    },

    changePage: function (view) {
        this.container
                .empty()
                .append(view.render().el);
    },

    home: function () {
        var view = new sh.views.MainView({ 
            app: this 
        });
        this.changePage(view);
    },

    all: function() {
        var view = new sh.views.PersonsView({ 
            app: this,
            collection: this.collection
        });
        this.changePage(view);
    },

    add: function() {
        var model = new sh.models.Person();
        var view = new sh.views.EditPersonView({ 
            app: this,
            collection: this.collection,
            model: model,
            mode: 'add'
        });
        this.changePage(view);
    },

    edit: function (cid) {
        var model = this.collection.getByCid(cid);

        if (!model)
            throw 'the model does not exist';

        var view = new sh.views.EditPersonView({ 
            app: this,
            collection: this.collection,
            model: model,
            mode: 'edit'
        });
        this.changePage(view);
    }

});