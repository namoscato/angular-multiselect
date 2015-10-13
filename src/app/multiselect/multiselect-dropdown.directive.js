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
            templateUrl: 'src/app/multiselect/multiselect-dropdown.html'
        };

        /**
         * @name amoMultiselectDropdown#link
         * @description Directive's link function
         * @param {Object} scope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         */
        function link(scope, element, attrs) {

            // Methods
            scope.getSelectAllLabel = getSelectAllLabel;
            scope.toggleAllSelectedState = toggleAllSelectedState;
            scope.toggleSelectedState = toggleSelectedState;

            /**
             * @ngdoc method
             * @name amoMultiselect#getSelectAllLabel
             * @description Returns the select/deselect all label
             * @returns {String}
             */
            function getSelectAllLabel() {
                return (scope.isAllSelected ? 'Deselect' : 'Select') + ' All';
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#toggleAllSelectedState
             * @description Toggles the selected state for all options
             */
            function toggleAllSelectedState() {
                scope.isAllSelected = !scope.isAllSelected;

                scope.options.forEach(function(option) {
                    option.selected = scope.isAllSelected;
                });

                scope.exposeSelectedOptions();
            }

            /**
             * @ngdoc method
             * @name amoMultiselectDropdown#toggleSelectedState
             * @description Toggles the selected state of the option with the specified ID
             * @param {*} option Selected option
             */
            function toggleSelectedState(option) {
                option.selected = !option.selected;

                scope.exposeSelectedOptions();
            }
        }
    }

})();
