/*global define*/

define([
    'jquery',
    'backbone',
    'views/home',
    'views/newsList',
    'collections/newsList',
    'models/article',
    'views/article',
    'collections/graphTimeseries',
    'views/navbar',
    'views/register',
    'views/login',
    'models/user'
    ], function ($, Backbone, HomeView, NewsListView, NewsListCollection,
        ArticleModel, ArticleView, GraphTimeseriesCollection, NavbarView,
    RegisterView, LoginView, UserModel) {
        'use strict';

        var ApplicationRouter = Backbone.Router.extend({

            routes: {
                '':'home',
                'newsList?*querystring':'newsList',
                'newsList': 'newsList',
                'login': 'login',
                'register': 'register',
                'article/:id': 'article'
            },

            initialize: function() {
                if(!this.sessionUser)
                    this.sessionUser = new UserModel();
                this.on('route',this.afterAllRoute);
            },

            afterAllRoute: function(routeName) {
                if(routeName === 'home'){
                    if(this.navbarView){
                        this.navbarView.close();
                        delete this.navbarView;
                    }
                }
                else {
                    if(!this.navbarView){
                        this.navbarView = new NavbarView();
                    }
                    var searchInput = this.parseQueryString(this.lastNewsListQueryString);
                    this.navbarView.setSearchInput(searchInput.search);
                }
            },

            home: function() {
                this.loadView(new HomeView());
            },

            login: function() {
                //this.sessionUser.getLoggedUser();
                this.loadView(new LoginView({model:this.sessionUser}));
            },

            register: function() {
                this.loadView(new RegisterView());
            },

            article: function(id){
                this.lastArticleModel = new ArticleModel({'id': id});
                if(id){
                    this.loadView(new ArticleView({model:this.lastArticleModel}));
                }
            },

            newsList: function(querystring) {
                var newQuery = (querystring != this.lastNewsListQueryString);
                this.lastNewsListQueryString = querystring;

                if(newQuery){
                    var query = this.parseQueryString(querystring);
                    query.pagenumber = 1;
                    this.newsListCollection = new NewsListCollection();
                    this.graphTimeseriesCollection = new GraphTimeseriesCollection();
                    this.newsListView = new NewsListView({
                        parameters:query,
                        collection: this.newsListCollection,
                        graphTimeseriesCollection: this.graphTimeseriesCollection
                    })
                }
                //this view needs to be rendered before the collections
                this.loadView(this.newsListView);
                if(!newQuery) {
                    this.newsListView.addAll();
                    this.newsListView.navbarGrapView.addAll();
                } else {
                    this.newsListView.fetchCollection();
                    if(this.newsListView.navbarGrapView) {
                        this.newsListView.navbarGrapView.fetchCollection();
                    }
                }
            },

            loadView : function(view) {
                this.view && (this.view.close ? this.view.close() : this.view.remove());
                this.view = view;
                this.view.render();
            },

            parseQueryString: function(queryString){
                var params = {};
                if(queryString){
                    _.each(
                        _.map(decodeURI(queryString).split(/&/g),function(el,i){
                            var aux = el.split('='), o = {};
                            if(aux.length >= 1){
                                var val = undefined;
                                if(aux.length == 2)
                                    val = aux[1];
                                o[aux[0]] = val;
                            }
                            return o;
                        }),
                        function(o){
                            _.extend(params,o);
                        }
                    );
                }
                return params;
            }
        });

        return ApplicationRouter;
    });
