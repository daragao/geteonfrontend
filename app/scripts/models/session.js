/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var SessionModel = Backbone.Model.extend({
            idAttribute: 'Id',

            defaults: {
                'Id':0,
                'password':'',
                'Username':''
            },

            url: '{GO-BACKEND}/login',

            initialize: function(){
                var that = this;

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

            isLoggedIn: function() {
                var id = this.get('Id');
                if(id != undefined && id > 0)
                    return true;
                else
                    return false
            },

            getLoggedUser: function(callback) {
                var that = this;
                this.fetch({
                    error: function (model, resp, options) {
                        that.sessionError(model,resp, options);
                        if(callback) callback();
                    },
                    success: function (model, resp, options) {
                        that.sessionSuccess(model,resp, options);
                        if(callback) callback();
                    }
                });
            },

            login: function() {
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
                model.clear().set(model.defaults);
                // Set auth to false to trigger a change:auth event
                // The server also returns a new csrf token so that
                // the user can relogin without refreshing the page
                model.set({ _csrf: resp._csrf});
                model.trigger('sessionRefresh');
            },

            sessionSuccess: function(model,resp,options){
                model.trigger('sessionRefresh');
            }
        });

        return SessionModel;
    });
