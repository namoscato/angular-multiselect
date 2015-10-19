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

        self.modelObject = [
            {
                id: 2,
                label: 'Two'
            }
        ];
        self.modelObjectProperty = [2];
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

        self.addObject = addObject;
        self.onChange = onChange;

        /**
         * @ngdoc method
         * @name AppController#addObject
         * @description Adds an object to the `optionsObject` array
         */
        function addObject() {
            self.optionsObject.push({
                id: self.optionsObject.length + 1,
                label: 'Option ' + (self.optionsObject.length + 1)
            });
        }

        /**
         * @ngdoc method
         * @name AppController#onChange
         * @description Handler executed when multiselect control changes
         * @param {String} label
         */
        function onChange(label) {
            console.log('onChange', label);
        }
    }

})();
