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
            var _exposeLabel = attrs.label ? $parse(attrs.label) : angular.noop;
            var _isDeselectAllEnabled = getSettingValue('isDeselectAllEnabled', true);
            var _isInternalChange;
            var _isSelectAllEnabled = getSettingValue('isSelectAllEnabled', true);
            var _labels = [];
            var _onChange = attrs.onChange ? $parse(attrs.onChange) : angular.noop;
            var _onToggleDropdown = attrs.onToggleDropdown ? $parse(attrs.onToggleDropdown) : angular.noop;
            var _selectedOptions = [];

            var multiselect = new AmoMultiselectFactory(attrs.options, parentScope);
            var scope = parentScope.$new();
            var self = {
                name: attrs.name
            };

            scope.multiselectDropdown = self;

            // Variables
            self.groups = [];
            self.groupOptions = {};
            self.optionsFiltered = {};
            self.filter = {};
            self.limit = getSettingValue('limitTo', true);
            self.state = {
                isDeselectAllEnabled: _isDeselectAllEnabled,
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
            self.countOptionsAfterLimit = countOptionsAfterLimit;
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
             * @ngdoc method
             * @name amoMultiselect#countOptionsAfterLimit
             * @description Determines whether or not there are options after the limit is imposed for the specified group
             * @param {String} group The group to count options for
             * @returns {Boolean}
             */
            function countOptionsAfterLimit(group) {
                // if the limit isn't set, then all items are returned
                if (angular.isUndefined(self.limit)) {
                    return 0;
                }

                // compute the difference
                var diff = self.optionsFiltered[group].length - self.limit;
                return (diff > 0) ? diff : 0;
            }

            /**
             * @name amoMultiselect#exposeOptions
             * @description Exposes the multiselect options
             */
            function exposeOptions() {
                var i;
                var selected;
                var value;

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

                if (attrs.isDisabled) { // Watch for is-disabled option changes
                    parentScope.$watch(attrs.isDisabled, function (isDisabled) {
                        self.state.isDisabled = Boolean(isDisabled);
                    });
                }

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

                // If the limit is defined but falsey (0, false, null) then disable the limit functionality
                if (angular.isDefined(self.limit) && !Boolean(self.limit)) {
                    self.limit = undefined;
                }
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
                var label;

                if (0 === _selectedOptions.length) {
                    label = attrs.selectText || amoMultiselectConfig.selectText;
                } else if (_labels.length > 0 && angular.isDefined(_labels[0])) { // Support undefined labels
                    label = amoMultiselectFormatService.joinLabels(_labels);
                } else {
                    label = amoMultiselectFormatService.pluralize(
                        _selectedOptions.length,
                        attrs.selectedSuffixText,
                        attrs.selectedSuffixSingularText || attrs.selectedSuffixText
                    );
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
