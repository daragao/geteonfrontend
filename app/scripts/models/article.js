/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var ArticleModel = Backbone.Model.extend({


            //url: 'http://newsline-php.ap01.aws.af.cm/newsline1/piecesofnews/',
            url: 'http://localhost/newsline1/piecesofnews/',

            defaults: {
                title: '',
                piecenews: ''
            },

            initialize: function(options){
                this.url += options.id;
            }


        });

        return ArticleModel;
    });
