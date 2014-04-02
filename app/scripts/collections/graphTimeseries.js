/*global define*/

define([
    'underscore',
    'backbone',
    'models/graphTimeseries'
    ], function (_, Backbone, GraphtimeseriesModel) {
        'use strict';

        var GraphtimeseriesCollection = Backbone.Collection.extend({
            model: GraphtimeseriesModel,

            //http://localhost/newsline1/timeseries?search=obama&enddate=2014-01-11
            //order array (last obj most recent value, enddate most recent date excluded)
            url: '/newsline1/timeseries',

            initialize: function (options) {
            }

        });

        return GraphtimeseriesCollection;
    });
