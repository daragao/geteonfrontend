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

            className: 'row-fluid col-md-8 col-md-offset-2',

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
            },

            change: function () {
                this.render();
            },

            render: function () {
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
