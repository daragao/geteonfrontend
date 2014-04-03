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

            urlRoot: '{GO-BACKEND}/users',

            initialize: function(){
            },
        });

        return UserModel;
    });
