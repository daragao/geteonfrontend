/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
    backbone: {
        deps: [
    'bootstrap',
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
        'views/viewsHelper' // doesn't need to be added as an argument
        ], function ($, Backbone, ApplicationRouter) {

            $.ajaxPrefilter("json script", function (options, originalOptions, jqXHR) {
                // GETEON BACKEND
                //var urlBaseGeteonBackend = 'http://geteon-backend-php.herokuapp.com/v1'; //remote
                var urlBaseGeteonBackend = 'http://api.geteon.com/v1'; //remote
                //var urlBaseGeteonBackend = 'http://localhost/newsline1'; //local
                // go BACKEND
                //var urlBaseGoBackend = 'http://warm-brook-6217.herokuapp.com/api/v1'; //remote
                var urlBaseGoBackend = 'http://apiuser.geteon.com/api/v1'; //local
                //var urlBaseGoBackend = 'http://localhost:4000/api/v1'; //local
                var backendKeyword = '{GO-BACKEND}';
            var fullAddress = 'http://';
            var keywordIndex = options.url.indexOf(backendKeyword);
            var fullAddressIndex = options.url.indexOf(fullAddress);
            // Your server goes below
            options.crossDomain = true;
            if(options.url &&
                (keywordIndex == -1 && fullAddressIndex == -1)) {
                    options.xhrFields = {withCredentials:false};
                    options.url = urlBaseGeteonBackend + options.url;
                } else {
                    if(keywordIndex != -1){
                        var endIndex = keywordIndex + backendKeyword.length;
                        options.url = urlBaseGoBackend + options.url.substring(endIndex);
                    }
                }

            });

            var routerApp = new ApplicationRouter();
            Backbone.history.start();
        });
