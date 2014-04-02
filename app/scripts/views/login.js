/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
    ], function ($, _, Backbone, JST) {
        'use strict';

        var LoginView = Backbone.View.extend({
            template: JST['app/scripts/templates/login.ejs'],
            templateLogout: JST['app/scripts/templates/logout.ejs'],

            className: 'container',

            events: {
                "click #logout-user": "logoutUser",
                "click #login-user": "loginUser"
            },

            initialize: function(){
                this.model.on('sessionRefresh', this.refreshSession, this)
            },

            logoutUser: function(e){
                this.model.logout();
            },

            loginUser: function(e){
                this.model.set({
                    Username: $("#username").val(),
                    password: $("#password").val()
            });
            this.model.login();
            },

            render: function () {
                var tempJoin = this.templateLogout() + this.template()
                $('#main-container').append(this.$el.html(tempJoin));
                this.refreshSession();
            },

            refreshSession: function() {
                if(this.model.isLoggedIn()){
                    $('#login-container').hide();
                    $('#logout-container').show();
                } else {
                    $('#login-container').show();
                    $('#logout-container').hide();
                }
                return this;
            }
        });

        return LoginView;
    });
