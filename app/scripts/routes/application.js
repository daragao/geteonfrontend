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
    'views/navbar'
    ], function ($, Backbone, HomeView, NewsListView, NewsListCollection,
    ArticleModel, ArticleView, GraphTimeseriesCollection, NavbarView) {
        'use strict';

        var ApplicationRouter = Backbone.Router.extend({
            routes: {
                '':'home',
                'newsList?*querystring':'newsList',
                'newsList': 'newsList',
                'article/:id': 'article'
            },

            home: function() {
                if(this.navbarView){
                    this.navbarView.close();
                    this.navbarView = undefined;
                }
                this.loadView(new HomeView());
            },

            article: function(id){
                if(!this.navbarView){
                    this.navbarView = new NavbarView();
                }
                this.lastArticleModel = new ArticleModel({'id': id});
                if(id){
                    this.lastArticleModel.fetch();
                    this.loadView(new ArticleView({model:this.lastArticleModel}));
                }

            },

            newsList: function(querystring) {
                var resetData = (querystring != this.lastQueryString);
                this.lastQueryString = querystring;

                if(resetData){
                    var query = this.parseQueryString(querystring);
                    query.pagenumber = 1;
                    if(!this.navbarView){
                        this.navbarView = new NavbarView();
                    }
                    this.newsListCollection = new NewsListCollection();
                    this.graphTimeseriesCollection = new GraphTimeseriesCollection();
                    this.newsListView = new NewsListView({
                        parameters:query,
                        collection: this.newsListCollection,
                        graphTimeseriesCollection: this.graphTimeseriesCollection
                    })
                }
                this.loadView(this.newsListView);
                if(!resetData) {
                    this.newsListView.addAll();
                    this.newsListView.navbarGrapView.addAll();
                 } else {
                    this.newsListView.fetchCollection();
                    if(this.newsListView.navbarGrapView)
                        this.newsListView.navbarGrapView.fetchCollection();
                }
            },

            loadView : function(view) {
                this.view && (this.view.close ? this.view.close() : this.view.remove());
                this.view = view;
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