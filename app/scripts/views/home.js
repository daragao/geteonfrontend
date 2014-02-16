/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
    ], function ($, _, Backbone, JST) {
        'use strict';

        var HomeView = Backbone.View.extend({
            template: JST['app/scripts/templates/home.ejs'],

            className: 'container',

            events: {
                'submit form': 'submitSearch',
                'click #searchbot': 'submitSearch'
            },

            submitSearch: function() {
                var searchValue = encodeURIComponent($('#search_input').val());
                Backbone.history.navigate('newsList?search='+searchValue, true);
            },

            initialize: function() {
                this.render();
            },

            render : function () {
                $('#main-container').append(this.$el.html(this.template()));
                return this;
            },

            close: function() {

                //COMPLETELY UNBIND THE VIEW
                this.undelegateEvents();
                this.unbind();

                this.$el.removeData().unbind();

                //Remove view from DOM
                this.remove();
                Backbone.View.prototype.remove.call(this);

            }
        });

        return HomeView;
    });
