/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/newsListItem',
    'views/navbarGraph'
    ], function ($, _, Backbone, JST, NewsListItemView, NavbarGraphView) {
        'use strict';

        var NewslistView = Backbone.View.extend({
            template: JST['app/scripts/templates/newsList.ejs'],

            id: 'news-list-container',

            className: 'container',

            initialize: function() {
                this.listenTo(this.collection, 'add', this.addOne);
                this.listenTo(this.collection, 'reset', this.addAll);

                _.bindAll(this, 'checkScroll');
                $(window).scroll(this.checkScroll);

                var self = this;
                self.canFetch = true;
                this.childViews = new Array();
            },

            fetchCollection: function() {
                if(this.canFetch) {
                    this.canFetch = false;
                    var self = this;
                    this.collection.fetch({
                        data: self.options.parameters,
                        success: function () {
                            self.canFetch = true;
                        }
                    });
                }
            },

            nextPage: function () {
                if(this.canFetch) this.options.parameters.pagenumber++;
                this.fetchCollection();
            },

            checkScroll: function () {
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300)
                {
                    //this.navbarGrapView.nextPage();
                    this.nextPage();
                }
            },

            writeDate: function (mydate) {
                var year=mydate.getFullYear()
                var day=mydate.getDay()
                var month=mydate.getMonth()
                var daym=mydate.getDate()
                //if the current date is less than 10, pad it.
                if (daym<10)
                    daym="0"+daym
                var dayarray=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")
                var montharray=new Array("January","February","March","April","May","June","July","August","September","October","November","December")
                //write out the final results
                return dayarray[day]+", "+montharray[month]+" "+daym+", "+year;
            },

            addOne: function (newsItem) {
                //create date and element id
                var pubdate = newsItem.get('pubdate');
                var myDate = new Date(pubdate);
                var dateStr = (myDate.getMonth() + 1) + "-" +
                    myDate.getDate() + "-" +
                    myDate.getFullYear();
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
                    model: newsItem
                });
                this.childViews.push(view);
            },

            addAll: function () {
                //this.close();
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
                return this;
            },

            close: function() {

                //COMPLETELY UNBIND THE VIEW
                this.undelegateEvents();

                this.$el.removeData().unbind();

                //Remove view from DOM
                this.remove();
                Backbone.View.prototype.remove.call(this);

                // handle other unbinding needs, here
                if(this.navbarGrapView){
                    this.navbarGrapView.close()
                }
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
