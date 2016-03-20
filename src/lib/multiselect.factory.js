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
        var _optionsRegularExpression = /^\s*(?:(\S+)\s+as\s+)?(\S+)(?:\s+group\s+by\s+(\S+?))?\s+for\s+(\S+)\s+in\s+(\S+)\s*$/;
                                       //0000000111110000000000222220000000000000000000333333000000000004444400000000555550000

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
            self.getLabel = getLabel;
            self.getOption = getOption;
            self.getOptionsExpression = getOptionsExpression;
            self.getOptions = getOptions;
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
