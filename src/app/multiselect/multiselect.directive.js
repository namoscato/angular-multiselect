(function() {
    'use strict';

    angular
        .module('amoscato.multiselect')
        .directive('multiselect', MultiselectDirective);

    /**
     * @ngdoc directive
     * @module amoscato.multiselect
     * @name multiselect
     * @requires $parse
     */
    function MultiselectDirective($parse) {

        return {
            link: link,
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            terminal: true,
            templateUrl: 'app/multiselect/multiselect.html'
        };

        /**
         * @name multiselect#link
         * @description Directive's link function
         * @param {Object} scope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         * @param {Object} ngModelController
         */
        function link(scope, element, attrs, ngModelController) {

            var _labels = [],
                _optionHash = {},
                _selectedOptions = [];

            // Variables
            scope.options = [];

            // Methods
            scope.toggleSelectedState = toggleSelectedState;

            // Initialization
            initialize();

            /**
             * @name multiselect#exposeSelectedOptions
             * @description Exposes the selected options
             */
            function exposeSelectedOptions() {
                _labels.length = 0;
                _selectedOptions.length = 0;

                scope.options.forEach(function(option, index) {
                    if (!option.selected) { return; }

                    // use _label_
                    _labels.push(_optionHash[index]);

                    // use _select_ regex thing
                    _selectedOptions.push(_optionHash[index]);
                });

                ngModelController.$setViewValue(_selectedOptions);

                setSelectedLabel();
            }

            /**
             * @name multiselect#initialize
             * @description Initializes the directive
             */
            function initialize() {
                var expression = attrs.options.match(/(\S+) for (\S+) in (\S+)/),
                    options;

                if (expression === null) {
                    throw new Error('Expected expression in form of "_label_ for _value_ in _array_"');
                }

                options = $parse(expression[3])(scope);

                if (!angular.isArray(options)) {
                    throw new Error('Expected "' + expression[3] + '" to be Array');
                }

                options.forEach(function(option, index) {
                    _optionHash[index] = option;

                    scope.options.push({
                        id: index,
                        label: option
                    });
                });

                ngModelController.$render = function() {
                    if (angular.isArray(ngModelController.$modelValue)) {
                        _selectedOptions = ngModelController.$modelValue;

                        // TODO: Set `selected` property of selected options
                    }

                    setSelectedLabel();
                };
            }

            /**
             * @name multiselect#setSelectedLabel
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
             * @name multiselect#toggleSelectedState
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
