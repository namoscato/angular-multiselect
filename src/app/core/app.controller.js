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

        self.options = [
            'One',
            'Two',
            'Three'
        ];
    }

})();
