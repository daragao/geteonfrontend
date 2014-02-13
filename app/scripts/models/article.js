/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var ArticleModel = Backbone.Model.extend({

            defaults: {
            },

            initialize: function(options){
                //this.url = 'http://newsline-php.ap01.aws.af.cm/newsline1/piecesofnews/' +
                this.url = 'http://localhost/newsline1/piecesofnews/' +
                options.id;
            }
        });

        return ArticleModel;
    });
