(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .directive('amoMultiselectDropdown', MultiselectDropdownDirective);

    /**
     * @ngdoc directive
     * @module amo.multiselect
     * @name amoMultiselectDropdown
     */
    function MultiselectDropdownDirective() {

        return {
            link: link,
            restrict: 'E',
            templateUrl: 'amo/multiselect/multiselect-dropdown.html'
        };

        /**
         * @name amoMultiselectDropdown#link
         * @description Directive's link function
         * @param {Object} scope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         */
        function link(scope, element, attrs) {
            var self = scope.multiselectDropdown;

            // Methods
            self.getSelectAllLabel = getSelectAllLabel;
            self.toggleAllSelectedState = toggleAllSelectedState;
            self.toggleSelectedState = toggleSelectedState;

            /**
             * @ngdoc method
             * @name amoMultiselect#getSelectAllLabel
             * @description Returns the select/deselect all label
             * @returns {String}
             */
            function getSelectAllLabel() {
                return self.isAllSelected ? self.text.deselectAll : self.text.selectAll;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#toggleAllSelectedState
             * @description Toggles the selected state for all options
             */
            function toggleAllSelectedState() {
                self.isAllSelected = !self.isAllSelected;

                angular.forEach(self.optionsFiltered, function(optionsFiltered) {
                    angular.forEach(optionsFiltered, function(option) {
                        option.selected = self.isAllSelected;
                    });
                });

                self.exposeSelectedOptions();
            }

            /**
             * @ngdoc method
             * @name amoMultiselectDropdown#toggleSelectedState
             * @description Toggles the selected state of the option with the specified ID
             * @param {*} option Selected option
             */
            function toggleSelectedState(option) {
                option.selected = !option.selected;

                self.exposeSelectedOptions();
            }
        }
    }

})();
