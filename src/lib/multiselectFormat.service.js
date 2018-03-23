(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .service('amoMultiselectFormatService', MultiselectFormatService);

    /**
     * @ngdoc factory
     * @module amo.multiselect
     * @name amoMultiselectFormatService
     * @requires amoMultiselectConfig
     */
    function MultiselectFormatService(amoMultiselectConfig) {
        var self = this;

        self.joinLabels = joinLabels;
        self.pluralize = pluralize;
        
        /**
         * @ngdoc method
         * @name amoMultiselectFormatService#joinLabels
         * @description Joins the array of labels
         * @param {Array} labels
         * @returns {String}
         */
        function joinLabels(labels) {
            var label,
                lastLabel;

            if (labels.length === 1) {
                return labels[0];
            }

            lastLabel = labels.pop();
            
            label = labels.join(', ');

            if (labels.length > 1) {
                label += ',';
            }

            return label + ' and ' + lastLabel;
        }

        /**
         * @ngdoc method
         * @name amoMultiselectFormatService#pluralize
         * @description Pluralizes the specified array of labels
         * @param {Number} count
         * @param {String} [suffix='items'] Default phrase suffix
         * @param {String} [singularSuffix='item'] Singular suffix
         * @returns {String}
         */
        function pluralize(count, suffix, singularSuffix) {
            var label = count + ' ';

            if (count === 1) {
                label += singularSuffix || amoMultiselectConfig.selectedSuffixSingularText;
            } else {
                label += suffix || amoMultiselectConfig.selectedSuffixText;
            }

            return label;
        }
    }

})();
