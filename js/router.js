var sh = sh || {};

sh.router = Backbone.Router.extend({

    routes: {
        "":     "home",
        "all":  "all",
        "add":  "add"
    },

    initialize: function (options) {
        this.container = $(options.container);
        this.collection = new sh.models.PersonCollection();
    },

    changePage: function (view) {
        view.render();
        this.container.empty().append(view.el);
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
        alert("not implemented yet");
    }

});