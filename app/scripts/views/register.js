/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/user'
    ], function ($, _, Backbone, JST, UserModel) {
        'use strict';

        var RegisterView = Backbone.View.extend({
            template: JST['app/scripts/templates/register.ejs'],

            className: 'container',

            model: new UserModel(),

            events: {
                "click #register-user": "registerUser",
                "change #username": "setUsername",
                "change #password": "setPassword"
            },

            initialize: function(){
                this.loginButton = $("#register-user");
                this.model.view = this;
                this.model.bind("validated", this.validated);
            },


            validated: function(valid){
                if (valid){
                    $("#register-user").removeAttr("disabled");
                } else {
                    $("#register-user").attr("disabled", "true");
                }
            },

            setUsername: function(e){
                this.model.set({username: $("#username").val()});
            },

            setPassword: function(e){
                this.model.set({password: $("#password").val()});
            },

            registerUser: function(){
                this.model.save();
                return false;
            },

            render: function () {
                $('#main-container').append(this.$el.html(this.template()));
                return this;
            }
        });

        return RegisterView;
    });
