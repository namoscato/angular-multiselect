(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .filter('amoMultiselect', AmoMultiselectFilter);

    /**
     * @ngdoc filter
     * @module amo.multiselect
     * @name AmoMultiselectFilter
     */
    function AmoMultiselectFilter() {

        var _filters = {
            grouping: grouping
        };

        /**
         * @name AmoMultiselectFilter#grouping
         * @description Returns options that are in the specified group
         * @param {Array} options
         * @param {String} group
         * @returns {Array}
         */
        function grouping(options, group) {
            var output = [];

            options.forEach(function(option) {
                if (option.group === group) output.push(option);
            });

            return output;
        }
        
        /**
         * @description Looks up the filter method and calls it
         */
        return function(input, method) {
            var params = Array.prototype.slice.call(arguments);
            if (!angular.isFunction(_filters[method])) return [];
            if (angular.isArray(params)) params.splice(1, 1);
            return _filters[method].apply(this, params);
        };
    }
})();
