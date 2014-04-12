/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var NoteslistView = Backbone.View.extend({
        template: JST['app/scripts/templates/notesList.ejs']
    });

    return NoteslistView;
});
