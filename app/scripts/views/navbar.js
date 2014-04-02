/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
    ], function ($, _, Backbone, JST) {
        'use strict';

        var NavbarView = Backbone.View.extend({
            template: JST['app/scripts/templates/navbar.ejs'],

            id: 'navbar',

            className:'navbar navbar-inverse navbar-fixed-top',

            initialize: function(options) {
                this.sessionModel = options.sessionModel;
                this.sessionModel.on('sessionRefresh', this.refreshSession, this)
                this.childViews = new Array();
                this.render();
            },

            events: {
                'submit form': 'submitSearch'
            },

            submitSearch: function() {
                //$('#search_input').val();
                var searchParams = $(event.target).serialize();
                Backbone.history.navigate('newsList?'+searchParams, true);
            },

            setSearchInput: function (searchVal) {
                $('input[name=search]').val(searchVal);
            },

            render : function () {
                var tempRender = this.$el.html(this.template());
                $('#main-container').parent().prepend(tempRender);
                this.refreshSession();
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

                // handle other unbinding needs, here
                _.each(this.childViews, function(childView){
                    if (childView.close){
                        childView.close();
                    }
                })
                this.childViews = [];
            }
        });

        return NavbarView;
    });
