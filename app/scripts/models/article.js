/*global define*/

define([
    'underscore',
    'backbone'
    ], function (_, Backbone) {
        'use strict';

        var ArticleModel = Backbone.Model.extend({

            url: '/piecesofnews/',

            defaults: {
                title: '',
                piecenews: '',
                prettydate:'',
                mainsourcename:'',
                link:'',
                pubdate:''
            },

            initialize: function(options){
                this.url += options.id;
            }


        });

        return ArticleModel;
    });
