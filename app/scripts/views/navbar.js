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
                templateUserDropdown: JST['app/scripts/templates/navbar-user-dropdown.ejs'],

                id: 'navbar',

                className:'navbar navbar-inverse navbar-fixed-top nav',

                initialize: function(options) {
                    this.sessionModel = options.sessionModel;
                    this.sessionModel.on('sessionRefresh', this.refreshSession, this);
                    this.childViews = new Array();
                    this.render();
                },

                events: {
                    'submit #search-navbar-form': 'submitSearch',
                'click  #navbar-login-dropdown a': 'stopPropagation',
                'submit #navbar-login-form':'loginUser',
                'submit #navbar-logout-form':'logoutUser'
                },

                logoutUser: function(e){
                    this.sessionModel.logout();
                },

                loginUser: function(e){
                    var username = $("#navbar-login-dropdown #username").val();
                    var password = $("#navbar-login-dropdown #password").val();

                    this.sessionModel.set({
                        Username: username,
                        password: password,
                    });
                    this.sessionModel.login();
                },

                stopPropagation: function(e) {
                    e.preventDefault();
                    this.$('li .dropdown-menu').toggle();
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
                    var tempUserDropdown = this.templateUserDropdown();
                    $('#main-container').parent().prepend(tempRender);
                    $('#navbar-user-dropdown').html(tempUserDropdown);
                    this.refreshSession();
                    return this;
                },

                refreshSession: function(a,b,c,d,e) {
                    var username = 'Login'; //user not logged in
                    var isLoggedIn = this.sessionModel.isLoggedIn();

                    $('#navbar-login-form').toggle(!isLoggedIn);
                    $('#navbar-logout-form').toggle(isLoggedIn);
                    if(this.sessionModel.isLoggedIn()){
                        username = this.sessionModel.get('Username');
                    }
                    $('#login-btn').text(username);
                    this.$('li .dropdown-menu').toggle(false);
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
