(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @module amo.multiselect
     * @name amoMultiselectConfig
     * @description Global multiselect configuration
     */
    angular
        .module('amo.multiselect')
        .constant('amoMultiselectConfig', {
            deselectAllText: 'Deselect All',
            searchText: 'Search...',
            selectAllText: 'Select All',
            selectedSuffixSingularText: 'item',
            selectedSuffixText: 'items',
            selectText: 'Select...'
        });

})();
