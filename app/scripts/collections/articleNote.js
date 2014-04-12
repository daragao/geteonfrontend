/*global define*/

define([
    'underscore',
    'backbone',
    'models/articleNote'
], function (_, Backbone, ArticleNoteModel) {
    'use strict';

    var ArticlenoteCollection = Backbone.Collection.extend({
        model: ArticleNoteModel,

        model2Range: function ( html, model) {
            var range;
            var rangeElement = html.getElementById(mode.ElementId);
            if(rangeElement){
                var textNode = rangeElement.firstChild;
                range = html.createRange();
                range.setStart(textNode,mode.StartOffset);
                range.setEnd(textNode,mode.EndOffset);
            }
            return range;
        },

        createAddModel: function(userId, selection, noteText) {
            var newModel = this.createModel(userId,selection,noteText);
            this.add(newModel);
        },

        createModel: function(userId, range, noteText) {
            var newModel;
            if(range) {
                newModel = new ArticleNoteModel();
                newModel.ElementId = range.startContainer.parentElement.id;
                newModel.StartOffset = range.startOffset;
                newModel.EndOffset = range.endOffset;
            }
            return newModel;
        }
    });

    return ArticlenoteCollection;
});
