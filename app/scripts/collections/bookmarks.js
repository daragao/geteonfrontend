/*global define*/

define([
    'underscore',
    'backbone',
    'models/bookmark'
], function (_, Backbone, BookmarksModel) {
    'use strict';

    var BookmarksCollection = Backbone.Collection.extend({
        url: '{GO-BACKEND}/bookmarks',
        model: BookmarksModel
    });

    return BookmarksCollection;
});
