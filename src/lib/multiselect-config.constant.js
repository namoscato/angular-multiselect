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
            conjunctionText: 'and',
            deselectAllText: 'Deselect All',
            filterText: 'Search...',
            isDeselectAllEnabled: true,
            isDisabled: false,
            isFilterEnabled: true,
            isSelectAllEnabled: true,
            limitTo: 500,
            selectAllText: 'Select All',
            selectedSuffixSingularText: 'item',
            selectedSuffixText: 'items',
            selectText: 'Select...'
        });

})();
