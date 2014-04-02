/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var UserModel = Backbone.Model.extend({
            idAttribute: 'username' ,

            defaults: {
                'password':'',
                'Username':''
            },

            initialize: function(){
                var that = this;

                this.bind("change", this.attributesChanged);

                $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
                    options.xhrFields = {
                        withCredentials: true
                    };
                    // If we have a csrf token send it through with the next request
                    if(typeof that.get('_csrf') !== 'undefined') {
                        jqXHR.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
                    }
                });
            },

            getLoggedUser: function(callback) {
                this.urlRoot = 'http://localhost:4000/api/v1/users'
                this.id = 0;
                this.fetch({
                    error: function (model, resp, options) {
                model.clear();
                model.id = undefined;
                // Set auth to false to trigger a change:auth event
                // The server also returns a new csrf token so that
                // the user can relogin without refreshing the page
                model.set({ _csrf: resp._csrf});
                        if(callback) callback();
                    },
                    success: function (model, resp, options) {
                        if(callback) callback();
                    }
                });
            },

            isLoggedIn: function() {
                var id = this.get('Id');
                if(id != undefined && id > 0)
                    return true;
                else
                    return false
            },

            login: function() {
                this.url = 'http://localhost:4000/api/v1/login'
                var that = this;
                this.save(null,{
                    error: function(model,resp, options){
                        that.sessionError(model,resp, options);
                    },
                    success: function(model,resp, options){
                        that.sessionSuccess(model,resp, options);
                    }
                });
            },

            logout: function() {
                this.url = 'http://localhost:4000/api/v1/login'
                this.set('id',0);
                // Do a DELETE to /session and clear the clientside data
                var that = this;
                this.destroy({
                    error: function(model,resp, options){
                        that.sessionError(model,resp, options);
                    },
                    success: function(model,resp, options){
                        that.sessionSuccess(model,resp, options);
                    }
                });
            },

            sessionError: function(model,resp, options){
                model.clear();
                model.id = undefined;
                // Set auth to false to trigger a change:auth event
                // The server also returns a new csrf token so that
                // the user can relogin without refreshing the page
                model.set({ _csrf: resp._csrf});
                model.trigger('sessionRefresh');
            },

            sessionSuccess: function(model,resp,options){
                model.trigger('sessionRefresh');
            },

            attributesChanged: function(){
                var valid = false;
                if (this.get('Username') && this.get('password'))
                    valid = true;
            }
        });

        return UserModel;
    });
