(function() {
    'use strict';

    angular
        .module('amo.multiselect')
        .service('AmoMultiselectFactory', MultiselectFactory);

    /**
     * @ngdoc service
     * @module amo.multiselect
     * @name AmoMultiselectFactory
     * @requires $parse
     */
    function MultiselectFactory($parse) {

        var _optionsRegularExpression = /(\S+) for (\S+) in (\S+)/;
        
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
            self.getOptions = getOptions;

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
                var locals = {};

                locals[_parse.value] = option;

                return $parse(_parse.label)(scope, locals);
            }

            /**
             * @ngdoc method
             * @name AmoMultiselectFactory#getOptions
             * @description Returns the array of options
             * @returns {Array}
             */
            function getOptions() {
                return _parse.options;
            }

            /**
             * @name AmoMultiselectFactory#initialize
             * @description Initializes the multiselect factory constructor
             */
            function initialize() {
                var expression = options.match(_optionsRegularExpression);

                if (expression === null) {
                    throw new Error('Expected "' + options + '" to be in form of "_label_ for _value_ in _array_"');
                }

                _parse = {
                    label: expression[1],
                    options: $parse(expression[3])(scope),
                    value: expression[2]
                };

                if (!angular.isArray(_parse.options)) {
                    throw new Error('Expected "' + expression[3] + '" to be Array');
                }
            }

            return self;
        };
    }

})();
