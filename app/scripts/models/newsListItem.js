/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var NewslistitemModel = Backbone.Model.extend({
            defaults: {
                '_id':{
                    '$id': 0
                },
                'title':'',
                'pubdate':'2013-01-01 00:00:00',
                'idsource':0,
                'status':'',
                '_link':'',
                'counter':0
            }
        });

        return NewslistitemModel;
    });
