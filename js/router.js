var sh = sh || {};

sh.router = Backbone.Router.extend({

    routes: {
        '':             'home',
        'all':          'all',
        'add':          'add',
        'edit/:cid':    'edit',
        'settings':     'settings'
    },

    initialize: function (options) {
        this.container = $(options.container);
        this.collection = new sh.models.PersonCollection();
        this.settings = new sh.models.Settings();
        this.navView = new sh.views.NavView({
            el: options.nav
        });
    },

    changePage: function (view) {
        this.container
                .empty()
                .append(view.render().el);

        var leftNav = view.leftNav ? view.leftNav() : null;
        this.navView.setLeftNav(leftNav);

        var rightNav = view.rightNav ? view.rightNav() : null;
        this.navView.setRightNav(rightNav);
    },

    home: function () {
        var view = new sh.views.MainView({ 
            app: this 
        });
        this.changePage(view);
    },

    all: function () {
        var view = new sh.views.PersonsView({ 
            app: this,
            collection: this.collection
        });
        this.changePage(view);
    },

    add: function () {
        var model = new sh.models.Person({
            settings: this.settings
        });

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
    },

    settings: function () {
        var view = new sh.views.SettingsView({
            app: this,
            model: this.settings
        });
        this.changePage(view);
    }

});