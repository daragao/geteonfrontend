define([
    'jquery',
    'underscore',
    'backbone'
    ], function ($, _, Backbone) {
        _.extend(Backbone.View.prototype, {

            pad2: function (number) {
                return (number < 10 ? '0' : '') + number;
            },

            writeDate: function (mydate) {
                var year=mydate.getFullYear()
                var day=mydate.getDay()
                var month=mydate.getMonth()
                var daym=mydate.getDate()
                //if the current date is less than 10, pad it.
                if (daym<10)
                    daym="0"+daym
                var dayarray=new Array("Sunday","Monday","Tuesday","Wednesday",
                "Thursday","Friday","Saturday");
                var montharray=new Array("January","February","March","April",
                    "May","June","July","August","September","October",
                "November","December");
                //write out the final results
                return dayarray[day]+", "+montharray[month]+" "+daym+", "+year;
            },

            helper: function() {
                // Helper code
                console.log('HELPER FUNCTION!');
            },

            close: function() {
                //COMPLETELY UNBIND THE VIEW
                this.undelegateEvents();
                this.unbind();

                this.$el.removeData().unbind();

                //Remove view from DOM
                this.remove();
                Backbone.View.prototype.remove.call(this);

            }
        });
    });
