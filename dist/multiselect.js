// AngularJS Multiselect
// https://github.com/namoscato/angular-multiselect
// 
// Version: 1.2.3
// License: MIT

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @module amo.multiselect
     * @name amo.multiselect
     */
    angular.module('amo.multiselect', [
        'ui.bootstrap.dropdown'
    ]);

})();

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
            filterText: 'Search...',
            isDeselectAllEnabled: true,
            isDisabled: false,
            isFilterEnabled: true,
            isSelectAllEnabled: true,
            selectAllText: 'Select All',
            selectedSuffixSingularText: 'item',
            selectedSuffixText: 'items',
            selectText: 'Select...'
        });

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
            templateUrl: 'amo/multiselect/multiselect-dropdown.html'
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
                if (self.state.isSelectAllCheckboxVisible) {
                    return self.isAllSelected ? self.text.deselectAll : self.text.selectAll;
                } else if (self.state.isSelectAllEnabled) {
                    return self.text.selectAll;
                }

                return self.text.deselectAll;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#toggleAllSelectedState
             * @description Toggles the selected state for all options
             */
            function toggleAllSelectedState() {
                var state;

                self.isAllSelected = !self.isAllSelected;

                if (!self.state.isSelectAllEnabled) {
                    state = false;
                } else if (!self.state.isDeselectAllEnabled) {
                    state = true;
                } else {
                    state = self.isAllSelected;
                }

                angular.forEach(self.optionsFiltered, function(optionsFiltered) {
                    angular.forEach(optionsFiltered, function(option) {
                        option.selected = state;
                    });
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

    MultiselectDirective.$inject = ["$compile", "$parse", "$timeout", "AmoMultiselectFactory", "amoMultiselectConfig", "amoMultiselectFormatService", "filterFilter"];
    angular
        .module('amo.multiselect')
        .directive('amoMultiselect', MultiselectDirective);

    /**
     * @ngdoc directive
     * @module amo.multiselect
     * @name amoMultiselect
     * @requires $compile
     * @requires $parse
     * @requires $timeout
     * @requires AmoMultiselectFactory
     * @requires amoMultiselectConfig
     * @requires amoMultiselectFormatService
     * @requires filterFilter
     */
    function MultiselectDirective($compile, $parse, $timeout, AmoMultiselectFactory, amoMultiselectConfig, amoMultiselectFormatService, filterFilter) {

        return {
            link: link,
            require: 'ngModel',
            restrict: 'E'
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
                _isDeselectAllEnabled = getSettingValue('isDeselectAllEnabled', true),
                _isInternalChange,
                _isSelectAllEnabled = getSettingValue('isSelectAllEnabled', true),
                _labels = [],
                _onChange = attrs.onChange ? $parse(attrs.onChange) : angular.noop,
                _onToggleDropdown = attrs.onToggleDropdown ? $parse(attrs.onToggleDropdown) : angular.noop,
                _selectedOptions = [];

            var multiselect = new AmoMultiselectFactory(attrs.options, parentScope),
                scope = parentScope.$new(),
                self = {};

            scope.multiselectDropdown = self;

            // Variables
            self.groups = [];
            self.groupOptions = {};
            self.optionsFiltered = {};
            self.filter = {};
            self.state = {
                isDeselectAllEnabled: _isDeselectAllEnabled,
                isDisabled: getSettingValue('isDisabled', true),
                isFilterEnabled: getSettingValue('isFilterEnabled', true),
                isSelectAllEnabled: _isSelectAllEnabled,
                isSelectAllVisible: _isSelectAllEnabled || _isDeselectAllEnabled,
                isSelectAllCheckboxVisible: _isSelectAllEnabled && _isDeselectAllEnabled
            };
            self.text = {
                deselectAll: getSettingValue('deselectAllText'),
                filter: getSettingValue('filterText'),
                selectAll: getSettingValue('selectAllText')
            };

            // Methods
            self.exposeSelectedOptions = exposeSelectedOptions;
            self.getSelectedCount = getSelectedCount;
            self.hasSelectedMultipleItems = hasSelectedMultipleItems;
            self.isGroupVisible = isGroupVisible;
            self.isSelectAllToggleDisabled = isSelectAllToggleDisabled;
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
                self.groupOptions = {};
                self.optionsFiltered = {};

                self.groups = multiselect.getGroups();

                // Iterate through original options and create exposed model
                angular.forEach(multiselect.getOptions(), function(options, group) {
                    angular.forEach(options, function(option, index) {
                        selected = false;
                        value = multiselect.getValue(option);

                        for (i = 0; i < _selectedOptions.length; i++) {
                            if (angular.equals(_selectedOptions[i], value)) {
                                selected = true;
                                addLabel(option);
                                break;
                            }
                        }

                        if (angular.isUndefined(self.groupOptions[group])) {
                            self.groupOptions[group] = [];
                        }

                        self.groupOptions[group].push({
                            id: index,
                            label: multiselect.getLabel(option),
                            value: value,
                            selected: selected
                        });
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
                _selectedOptions = [];

                angular.forEach(self.groupOptions, function(options, group) {
                    angular.forEach(options, function(optionModel, index) {
                        if (!optionModel.selected) {
                            return;
                        }

                        option = multiselect.getOption(index, group);

                        addLabel(option);

                        _selectedOptions.push(multiselect.getValue(option));
                    });
                });

                _isInternalChange = true; // Prevent unnecessary $watch logic

                ngModelController.$setViewValue(_selectedOptions);

                _onChange(scope, {
                    label: setSelectedLabel()
                });
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#getSelectedCount
             * @description Returns the count of selected options
             * @returns {Number}
             */
            function getSelectedCount() {
                return _selectedOptions.length;
            }

            /**
             * @name amoMultiselect#getSettingValue
             * @description Returns the value of the specified setting
             * @param {String} setting
             * @param {Boolean} [isExpression=false]
             * @returns {*}
             */
            function getSettingValue(setting, isExpression) {
                if (angular.isDefined(attrs[setting])) {
                    return isExpression ? $parse(attrs[setting])(parentScope) : attrs[setting];
                }

                return amoMultiselectConfig[setting];
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#hasSelectedMultipleItems
             * @description Determines whether or not multiple items are selected
             * @returns {Boolean}
             */
            function hasSelectedMultipleItems() {
                return getSelectedCount() > 1;
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

                // Implement custom empty logic
                ngModelController.$isEmpty = function(value) {
                    return !angular.isArray(value) || value.length === 0;
                };
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#isGroupVisible
             * @description Determines whether or not the group is visible
             * @param {String} group
             * @returns {Boolean}
             */
            function isGroupVisible(group) {
                if (!multiselect.isGrouped()) {
                    return false;
                }

                return filterFilter(self.groupOptions[group], self.filter).length > 0;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#isSelectAllToggleDisabled
             * @description Determines whether or not the select/deselect toggle is disabled
             * @returns {Boolean}
             */
            function isSelectAllToggleDisabled() {
                if (!_isSelectAllEnabled) { // Deselect All
                    return _selectedOptions.length === 0;
                } else if (!_isDeselectAllEnabled) { // Select All
                    return _selectedOptions.length === multiselect.getOptionsCount();
                }
                
                return false;
            }

            /**
             * @ngdoc method
             * @name amoMultiselect#onToggleDropdown
             * @description Handler executed when dropdown opens or closes
             * @param {Boolean} isOpen
             */
            function onToggleDropdown(isOpen) {
                if (!isOpen) {
                    $timeout(function() {
                        self.filter = {};
                    });
                }

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
                var label = attrs.selectText || amoMultiselectConfig.selectText;

                if (_labels.length > 0) {
                    if (angular.isDefined(_labels[0])) { // Support undefined labels
                        label = amoMultiselectFormatService.joinLabels(_labels);
                    } else {
                        label = amoMultiselectFormatService.pluralize(_labels, attrs.selectedSuffixText, attrs.selectedSuffixSingularText || attrs.selectedSuffixText);
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

    MultiselectFactory.$inject = ["$parse"];
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

        /**
         * @name AmoMultiselectFactory#_optionsRegularExpression
         * 
         * @description
         * Options attribute value regular expression
         *
         * 1. value expression (selectFunction)
         * 2. label expression (labelFunction)
         * 3. group by expression (groupFunction)
         * 4. array item variable name (value)
         * 5. options array expression (optionsExpression)
         */
        var _optionsRegularExpression = /^\s*(?:([\s\S]+?)\s+as\s+)?([\s\S]+?)(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+([\$\w][\$\w]*)\s+in\s+([\s\S]+?)\s*$/;
                                       //000000011111111110000000000222222222200000000000000000003333333333300000000004444444444444440000000055555555550000

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
            self.getGroup = getGroup;
            self.getGroups = getGroups;
            self.getLabel = getLabel;
            self.getOption = getOption;
            self.getOptions = getOptions;
            self.getOptionsCount = getOptionsCount;
            self.getOptionsExpression = getOptionsExpression;
            self.getValue = getValue;
            self.isGrouped = isGrouped;
            self.setOptions = setOptions;

            // Initialization
            initialize();

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getGroup
             * @description Returns the group for the specified option
             * @param {Object} option
             * @returns {String|Null}
             */
            function getGroup(option) {
                if (!isGrouped()) {
                    return null;
                }

                return _parse.groupFunction(scope, getLocals(option));
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getGroups
             * @description Returns the array of groups
             * @returns {Array}
             */
            function getGroups(option) {
                return _parse.groups;
            }

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
             * @param {String} [group=null] Optional group key
             * @returns {*}
             */
            function getOption(index, group) {
                if (angular.isUndefined(group)) {
                    group = null;
                }

                return _parse.groupOptions[group][index];
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getOptions
             * @description Returns the set of options, hashed by group
             * @returns {Object}
             */
            function getOptions() {
                return _parse.groupOptions;
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getOptionsCount
             * @description Returns the number of options
             * @returns {Number}
             */
            function getOptionsCount() {
                return _parse.optionsCount;
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
                    throw new Error('Expected "' + options + '" to be in form of "[_select_ as] _label_ [group by _group_] for _value_ in _array_"');
                }

                _parse = {
                    groupFunction: angular.isDefined(expression[3]) ? $parse(expression[3]) : null,
                    labelFunction: $parse(expression[2]),
                    optionsExpression: expression[5],
                    selectFunction: $parse(angular.isDefined(expression[1]) ? expression[1] : expression[4]),
                    value: expression[4]
                };
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#isGrouped
             * @description Determines whether or not the multiselect is grouped
             * @returns {Boolean}
             */
            function isGrouped() {
                return _parse.groupFunction !== null;
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#setOptions
             * @description Sets the options array
             * @param {Array} options
             * @returns {Object} Set of options, hashed by group
             */
            function setOptions(options) {
                var group;

                if (!angular.isArray(options)) {
                    throw new Error('Expected "' + _parse.optionsExpression + '" to be Array');
                }

                _parse.groups = [];
                _parse.groupOptions = {};
                _parse.optionsCount = options.length;

                options.forEach(function(option) {
                    group = getGroup(option);

                    if (angular.isUndefined(_parse.groupOptions[group])) {
                        _parse.groups.push(group);
                        _parse.groupOptions[group] = [];
                    }

                    _parse.groupOptions[group].push(option);
                });

                return _parse.groupOptions;
            }

            return self;
        };
    }

})();

(function() {
    'use strict';

    MultiselectFormatService.$inject = ["amoMultiselectConfig"];
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
         * @param {Array} labels
         * @param {String} [suffix='items'] Default phrase suffix
         * @param {String} [singularSuffix='item'] Singular suffix
         * @returns {String}
         */
        function pluralize(labels, suffix, singularSuffix) {
            var label = labels.length + ' ';

            if (labels.length === 1) {
                label += singularSuffix || amoMultiselectConfig.selectedSuffixSingularText;
            } else {
                label += suffix || amoMultiselectConfig.selectedSuffixText;
            }

            return label;
        }
    }

})();

angular.module('amo.multiselect').run(['$templateCache', function($templateCache) {$templateCache.put('amo/multiselect/multiselect-dropdown.html','<div class="btn-group btn-group-multiselect" auto-close="outsideClick" ng-attr-title="{{ multiselectDropdown.selectedLabel }}" ng-class="{ \'state-selected-multiple\': multiselectDropdown.hasSelectedMultipleItems() }" on-toggle="multiselectDropdown.onToggleDropdown(open)" uib-dropdown> <button type="button" class="btn btn-default" ng-disabled="multiselectDropdown.state.isDisabled" uib-dropdown-toggle> <span class="text" ng-bind="multiselectDropdown.selectedLabel"></span> <span class="badge" ng-bind="multiselectDropdown.getSelectedCount()"></span> <span class="caret"></span> </button> <div uib-dropdown-menu> <input type="text" class="form-control" ng-if="::multiselectDropdown.state.isFilterEnabled" ng-model="multiselectDropdown.filter.label" placeholder="{{ ::multiselectDropdown.text.filter }}"> <ul class="dropdown-menu-list list-unstyled"> <li ng-if="::multiselectDropdown.state.isSelectAllVisible"> <a ng-class="{ \'text-muted\': multiselectDropdown.isSelectAllToggleDisabled() }" ng-click="multiselectDropdown.toggleAllSelectedState()"> <input type="checkbox" ng-if="::multiselectDropdown.state.isSelectAllCheckboxVisible" ng-model="multiselectDropdown.isAllSelected"> <span ng-bind="multiselectDropdown.getSelectAllLabel()"></span> </a> </li> <li class="divider" ng-if="::multiselectDropdown.state.isSelectAllVisible"></li> <li class="dropdown-header" ng-bind="group" ng-if="multiselectDropdown.isGroupVisible(group)" ng-repeat-start="group in multiselectDropdown.groups"> </li> <li ng-repeat="option in multiselectDropdown.optionsFiltered[group] = (multiselectDropdown.groupOptions[group] | filter : multiselectDropdown.filter)"> <a ng-attr-title="{{ option.label }}" ng-click="multiselectDropdown.toggleSelectedState(option)"> <input type="checkbox" ng-model="option.selected"> <span ng-bind="option.label"></span> </a> </li> <li ng-repeat-end></li> </ul> </div> </div> ');}]);