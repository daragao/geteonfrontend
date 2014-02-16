/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
    ], function ($, _, Backbone, JST) {
        'use strict';

        var NewslistitemView = Backbone.View.extend({
            template: JST['app/scripts/templates/newsListItem.ejs'],

            tagName: 'a',

            className:  'list-group-item newsListItem',

            initialize: function () {
                this.listenTo(this.model, 'destroy', this.remove);
                this.$el.attr('href','#article/'+this.model.id);
                this.$el.attr('id',this.model.id);
                this.render();
            },

            render: function () {
                $('#'+this.options.elemName).append(this.$el.html(this.template(this.model.toJSON())));
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
