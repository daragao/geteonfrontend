/*global define*/

define([
        'underscore',
        'backbone'
        ], function (_, Backbone) {
            'use strict';

            var BookmarkModel = Backbone.Model.extend({
                idAttribute: 'NewsItemId',
                urlRoot: '{GO-BACKEND}/bookmarks',
                defaults: {
                    'UserId': 0,
                'NewsItemId': '',
                'BookmarkType': 0
                }
            });

            return BookmarkModel;
        });
