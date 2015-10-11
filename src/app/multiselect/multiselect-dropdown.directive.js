(function() {
    'use strict';

    angular
        .module('amoscato.multiselect')
        .directive('multiselectDropdown', MultiselectDropdownDirective);

    /**
     * @ngdoc directive
     * @module amoscato.multiselect
     * @name multiselectDropdown
     */
    function MultiselectDropdownDirective() {

        return {
            link: link,
            restrict: 'E',
            templateUrl: 'app/multiselect/multiselect-dropdown.html'
        };

        /**
         * @name multiselectDropdown#link
         * @description Directive's link function
         * @param {Object} scope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         */
        function link(scope, element, attrs) {

            // Methods
            scope.toggleSelectedState = toggleSelectedState;

            /**
             * @ngdoc method
             * @name multiselectDropdown#toggleSelectedState
             * @description Toggles the selected state of the option with the specified ID
             * @param {Event} clickEvent JavaScript click event
             * @param {*} option Selected option
             */
            function toggleSelectedState(clickEvent, option) {
                clickEvent.stopPropagation();

                option.selected = !option.selected;

                // TODO: Optimize
                scope.exposeSelectedOptions();
            }
        }
    }

})();
