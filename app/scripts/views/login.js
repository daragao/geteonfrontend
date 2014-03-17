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

            className: 'container',

            model: new UserModel(),

            events: {
                "click #login-user": "loginUser",
                "change #username": "setUsername",
                "change #password": "setPassword"
            },

            initialize: function(){
                this.loginButton = $("#login-user");
                this.model.view = this;
                this.model.bind("validated", this.validated);
                this.model.url = 'http://localhost:4000/api/v1/login'
            },

            validated: function(valid){
                if (valid){
                    $("#login-user").removeAttr("disabled");
                } else {
                    $("#login-user").attr("disabled", "true");
                }
            },

            setUsername: function(e){
                this.model.set({username: $("#username").val()});
            },

            setPassword: function(e){
                this.model.set({password: $("#password").val()});
            },

            render: function () {
                $('#main-container').append(this.$el.html(this.template()));
                return this;
            }
    });

    return LoginView;
});
