/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
    ], function ($, _, Backbone, JST) {
        'use strict';

        var NavbargraphView = Backbone.View.extend({
            template: JST['app/scripts/templates/navbarGraph.ejs'],

            id: 'graph-container',

            className: 'navbar navbar-fixed-bottom',

            initialize: function() {
                this.listenTo(this.collection, 'add', this.addOne);
                this.listenTo(this.collection, 'reset', this.addAll);

                _.bindAll(this, 'checkScroll');
                $(window).scroll(this.checkScroll);

                if(!this.plotData) this.plotData = [];
                this.plotOptions = {
                    crosshair: {
                        mode: "x"
                    },
                    series: {
                        lines: { show: true },
                        points: { show: true }
                    },
                    grid: { hoverable: true, clickable: true },
                    yaxis: { max: 1 },
                    xaxis: {
                        mode: "time",
                        timeformat: "%Y/%m/%d"
                    }
                };

                this.canFetch = true;
                $('#main-container').parent().prepend(this.$el.html(this.template()));
            },

            checkScroll: function() {
                if(this.plotObj){
                    var scrollDate;

                    var scrollTop = $(window).scrollTop();
                    var windowHeight = $(window).height();
                    //$(".newsListItem").removeClass("active");
                    $(".newsListItem").each( function() {
                        var offset = $(this).offset();
                        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
                            //$(this).addClass("active");
                            // this should get the date from the model not the
                            // element. todo after adding localstorage
                            var dataElem = this.getElementsByClassName('article-date');
                            if(dataElem.length > 0)
                            var dateStr = dataElem[0].value;
                            scrollDate = new Date(dateStr);
                            return false;
                        }
                    });

                    if(scrollDate){
                        this.plotObj.setCrosshair({
                            x: scrollDate.getTime(),
                            y: 0
                        });
                    }
                }
            },

            fetchCollection: function() {
                if(this.canFetch) {
                    if(this.options.parameters.begindate){
                        // had to do this because andre said fuck you!
                        // i'm going to name the parameters oposite names just to
                        // screw  with your head!
                        this.options.parameters.enddate = this.options.parameters.begindate;
                        delete this.options.parameters.begindate;
                    }
                    this.canFetch = false;
                    var self = this;
                    this.collection.fetch({
                        remove: false,
                        data: self.options.parameters,
                        success: function () {
                            self.canFetch = true;
                            self.render();
                        }
                    });
                }
            },

            nextPage: function () {
                if(this.minDateObj){
                    var curr_date = this.minDateObj.getDate();
                    var curr_month = this.minDateObj.getMonth() + 1; //Months are zero based
                    var curr_year = this.minDateObj.getFullYear();
                    this.options.parameters.enddate = curr_year + "-" +
                        this.pad2(curr_month) + "-" + this.pad2(curr_date);
                    this.fetchCollection();
                }
            },

            addAll: function () {
                this.close();
                this.initialize();
                this.collection.each(this.addOne,this);
                this.render();
            },

            addOne: function(timeseriesModel) {
                var value = Number(timeseriesModel.attributes.value);
                var date = new Date(timeseriesModel.attributes.date);
                if(value > this.plotOptions.yaxis.max )
                    this.plotOptions.yaxis.max = value;
                this.plotData.push([date.getTime(),value]);
            },

            reset: function() {
                console.log('reset()');
            },

            plothover: function (event, pos, item) {
            },

            plotclick: function (event, pos, item) {
                var date = new Date(pos.x);
                date.setDate(date.getDate()+1); // because of the API
                var curr_date = date.getDate();
                var curr_month = date.getMonth() + 1; //Months are zero based
                var curr_year = date.getFullYear();
                this.options.parameters.begindate = curr_year + "-" + this.pad2(curr_month) + "-" + this.pad2(curr_date);
                this.options.parameters.pagenumber = 1;
                if(this.options.parameters.enddate) delete this.options.parameters.enddate;
                var endpoint = '#newsList?' + $.param(this.options.parameters);
                Backbone.history.navigate(endpoint,true);
            },

            render : function () {
                this.plotData = _.sortBy(this.plotData, function(plotTick) { return plotTick[0]});
                this.plotOptions.yaxis.max = _.max(this.plotData,function(value){return value[1];})[1];
                if(this.plotData && this.plotData.length != 0)
                    this.minDateObj = new Date(this.plotData[0][0]);
                this.plotObj = $.plot($('#flot-canvas'),[this.plotData],this.plotOptions);
                this.plotObj.lockCrosshair();
                var self = this;
                $('#flot-canvas').bind("plothover", function (event, pos, item) { self.plothover(event, pos, item) });
                $('#flot-canvas').bind("plotclick", function (event, pos, item) { self.plotclick(event, pos, item) });
                this.checkScroll();
                return this;
            }
        });

        return NavbargraphView;
    });
