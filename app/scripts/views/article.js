/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
    ], function ($, _, Backbone, JST) {
        'use strict';

        var ArticleView = Backbone.View.extend({
            template: JST['app/scripts/templates/article.ejs'],

            className: 'container',

            initialize: function () {
                this.listenTo(this.model, 'add', this.render);
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);

                if(this.model){
                    this.model.fetch();
                }
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
