(function() {
    'use strict';

    angular
        .module('multiselectDemo.core')
        .controller('AppController', AppController);

    /**
     * @ngdoc controller
     * @module multiselectDemo.core
     * @name AppController
     * @requires $timeout
     */
    function AppController($timeout) {
        var self = this;

        self.modelObject = [
            {
                id: 2,
                label: 'Two'
            }
        ];
        self.modelObjectGrouped = [
            {
                category: 'Pizza',
                id: 2,
                label: 'Two'
            }
        ];
        self.modelObjectProperty = [2];
        self.modelStringTwo = ['One', 'Two'];
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
        self.optionsObjectGrouped = [
            {
                category: 'Pizza',
                id: 1,
                label: 'One'
            },
            {
                category: 'Pizza',
                id: 2,
                label: 'Two'
            },
            {
                category: 'Hamburger',
                id: 3,
                label: 'Three'
            }
        ];
        self.optionsObjectDefer = [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            }
        ];
        self.optionsString = [
            'One',
            'Two',
            'Three'
        ];

        self.addObject = addObject;
        self.onChange = onChange;
        self.onToggleDropdown = onToggleDropdown;

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

        /**
         * @ngdoc method
         * @name AppController#onToggleDropdown
         * @description Handler executed when dropdown opens or closes
         * @param {Boolean} isOpen
         */
        function onToggleDropdown(isOpen) {
            console.log('onToggleDropdown', isOpen);

            if (isOpen) {
                $timeout(function() {
                    self.optionsObjectDefer = self.optionsObject;
                }, 300);
            }
        }
    }

})();
