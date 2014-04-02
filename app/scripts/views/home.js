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

            initialize: function(options) {
                this.sessionModel = options.sessionModel;
                this.sessionModel.on('sessionRefresh', this.refreshSession, this)
                this.render();
            },

            render : function () {
                $('#main-container').append(this.$el.html(this.template()));
                return this;
            },

            refreshSession: function(a,b,c,d,e) {
                if(this.sessionModel.isLoggedIn()){
                    $('#login-btn').text(this.sessionModel.get('Username'));
                } else {
                    $('#login-btn').text('Login');
                }
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
