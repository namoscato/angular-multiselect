(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .filter('amoMultiselectGroup', AmoMultiselectGroupFilter);

    /**
     * @ngdoc filter
     * @module amo.multiselect
     * @name amoMultiselectGroup
     * @description Returns options that are in the specified group
     */
    function AmoMultiselectGroupFilter() {

        /**
         * @param {Array} options
         * @param {String} group
         * @returns {Array}
         */
        return function(options, group) {
            var output = [];

            options.forEach(function(option) {
                if (option.group === group) {
                    output.push(option);
                }
            });

            return output;
        };
    }

})();
