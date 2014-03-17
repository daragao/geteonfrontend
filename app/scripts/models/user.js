/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var UserModel = Backbone.Model.extend({
            defaults: {
                'password':'',
                'username':''
            },

            url: 'http://localhost:4000/api/v1/users',

            initialize: function(){
                this.bind("change", this.attributesChanged);
            },

            attributesChanged: function(){
                var valid = false;
                if (this.get('username') && this.get('password'))
                    valid = true;
                this.trigger("validated", valid);
            }
        });

        return UserModel;
    });
