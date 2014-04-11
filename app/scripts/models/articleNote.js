/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ArticlenoteModel = Backbone.Model.extend({
        defaults: {
            'ElementId': '',
        'StartPos':0,
        'EndPos':0,
        'noteText':''
        }
                  //range document.getElementById('article-text').firstChild
                  //range document.createRange()
                  //range range.setStart(document.getElementById('article-text').firstChild,4)
    });

    return ArticlenoteModel;
});
