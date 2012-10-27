var sh = sh || {};

sh.router = Backbone.Router.extend({

    routes: {
        "":     "home",
        "all":  "all",
        "add":  "add"
    },

    initialize: function (options) {

    },

    changePage: function (view) {
        view.render();
        $("#placeholder").empty().append(view.el);
    },

    home: function () {
        var view = new sh.views.MainView({ app: this });
        this.changePage(view);
    },

    all: function() {
        var view = new sh.views.PersonsView({ app: this });
        this.changePage(view);
    },

    add: function() {

    }

});