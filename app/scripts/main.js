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
        'jquery.flot.time': '../bower_components/flot/jquery.flot.time'
    }
});

require([
    'backbone',
    'routes/application'
    ], function (Backbone, ApplicationRouter) {
        var routerApp = new ApplicationRouter();
        Backbone.history.start();
    });
