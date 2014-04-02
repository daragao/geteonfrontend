/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/user'
    ], function ($, _, Backbone, JST, UserModel) {
        'use strict';

        var LoginView = Backbone.View.extend({
            template: JST['app/scripts/templates/login.ejs'],
            templateLogout: JST['app/scripts/templates/logout.ejs'],

            className: 'container',

            //model: new UserModel(),

            events: {
                "click #logout-user": "logoutUser",
                "click #login-user": "loginUser"
            },

            initialize: function(){
                this.loginButton = $("#login-user");
                this.model.view = this;
                this.model.on('sessionRefresh', this.render, this)
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
                if(this.model.isLoggedIn())
                    $('#main-container').append(this.$el.html(this.templateLogout()));
                else
                    $('#main-container').append(this.$el.html(this.template()));
                return this;
            }
        });

        return LoginView;
    });
