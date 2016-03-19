(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .directive('amoMultiselectDropdownMenu', MultiselectDropdownMenuDirective);

    /**
     * @ngdoc directive
     * @module amo.multiselect
     * @name amoMultiselectDropdownMenu
     */
    function MultiselectDropdownMenuDirective() {

        return {
            link: link,
            restrict: 'A',
            scope: {
                onToggle: '&'
            }
        };

        /**
         * @name amoMultiselectDropdownMenu#link
         * @description Directive's link function
         * @param {Object} scope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         */
        function link(scope, element, attrs) {
            element.on('click', '.dropdown-menu', function(e) {
                e.stopPropagation();
            });

            element.on('show.bs.dropdown', function(e) {
                scope.onToggle({ open: true });
            });

            element.on('hide.bs.dropdown', function(e) {
                scope.onToggle({ open: false });
            });
        }
    }

})();
