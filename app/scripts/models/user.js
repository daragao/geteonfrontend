/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var UserModel = Backbone.Model.extend({
            idAttribute: 'Id',

            defaults: {
                'password':'',
                'Username':''
            },

            urlRoot : 'http://localhost:4000/api/v1/users',

            initialize: function(){
            },
        });

        return UserModel;
    });
