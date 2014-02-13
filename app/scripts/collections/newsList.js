/*global define*/

define([
    'underscore',
    'backbone',
    'models/newsListItem'
    ], function (_, Backbone, NewsListItemModel) {
        'use strict';

        var NewslistCollection = Backbone.Collection.extend({
            model: NewsListItemModel,

            url: 'http://localhost/newsline1/piecesofnews',
            //url: 'http://newsline-php.ap01.aws.af.cm/newsline1/piecesofnews',

            initialize: function (options) {
            }

        });

        return NewslistCollection;
    });
