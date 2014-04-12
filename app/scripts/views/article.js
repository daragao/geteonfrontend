/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/articleNote'
    ], function ($, _, Backbone, JST, NoteCollection) {
        'use strict';

        var ArticleView = Backbone.View.extend({
            template: JST['app/scripts/templates/article.ejs'],
            templateTooltip: JST['app/scripts/templates/noteTooltip.ejs'],

            className: 'container',

            events: {
                'shown.bs.tooltip #article-text': 'addTooltipHTML',
                'hide.bs.tooltip #article-text': 'removeTagsFromPre',
            'click #tooltip-note-add': 'addNote',
            'click #tooltip-note-save': 'saveNote'
            },

            initialize: function () {
                //article
                this.listenTo(this.model, 'add', this.render);
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);

                this.notesCollection = new NoteCollection();

                if(this.model){
                    this.model.fetch();
                }
                $('body').bind('mouseup',{thisView : this}, this.mouseUpEvent);
                $('body').bind('mousedown',{thisView : this}, this.mouseDownEvent);
            },

            saveNote: function(ev) {
                this.lastRange.NoteText = $('#tooltip-note-editor textarea').val();
                this.lastRange.UserId = 0;
                this.notesCollection.add(this.lastRange);
                this.lastRange.save();
            },


            lastRange: {}, // not really nice to have a temporary global, but what I can do for now!

            addNote: function(ev) {
                if($('#tooltip-note-editor').is(":visible") )
                    return;
                var highlight = document.createElement( 'span' );
                highlight.className = 'selected-text';
                var selection = this.getSelection();
                var selectionRange = selection.getRangeAt(0);
                this.lastRange = this.notesCollection.createModel(0,selectionRange,'');
                selectionRange.surroundContents(highlight);
                $('#tooltip-note-editor').show();
                $('#tooltip-note-add').addClass('disabled');
                $('#tooltip-note-editor').focus();
                var selection = this.getSelection();
                this.setTooltipPosition(selection);
            },

            setTooltipPosition: function(selection) {
                var range = selection.getRangeAt(0);
                var clientRects = range.getClientRects();
                var scrollPos = this.getScrollPosition();
                var startRect = clientRects[0];
                var lineHeight = startRect.height;
                var leftRectPos = startRect.left + scrollPos.left;
                var topRectPos = startRect.top - lineHeight + scrollPos.top; //rect corner
                var tooltip = $('.tooltip');
                var tooltipMargin = 5;
                tooltip.css('left',(leftRectPos-(tooltip.width()/2))+'px');
                tooltip.css('top',(topRectPos-tooltip.height()+tooltipMargin)+'px');
            },

            addTooltipHTML: function(ev) {
                var selection = this.getSelection();
                var elem = $('.tooltip-inner');
                var noteTooltipTemp = this.templateTooltip(this.model.toJSON());
                elem.html(noteTooltipTemp);
                this.setTooltipPosition(selection);
            },

            getSelection: function(){
                var selection;
                if (window.getSelection) {
                    selection = window.getSelection();
                } else if (document.selection) {
                    selection = document.selection.createRange();
                }
                return selection;
            },

            mouseDownEvent: function(ev) {
            },

            mouseUpEvent: function(ev) {
                var self = ev.data.thisView;
                var selection = self.getSelection();
                var range = selection.getRangeAt(0);
                var elem = $('#article-text');
                if (selection && !selection.isCollapsed) {
                    if(!$('.tooltip-inner').length){
                        elem.tooltip('show');
                    } else {
                        self.setTooltipPosition(selection);
                    }
                } else {
                    if(ev.toElement.parentNode.id !== "tooltip-note-editor")
                        elem.tooltip('hide');
                }
            },

            removeTagsFromPre: function(ev) {
                var elem = $('#article-text');
                elem.html(elem.text());
            },

            render: function () {
                var pubdate = this.model.get('pubdate');
                var myDate = new Date(pubdate);
                var prettydate = this.writeDate(myDate);
                this.model.set('prettydate',prettydate);
                $('#main-container').append(this.$el.html(this.template(this.model.toJSON())));
                return this;
            },

            close: function() {

                //COMPLETELY UNBIND THE VIEW
                this.undelegateEvents();

                this.$el.removeData().unbind();

                //Remove view from DOM
                this.remove();
                Backbone.View.prototype.remove.call(this);

            }
        });

        return ArticleView;
    });
