/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'jquery.flot',
                'jquery.flot.selection',
                'jquery.flot.crosshair',
                'jquery.flot.time',
                'jquery.spin',
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'jquery.flot': {
            deps: ['jquery'],
            exports: '$.plot'
        },
        'jquery.flot.time': {
            deps: ['jquery.flot']
        },
        'jquery.flot.selection': {
            deps: ['jquery.flot']
        },
        'jquery.flot.crosshair': {
            deps: ['jquery.flot']
        },
        'jquery.spin': {
            deps: ['jquery', 'spin']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'jquery.flot': '../bower_components/flot/jquery.flot',
        'jquery.flot.selection': '../bower_components/flot/jquery.flot.selection',
        'jquery.flot.crosshair': '../bower_components/flot/jquery.flot.crosshair',
        'jquery.flot.time': '../bower_components/flot/jquery.flot.time',
        'jquery.spin': '../bower_components/spin.js/jquery.spin',
        'spin': '../bower_components/spin.js/spin'
    }
});


require([
    'jquery',
    'backbone',
    'routes/application',
    'models/user',
    'views/viewsHelper' // doesn't need to be added as an argument
    ], function ($, Backbone, ApplicationRouter, UserModel) {

        $.ajaxPrefilter("json script", function (options, originalOptions, jqXHR) {

            // Your server goes below
            if(options.url && options.url.indexOf("http://") == -1) {
                //options.crossDomain = true;
                options.xhrFields = {withCredentials:false};
                //options.url = 'http://newsline-php.ap01.aws.af.cm' + options.url;
                options.url = 'http://localhost' + options.url;
            }

        });

        var routerApp = new ApplicationRouter();
        Backbone.history.start();
    });
