/*global define*/

define([
    'underscore',
    'backbone',
    'models/newsListItem'
    ], function (_, Backbone, NewsListItemModel) {
        'use strict';

        var NewslistCollection = Backbone.Collection.extend({

            model: NewsListItemModel,

            url: '/piecesofnews',

            initialize: function (options) {
            }

        });

        return NewslistCollection;
    });
