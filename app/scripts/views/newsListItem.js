/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/bookmark'
    ], function ($, _, Backbone, JST, BookmarkModel) {
        'use strict';

        var NewslistitemView = Backbone.View.extend({
            template: JST['app/scripts/templates/newsListItem.ejs'],

            tagName: 'a',

            className:  'list-group-item newsListItem',

            events: {
                'click .bookmark':'bookmarkClicked'
            },

            initialize: function (options) {
                this.sessionModel = options.sessionModel;
                this.bookmarksCollection = options.bookmarksCollection;
                this.sessionModel.on('sessionRefresh', this.refreshSession, this);
                this.listenTo(this.model, 'destroy', this.remove);
                this.$el.attr('href','#article/'+this.model.id);
                this.$el.attr('id',this.model.id);
                var thisDate = new Date(this.model.get('pubdate'));
                var prettyHour = this.pad2(thisDate.getHours()) +
                    ':' + this.pad2(thisDate.getMinutes()) +
                    ':' + this.pad2(thisDate.getSeconds());
                this.model.set('prettyHour', prettyHour);
                this.render();
            },

            isBookmarked: function () {
                var bookmarkId = this.model.id;
                var bookmark = this.bookmarksCollection.get(bookmarkId);
                return bookmark;
            },

            bookmarkClicked: function(e) {
                e.preventDefault();
                var bookmarkId = this.model.id;
                var bookmark = this.bookmarksCollection.get(bookmarkId);
                if(!bookmark){
                    bookmark = new BookmarkModel({
                        'NewsItemId':this.model.id,
                        'UserId':this.sessionModel.id,
                        'BookmarkType':1
                    });
                    bookmark.save();
                    this.bookmarksCollection.add(bookmark);
                } else {
                    bookmark.destroy();
                }
            },

            render: function () {
                $('#'+this.options.elemName).append(this.$el.html(this.template(this.model.toJSON())));
                if(this.isBookmarked())
                    $('#' + this.model.id + ' .bookmark').addClass('btn-primary').addClass('active');
                this.delegateEvents();
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

        return NewslistitemView;
    });
