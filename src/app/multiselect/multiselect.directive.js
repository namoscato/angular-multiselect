(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .directive('amoMultiselect', MultiselectDirective);

    /**
     * @ngdoc directive
     * @module amo.multiselect
     * @name amoMultiselect
     * @requires $compile
     * @requires AmoMultiselectFactory
     */
    function MultiselectDirective($compile, AmoMultiselectFactory) {

        return {
            link: link,
            replace: true,
            restrict: 'E',
            require: 'ngModel'
        };

        /**
         * @name amoMultiselect#link
         * @description Directive's link function
         * @param {Object} parentScope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         * @param {Object} ngModelController
         */
        function link(parentScope, element, attrs, ngModelController) {

            var _labels = [],
                _optionHash = {},
                _selectedOptions = [];

            var multiselect = new AmoMultiselectFactory(attrs.options, parentScope),
                scope = parentScope.$new();

            parentScope.$on('$destroy', function() {
                scope.$destroy();
            });

            // Variables
            scope.options = [];

            // Methods
            scope.exposeSelectedOptions = exposeSelectedOptions;
            scope.toggleSelectedState = toggleSelectedState;

            // Initialization
            initialize();

            /**
             * @ngdoc method
             * @name amoMultiselect#exposeSelectedOptions
             * @description Exposes the selected options
             */
            function exposeSelectedOptions() {
                _labels.length = 0;
                _selectedOptions.length = 0;

                scope.options.forEach(function(option, index) {
                    if (!option.selected) { return; }

                    _labels.push(multiselect.getLabel(_optionHash[index]));

                    // use _select_ regex thing
                    _selectedOptions.push(_optionHash[index]);
                });

                ngModelController.$setViewValue(_selectedOptions);

                setSelectedLabel();
            }

            /**
             * @name amoMultiselect#initialize
             * @description Initializes the directive
             */
            function initialize() {
                element.append($compile('<amo-multiselect-dropdown></amo-multiselect-dropdown>')(scope));

                ngModelController.$render = onNgModelRender;
            }

            /**
             * @name amoMultiselect#onNgModelRender
             * @description Handler called on `ngModelController.$render`
             */
            function onNgModelRender() {
                var selectedOptionsHash = {};

                if (angular.isArray(ngModelController.$modelValue)) {
                    _labels.length = 0;
                    _selectedOptions = ngModelController.$modelValue;

                    _selectedOptions.forEach(function(option) {
                        selectedOptionsHash[option] = true;

                        _labels.push(multiselect.getLabel(option));
                    });
                }

                multiselect.getOptions().forEach(function(option, index) {
                    _optionHash[index] = option;

                    scope.options.push({
                        id: index,
                        label: multiselect.getLabel(option),
                        selected: Boolean(selectedOptionsHash[option])
                    });
                });

                setSelectedLabel();
            }

            /**
             * @name amoMultiselect#setSelectedLabel
             * @description Sets the selected label
             */
            function setSelectedLabel() {
                var label = 'Select...';

                if (_labels.length > 0) {
                    label = _labels.join(', ');
                }

                scope.selectedLabel = label;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#toggleSelectedState
             * @description Toggles the selected state of the option with the specified ID
             * @param {Event} clickEvent JavaScript click event
             * @param {*} option Selected option
             */
            function toggleSelectedState(clickEvent, option) {
                clickEvent.stopPropagation();

                option.selected = !option.selected;

                // TODO: Optimize
                exposeSelectedOptions();
            }
        }
    }

})();
