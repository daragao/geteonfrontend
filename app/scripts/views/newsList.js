/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/newsListItem',
    'views/navbarGraph',
    'collections/bookmarks'
    ], function ($, _, Backbone, JST, NewsListItemView, NavbarGraphView,
        BookmarksCollection) {
        'use strict';

        var NewslistView = Backbone.View.extend({
            template: JST['app/scripts/templates/newsList.ejs'],

            id: 'news-list-container',

            className: 'container',

            spinnerOpts: {
                lines: 9, // The number of lines to draw
                length: 6, // The length of each line
                width: 2, // The line thickness
                radius: 3, // The radius of the inner circle
                speed: 0.9, // Rounds per second
                trail: 43, // Afterglow percentage
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 0 // The z-index (defaults to 2000000000)
            },

            initialize: function(options) {
                var self = this;
                this.listenTo(this.collection, 'add', this.addOne);

                if(options) // if fails initialized was called to remake binds
                    this.sessionModel = options.sessionModel;
                this.sessionModel.on('sessionRefresh', this.refreshSession, this);

                // bookmarks
                this.bookmarksCollection = new BookmarksCollection();
                this.bookmarksCollection.on('add', this.setBookmarks, this);
                this.bookmarksCollection.on('change', this.setBookmarks, this);
                this.bookmarksCollection.on('destroy', this.destroyBookmark, this);

                //_.bindAll(this, 'checkScroll');
                //$(window).scroll(this.checkScroll);

                var self = this;
                self.canFetch = true;
                this.childViews = new Array();
            },

            destroyBookmark : function(model,collection,options) {
                var bot = $('#'+model.attributes.NewsItemId + ' .bookmark');
                if(bot.length)
                    bot.removeClass('btn-primary').removeClass('active');
            },

            setBookmarks : function(model,collection,options) {
                var bot = $('#'+model.attributes.NewsItemId + ' .bookmark');
                if(bot.length)
                    bot.addClass('btn-primary').addClass('active');
            },

            fetchBookmarks : function (){
                $('.bookmark').removeClass('btn-primary').removeClass('active');
                this.bookmarksCollection.reset();
                this.bookmarksCollection.fetch({data:{'bookmarkType':1}});
            },

            refreshSession: function() {
                var isLoggedIn = this.sessionModel.isLoggedIn();
                $('.bookmark').toggle(isLoggedIn);
                if(isLoggedIn)
                    this.fetchBookmarks();
            },

            fetchCollection: function() {
                if(this.canFetch) {
                    this.$el.append('<div class="alert alert-info"><div id="spinnerDiv"></div></div>');
                    this.$el.find('#spinnerDiv').spin(this.spinnerOpts);
                    this.canFetch = false;
                    var self = this;
                    this.collection.fetch({
                        remove: false,
                        data: self.options.parameters,
                        success: function () {
                            self.canFetch = true;
                            self.$el.find('#spinnerDiv').parent().remove();
                        },
                        error: function () {
                            self.$el.find('#spinnerDiv').parent().remove();
                        }
                    });
                }
            },

            nextPage: function () {
                if(this.canFetch) this.options.parameters.pagenumber++;
                this.fetchCollection();
            },

            checkScroll: function () {
                // get graph data
                var oneDay = 24*60*60*1000;
                var newsItemDate =
                    new Date(this.collection.last().attributes.pubdate);
                var navBarDate =
                    new Date(this.navbarGrapView.collection.last().
                            attributes.date);
                var diffDays =
                    (navBarDate.getTime() - newsItemDate.getTime())/(oneDay);
                if(diffDays > 7){
                    this.navbarGrapView.nextPage();
                }
                // get news list items
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300)
                {
                    this.nextPage();
                }
            },

            addOne: function (newsItem) {
            console.log('addOne!');
                //create date and element id
                var pubdate = newsItem.get('pubdate');
                var myDate = this.mongoDate2JsDate(pubdate);
                var dateStr = this.date2urlDateStr(myDate);
                var elemName = 'news-list-' + dateStr;
                var dateOut = this.writeDate(myDate);
                if($('#'+elemName).length == 0){
                    this.$el.append(this.template({
                        elemId: elemName,
                        articlesDate: dateOut
                    }));
                    $('#main-container').append(this.$el);
                }
                //render newslistitem
                var view = new NewsListItemView({
                    elemName: elemName,
                    model: newsItem,
                    sessionModel: this.sessionModel,
                    bookmarksCollection: this.bookmarksCollection
                });
                this.childViews.push(view);
                $('.bookmark').toggle(this.sessionModel.isLoggedIn());
            },

            addAll: function () {
            console.log('addAll!');
                this.close();
                this.initialize();
                this.collection.each(this.addOne,this);
            },

            render : function () {
                if(!this.navbarGrapView){
                    this.navbarGrapView = new NavbarGraphView({
                        parameters:_.clone(this.options.parameters),
                        collection:this.options.graphTimeseriesCollection
                    });
                }
                this.delegateEvents();
                this.refreshSession();
                _.bindAll(this, 'checkScroll');
                $(window).scroll(this.checkScroll);
                return this;
            },

            close: function() {
                // handle other unbinding needs, here
                this.navbarGrapView.close();

                //COMPLETELY UNBIND THE VIEW
                this.undelegateEvents();
                $(window).unbind('scroll');

                this.$el.removeData().unbind();

                // need this because I'm a fucking asshole!
                // messed up where I am adding the partials!
                this.$el.html('');
                //Remove view from DOM
                this.remove();
                Backbone.View.prototype.remove.call(this);


                _.each(this.childViews, function(childView){
                    if (childView.close){
                        childView.close();
                    }
                })
                this.childViews = [];
            }
        });

        return NewslistView;
    });
