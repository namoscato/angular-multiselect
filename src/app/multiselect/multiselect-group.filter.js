(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .filter('amoMultiselectGroup', AmoMultiselectGroupFilter);

    /**
     * @ngdoc filter
     * @module amo.multiselect
     * @name amoMultiselectGroup
     */
    function AmoMultiselectGroupFilter() {

        /**
         * @name amoMultiselectGroup#groupingFilter
         * @description Returns options that are in the specified group
         * @param {Array} options
         * @param {String} group
         * @returns {Array}
         */
        function groupingFilter(options, group) {
            var output = [];

            options.forEach(function(option) {
                if (option.group === group) {
                    output.push(option);
                }
            });

            return output;
        }

        return groupingFilter;
    }
})();
