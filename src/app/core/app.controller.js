(function() {
    'use strict';

    angular
        .module('multiselectDemo.core')
        .controller('AppController', AppController);

    /**
     * @ngdoc controller
     * @module multiselectDemo.core
     * @name AppController
     */
    function AppController() {
        var self = this;

        self.modelStringTwo = ['Two'];
        self.optionsObject = [
            {
                id: 1,
                label: 'One'
            },
            {
                id: 2,
                label: 'Two'
            },
            {
                id: 3,
                label: 'Three'
            }
        ];
        self.optionsString = [
            'One',
            'Two',
            'Three'
        ];
    }

})();
