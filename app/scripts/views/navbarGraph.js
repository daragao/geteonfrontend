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
                    yaxis: { max: 1 },
                    xaxis: {
                        mode: "time",
                        timeformat: "%Y/%m/%d"
                    }
                };

                this.canFetch = true;
            },

            checkScroll: function() {
                if(this.plotObj){
                    var scrollDate;

                    var scrollTop = $(window).scrollTop();
                    var windowHeight = $(window).height();
                    $(".newsListItem").removeClass("active");
                    $(".newsListItem").each( function() {
                        var offset = $(this).offset();
                        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
                            //$(this).addClass("active");
                            // this should get the date from the model not the
                            // element. todo after adding localstorage
                            scrollDate = new Date($(this.getElementsByTagName('p')).text());
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

            pad2: function (number) {
                return (number < 10 ? '0' : '') + number;
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

            render : function () {
                $('#main-container').parent().prepend(this.$el.html(this.template()));
                this.plotData = _.sortBy(this.plotData, function(plotTick) { return plotTick[0]});
                this.plotOptions.yaxis.max = _.max(this.plotData,function(value){return value[1];})[1];
                this.minDateObj = new Date(this.plotData[0][0]);
                this.plotObj = $.plot($('#flot-canvas'),[this.plotData],this.plotOptions);
                this.plotObj.lockCrosshair();
                this.checkScroll();
                return this;
            },

            close: function() {

                //COMPLETELY UNBIND THE VIEW
                this.undelegateEvents();
                this.unbind();

                this.$el.removeData().unbind();

                //Remove view from DOM
                this.remove();
                Backbone.View.prototype.remove.call(this);

            }
        });

        return NavbargraphView;
    });