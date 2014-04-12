/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ArticlenoteModel = Backbone.Model.extend({
        defaults: {
            'ElementId': '',
        'StartOffset':0,
        'EndOffset':0,
        'NoteText':'',
        'UserId':0
        }
    });

    return ArticlenoteModel;
});
