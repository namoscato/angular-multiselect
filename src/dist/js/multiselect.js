(function() {
    'use strict';

    /**
     * @ngdoc module
     * @module amo.multiselect
     * @name amo.multiselect
     */
    angular.module('amo.multiselect', []);

})();

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

(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .directive('amoMultiselectDropdown', MultiselectDropdownDirective);

    /**
     * @ngdoc directive
     * @module amo.multiselect
     * @name amoMultiselectDropdown
     */
    function MultiselectDropdownDirective() {

        return {
            link: link,
            restrict: 'E',
            templateUrl: 'multiselect/multiselect-dropdown.html'
        };

        /**
         * @name amoMultiselectDropdown#link
         * @description Directive's link function
         * @param {Object} scope Angular scope object
         * @param {Object} element jQuery object
         * @param {Object} attrs Hash object of attribute names and values
         */
        function link(scope, element, attrs) {
            var self = scope.multiselectDropdown;

            // Methods
            self.getSelectAllLabel = getSelectAllLabel;
            self.toggleAllSelectedState = toggleAllSelectedState;
            self.toggleSelectedState = toggleSelectedState;

            /**
             * @ngdoc method
             * @name amoMultiselect#getSelectAllLabel
             * @description Returns the select/deselect all label
             * @returns {String}
             */
            function getSelectAllLabel() {
                return self.isAllSelected ? self.text.deselectAll : self.text.selectAll;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#toggleAllSelectedState
             * @description Toggles the selected state for all options
             */
            function toggleAllSelectedState() {
                self.isAllSelected = !self.isAllSelected;

                self.optionsFiltered.forEach(function(option) {
                    option.selected = self.isAllSelected;
                });

                self.exposeSelectedOptions();
            }

            /**
             * @ngdoc method
             * @name amoMultiselectDropdown#toggleSelectedState
             * @description Toggles the selected state of the option with the specified ID
             * @param {*} option Selected option
             */
            function toggleSelectedState(option) {
                option.selected = !option.selected;

                self.exposeSelectedOptions();
            }
        }
    }

})();

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
     * @requires $parse
     * @requires AmoMultiselectFactory
     */
    function MultiselectDirective($compile, $parse, AmoMultiselectFactory) {

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

            var _exposeLabel = attrs.label ? $parse(attrs.label) : angular.noop,
                _isInternalChange,
                _labels = [],
                _onChange = attrs.onChange ? $parse(attrs.onChange) : angular.noop,
                _onToggleDropdown = attrs.onToggleDropdown ? $parse(attrs.onToggleDropdown) : angular.noop,
                _selectedOptions = [];

            var multiselect = new AmoMultiselectFactory(attrs.options, parentScope),
                scope = parentScope.$new(),
                self = {};

            scope.multiselectDropdown = self;

            // Variables
            self.identifier = attrs.id;
            self.options = [];
            self.search = {};
            self.text = {
                deselectAll: attrs.deselectAllText || 'Deselect All',
                search: attrs.searchText || 'Search...',
                selectAll: attrs.selectAllText || 'Select All',
            };

            // Methods
            self.getSelectedCount = getSelectedCount;
            self.exposeSelectedOptions = exposeSelectedOptions;
            self.hasSelectedItems = hasSelectedItems;
            self.onToggleDropdown = onToggleDropdown;

            // Initialization
            initialize();

            /**
             * @ngdoc method
             * @name amoMultiselect#addLabel
             * @description Adds the formatted label for the specified option
             * @param {*} option
             */
            function addLabel(option) {
                _labels.push(multiselect.getLabel(option));
            }

            /**
             * @name amoMultiselect#exposeOptions
             * @description Exposes the multiselect options
             */
            function exposeOptions() {
                var i,
                    selected,
                    value;

                _labels.length = 0;
                self.options.length = 0;

                // Iterate through original options and create exposed model
                multiselect.getOptions().forEach(function(option, index) {
                    selected = false;
                    value = multiselect.getValue(option);

                    for (i = 0; i < _selectedOptions.length; i++) {
                        if (angular.equals(_selectedOptions[i], value)) {
                            selected = true;
                            addLabel(option);
                            break;
                        }
                    }

                    self.options.push({
                        id: index,
                        label: multiselect.getLabel(option),
                        value: value,
                        selected: selected
                    });
                });

                setSelectedLabel();
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#exposeSelectedOptions
             * @description Exposes the selected options
             */
            function exposeSelectedOptions() {
                var option;

                _labels.length = 0;
                _selectedOptions.length = 0;

                self.options.forEach(function(optionModel, index) {
                    if (!optionModel.selected) { return; }

                    option = multiselect.getOption(index);

                    addLabel(option);

                    _selectedOptions.push(multiselect.getValue(option));
                });

                _isInternalChange = true; // Prevent unnecessary $watch logic

                ngModelController.$setViewValue(_selectedOptions);

                _onChange(scope, {
                    label: setSelectedLabel()
                });
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#initialize
             * @description Returns the count of selected options
             * @returns {Number}
             */
            function getSelectedCount() {
                return _selectedOptions.length;
            }

            /**
             * @name amoMultiselect#initialize
             * @description Initializes the directive
             */
            function initialize() {
                element.append($compile('<amo-multiselect-dropdown></amo-multiselect-dropdown>')(scope));

                parentScope.$on('$destroy', function() {
                    scope.$destroy();
                });

                // Watch for option array changes
                parentScope.$watch(multiselect.getOptionsExpression(), function(options) {
                    multiselect.setOptions(options);
                    exposeOptions();
                }, true);
                
                // Watch for (external) model changes
                parentScope.$watch(function() {
                    return ngModelController.$modelValue;
                }, function(modelValue) {
                    // TODO: Determine if there is a better way to do this
                    if (_isInternalChange) {
                        _isInternalChange = false;
                        return;
                    }

                    if (angular.isArray(modelValue)) {
                        _selectedOptions = modelValue;
                    }

                    exposeOptions();
                }, true);
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#hasSelectedItems
             * @description Determines whether or not items are selected
             * @returns {Boolean}
             */
            function hasSelectedItems() {
                return _selectedOptions.length > 0;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#onToggleDropdown
             * @description Handler executed when dropdown opens or closes
             */
            function onToggleDropdown(isOpen) {
                _onToggleDropdown(scope, {
                    isOpen: isOpen
                });
            }

            /**
             * @name amoMultiselect#setSelectedLabel
             * @description Sets the selected label
             * @returns {String} New label
             */
            function setSelectedLabel() {
                var label = attrs.selectText || 'Select...';

                if (_labels.length > 0) {
                    if (angular.isDefined(_labels[0])) { // Support undefined labels
                        label = _labels.join(', ');
                    } else {
                        label = _labels.length + ' ';

                        if (_labels.length === 1) {
                            label += attrs.selectedSuffixSingularText || 'item';
                        } else {
                            label += attrs.selectedSuffixText || attrs.selectedSuffixSingularText || 'items';
                        }
                    }
                }

                self.selectedLabel = label;

                if (angular.isFunction(_exposeLabel.assign)) {
                    _exposeLabel.assign(parentScope, label);
                }

                return label;
            }
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .factory('AmoMultiselectFactory', MultiselectFactory);

    /**
     * @ngdoc factory
     * @module amo.multiselect
     * @name AmoMultiselectFactory
     * @requires $parse
     */
    function MultiselectFactory($parse) {

        var _optionsRegularExpression = /^\s*(?:(\S+)\s+as\s+)?(\S+)\s+for\s+(\S+)\s+in\s+(\S+)\s*$/;
        
        /**
         * @ngdoc method
         * @name AmoMultiselectFactory#MultiselectFactoryConstructor
         * @description Constructs the multiselect parse factory with the specified options string
         * @param {String} options Value of `options` attribute
         * @param {Object} scope Parent scope object
         * @returns {Object} Object of public methods
         */
        return function MultiselectFactoryConstructor(options, scope) {
            var self = this;

            var _parse;

            // Methods
            self.getLabel = getLabel;
            self.getOption = getOption;
            self.getOptionsExpression = getOptionsExpression;
            self.getOptions = getOptions;
            self.getValue = getValue;
            self.setOptions = setOptions;

            // Initialization
            initialize();

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getLabel
             * @description Returns the label for the specified option
             * @param {*} option
             * @returns {String}
             */
            function getLabel(option) {
                return _parse.labelFunction(scope, getLocals(option));
            }

            /**
             * @name AmoMultiselectFactory#getLocals
             * @description Returns the locals object for the specified option
             * @param {*} option
             * @returns {Object}
             */
            function getLocals(option) {
                var locals = {};

                locals[_parse.value] = option;

                return locals;
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getOption
             * @description Returns the option with the specified index
             * @param {Number} index Index of option
             * @returns {*}
             */
            function getOption(index) {
                return _parse.options[index];
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getOptionsExpression
             * @description Returns the options expression
             * @returns {String}
             */
            function getOptionsExpression() {
                return _parse.optionsExpression;
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getOptions
             * @description Returns the array of options
             * @returns {*}
             */
            function getOptions() {
                return _parse.options;
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getValue
             * @description Returns the value for the specified option
             * @param {*} option
             * @returns {*}
             */
            function getValue(option) {
                return _parse.selectFunction(scope, getLocals(option));
            }

            /**
             * @name AmoMultiselectFactory#initialize
             * @description Initializes the multiselect factory constructor
             */
            function initialize() {
                var expression = options.match(_optionsRegularExpression);

                if (expression === null) {
                    throw new Error('Expected "' + options + '" to be in form of "[_select_ as] _label_ for _value_ in _array_"');
                }

                _parse = {
                    labelFunction: $parse(expression[2]),
                    optionsExpression: expression[4],
                    selectFunction: $parse(angular.isDefined(expression[1]) ? expression[1] : expression[3]),
                    value: expression[3]
                };
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#setOptions
             * @description Sets the options array
             * @param {Array} options
             * @returns {Array} Reference to `options`
             */
            function setOptions(options) {
                if (!angular.isArray(options)) {
                    throw new Error('Expected "' + _parse.optionsExpression + '" to be Array');
                }

                _parse.options = options;

                return _parse.options;
            }

            return self;
        };
    }

})();

angular.module("amo.multiselect").run(["$templateCache", function($templateCache) {$templateCache.put("multiselect/multiselect-dropdown.html","<div\n    amo-multiselect-dropdown-menu\n    class=\"btn-group btn-group-multiselect dropdown\"\n    ng-attr-title=\"{{ multiselectDropdown.selectedLabel }}\"\n    ng-class=\"{ \'state-selected\': multiselectDropdown.hasSelectedItems() }\"\n    on-toggle=\"multiselectDropdown.onToggleDropdown(open)\">\n    <button\n        type=\"button\"\n        class=\"btn btn-default dropdown-toggle\"\n        data-toggle=\"dropdown\"\n        ng-attr-data-beh=\"multiselect-{{ multiselectDropdown.identifier }}\">\n        <span class=\"text\" ng-bind=\"multiselectDropdown.selectedLabel\"></span>\n        <span class=\"badge\" ng-bind=\"multiselectDropdown.getSelectedCount()\"></span>\n        <span class=\"caret\"></span>\n    </button>\n    <div class=\"dropdown-menu\">\n        <input\n            type=\"text\"\n            class=\"form-control\"\n            ng-model=\"multiselectDropdown.search.label\"\n            placeholder=\"{{ multiselectDropdown.text.search }}\">\n        <ul class=\"dropdown-menu-list list-unstyled\">\n            <li>\n                <a ng-click=\"multiselectDropdown.toggleAllSelectedState()\">\n                    <input type=\"checkbox\" ng-model=\"multiselectDropdown.isAllSelected\">\n                    <span ng-bind=\"multiselectDropdown.getSelectAllLabel()\"></span>\n                </a>\n            </li>\n            <li class=\"divider\"></li>\n            <li ng-repeat=\"option in multiselectDropdown.optionsFiltered = (multiselectDropdown.options | filter : multiselectDropdown.search)\">\n                <a ng-click=\"multiselectDropdown.toggleSelectedState(option)\">\n                    <input type=\"checkbox\" ng-model=\"option.selected\">\n                    <span ng-bind=\"option.label\"></span>\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>\n");}]);