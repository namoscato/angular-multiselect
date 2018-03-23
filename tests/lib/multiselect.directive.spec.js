describe('amoMultiselect', function() {
    var result;
    var parentScope;
    var scope;
    var target;

    var html;

    var timeout;
    var amoMultiselectConfigSpy;
    var amoMultiselectFactorySpy;
    var amoMultiselectFactoryInstanceSpy;
    var amoMultiselectFormatServiceSpy;
    var filterFilterSpy;

    var optionsMock;

    beforeEach(module('amo.multiselect'));

    beforeEach(function() {
        amoMultiselectConfigSpy = {
            deselectAllText: 'Deselect All',
            filterText: 'Search...',
            isDeselectAllEnabled: true,
            isFilterEnabled: true,
            isSelectAllEnabled: true,
            limitTo: 500,
            selectAllText: 'Select All',
            selectedSuffixSingularText: 'item',
            selectedSuffixText: 'items',
            selectText: 'Select...'
        };

        amoMultiselectFactoryInstanceSpy = jasmine.createSpyObj('AmoMultiselectFactory()', [
            'getGroup',
            'getGroups',
            'getLabel',
            'getOption',
            'getOptions',
            'getOptionsCount',
            'getOptionsExpression',
            'getValue',
            'isGrouped',
            'setOptions',
        ]);

        optionsMock = [
            'One',
            'Two'
        ];

        amoMultiselectFactoryInstanceSpy.getGroup.and.returnValue(null);

        amoMultiselectFactoryInstanceSpy.getGroups.and.returnValue([
            null
        ]);

        amoMultiselectFactoryInstanceSpy.getOption.and.callFake(function(index) {
            return optionsMock[index];
        });

        amoMultiselectFactoryInstanceSpy.getOptions.and.returnValue({
            null: optionsMock
        });

        amoMultiselectFactoryInstanceSpy.getOptionsCount.and.returnValue(optionsMock.length);

        amoMultiselectFactoryInstanceSpy.getOptionsExpression.and.returnValue('options');

        amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
            return 'LABEL ' + option
        });

        amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
            return 'VALUE ' + option
        });
    });

    beforeEach(module(function($provide) {
        $provide.constant('amoMultiselectConfig', amoMultiselectConfigSpy);

        $provide.factory('AmoMultiselectFactory', function() {
            amoMultiselectFactorySpy = jasmine.createSpy('AmoMultiselectFactory');
            amoMultiselectFactorySpy.and.returnValue(amoMultiselectFactoryInstanceSpy);

            return amoMultiselectFactorySpy;
        });

        $provide.service('amoMultiselectFormatService', function() {
            amoMultiselectFormatServiceSpy = jasmine.createSpyObj('amoMultiselectFormatService', [
                'joinLabels',
                'pluralize'
            ]);
            amoMultiselectFormatServiceSpy.joinLabels.and.returnValue('JOIN');
            amoMultiselectFormatServiceSpy.pluralize.and.returnValue('PLURALIZE');
            return amoMultiselectFormatServiceSpy;
        });
    }));

    function compile(html, locals) {
        inject(function($compile, $rootScope, $timeout, filterFilter) {
            var element = angular.element(html);

            timeout = $timeout;
            filterFilterSpy = filterFilter;

            parentScope = $rootScope.$new();

            $compile(element)(angular.extend(parentScope, locals));

            parentScope.$digest();

            element = element.find('amo-multiselect-dropdown');

            scope = element.scope();
            target = scope.multiselectDropdown;
        });
    }

    describe('When compiling the directive with an array of strings', function() {
        beforeEach(function() {
            html = '<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>';
        });

        describe('without anything selected', function() {
            beforeEach(function() {
                compile(html, {
                    options: optionsMock
                });
            });

            it('should create new multiselect factory', function() {
                expect(amoMultiselectFactorySpy).toHaveBeenCalledWith('option for option in options', jasmine.any(Object));
            });

            it('should initialize filter model', function() {
                expect(target.filter).toEqual({});
            });

            it('should expose state', function() {
                expect(target.state).toEqual({
                    isDeselectAllEnabled: true,
                    isFilterEnabled: true,
                    isSelectAllEnabled: true,
                    isSelectAllVisible: true,
                    isSelectAllCheckboxVisible: true
                });
            });

            it('should expose text', function() {
                expect(target.text).toEqual({
                    deselectAll: 'Deselect All',
                    filter: 'Search...',
                    selectAll: 'Select All',
                });
            });

            it('should set selected count to 0', function() {
                expect(target.getSelectedCount()).toEqual(0);
            });

            it('should set multiselect options', function() {
                expect(amoMultiselectFactoryInstanceSpy.setOptions).toHaveBeenCalledWith([
                    'One',
                    'Two'
                ]);
            });

            it('should expose groups', function() {
                expect(target.groups).toEqual([
                    null
                ]);
            });

            it('should set the default limit', function() {
                expect(target.limit).toEqual(500);
            });

            it('should expose options', function() {
                expect(target.optionsFiltered).toEqual({
                    null: [
                        {
                            id: 0,
                            label: 'LABEL One',
                            value: 'VALUE One',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            id: 1,
                            label: 'LABEL Two',
                            value: 'VALUE Two',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        }
                    ]
                });
            });

            it('should enable select all toggle', function() {
                expect(target.isSelectAllToggleDisabled()).toEqual(false);
            });

            describe('and an option is added', function() {
                beforeEach(function() {
                    parentScope.options.push('Three');

                    parentScope.$digest();
                });

                it('should set multiselect with added option', function() {
                    expect(amoMultiselectFactoryInstanceSpy.setOptions).toHaveBeenCalledWith([
                        'One',
                        'Two',
                        'Three'
                    ]);
                });

                it('should set selected count to 0', function() {
                    expect(target.getSelectedCount()).toEqual(0);
                });

                it('should add option', function() {
                    expect(target.groupOptions).toEqual({
                        null: [
                            {
                                id: 0,
                                label: 'LABEL One',
                                value: 'VALUE One',
                                selected: false,
                                $$hashKey: jasmine.any(String)
                            },
                            {
                                id: 1,
                                label: 'LABEL Two',
                                value: 'VALUE Two',
                                selected: false,
                                $$hashKey: jasmine.any(String)
                            },
                            {
                                id: 2,
                                label: 'LABEL Three',
                                value: 'VALUE Three',
                                selected: false,
                                $$hashKey: jasmine.any(String)
                            }
                        ]
                    });
                });
            });

            describe('and an option is externally selected', function() {
                beforeEach(function() {
                    parentScope.model = ['VALUE One'];

                    parentScope.$digest();
                });

                it('should set selected count to 1', function() {
                    expect(target.getSelectedCount()).toEqual(1);
                });

                it('should mark option as selected', function() {
                    expect(target.groupOptions).toEqual({
                        null: [
                            {
                                id: 0,
                                label: 'LABEL One',
                                value: 'VALUE One',
                                selected: true,
                                $$hashKey: jasmine.any(String)
                            },
                            {
                                id: 1,
                                label: 'LABEL Two',
                                value: 'VALUE Two',
                                selected: false,
                                $$hashKey: jasmine.any(String)
                            }
                        ]
                    });
                });
            });
        });
        
        describe('with an item selected', function() {
            beforeEach(function() {
                compile(html, {
                    model: ['VALUE Two'],
                    options: optionsMock
                });
            });

            it('should set selected count to 1', function() {
                expect(target.getSelectedCount()).toEqual(1);
            });

            it('should expose options', function() {
                expect(target.groupOptions).toEqual({
                    null: [
                        {
                            id: 0,
                            label: 'LABEL One',
                            value: 'VALUE One',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            id: 1,
                            label: 'LABEL Two',
                            value: 'VALUE Two',
                            selected: true,
                            $$hashKey: jasmine.any(String)
                        }
                    ]
                });
            });
        });
    });

    describe('When compiling the directive', function() {
        describe('with the "isDeselectAllEnabled" disabled', function() {
            describe('and something is selected', function() {
                beforeEach(function() {
                    compile('<amo-multiselect is-deselect-all-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                        model: ['One'],
                        options: optionsMock
                    });

                    result = target.isSelectAllToggleDisabled();
                });

                it('should expose state', function() {
                    expect(target.state).toEqual(jasmine.objectContaining({
                        isDeselectAllEnabled: false,
                        isSelectAllEnabled: true,
                        isSelectAllVisible: true,
                        isSelectAllCheckboxVisible: false
                    }));
                });

                it('should disable enable select all functionality', function() {
                    expect(result).toEqual(false);
                });
            });

            describe('and everything is selected', function() {
                beforeEach(function() {
                    compile('<amo-multiselect is-deselect-all-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                        model: [
                            'One',
                            'Two'
                        ],
                        options: optionsMock
                    });

                    amoMultiselectFactoryInstanceSpy.getOptionsCount.and.returnValue(2);

                    result = target.isSelectAllToggleDisabled();
                });

                it('should enable select all functionality', function() {
                    expect(result).toEqual(true);
                });
            });
        });

        describe('with the "isSelectAllEnabled" disabled', function() {
            describe('and nothing is selected', function() {
                beforeEach(function() {
                    compile('<amo-multiselect is-select-all-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                        options: optionsMock
                    });

                    result = target.isSelectAllToggleDisabled();
                });

                it('should expose state', function() {
                    expect(target.state).toEqual(jasmine.objectContaining({
                        isDeselectAllEnabled: true,
                        isSelectAllEnabled: false,
                        isSelectAllVisible: true,
                        isSelectAllCheckboxVisible: false
                    }));
                });

                it('should disable deselect all functionality', function() {
                    expect(result).toEqual(true);
                });
            });

            describe('and something is selected', function() {
                beforeEach(function() {
                    compile('<amo-multiselect is-select-all-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                        model: ['One'],
                        options: optionsMock
                    });

                    result = target.isSelectAllToggleDisabled();
                });

                it('should enable deselect all functionality', function() {
                    expect(result).toEqual(false);
                });
            });
        });

        describe('with the "isSelectAllEnabled" and "isDeselectAllEnabled" disabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect is-select-all-enabled="false" is-deselect-all-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });
            });

            it('should expose state', function() {
                expect(target.state).toEqual(jasmine.objectContaining({
                    isDeselectAllEnabled: false,
                    isSelectAllEnabled: false,
                    isSelectAllVisible: false,
                    isSelectAllCheckboxVisible: false
                }));
            });
        });

        describe('with the "isFilterEnabled" disabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect is-filter-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });
            });

            it('should expose state', function() {
                expect(target.state.isFilterEnabled).toEqual(false);
            });
        });

        describe('with the "isDisabled" enabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect is-disabled="true" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });
            });

            it('should expose state', function() {
                expect(target.state.isDisabled).toEqual(true);
            });
        });

        describe('with the "limitTo" specified', function() {
            beforeEach(function() {
                compile('<amo-multiselect limit-to="1" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                target.optionsFiltered = {undefined: ['One', 'Two']};
            });

            it('should set the limit', function() {
                expect(target.limit).toEqual(1);
            });

            it('should know that there are more options than the limit', function() {
                expect(target.countOptionsAfterLimit()).toEqual(1);
            });
        });

        describe('with the "limitTo" disabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect limit-to="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });
                target.optionsFiltered = {null: ['One', 'Two']};
            });

            it('should set the limit', function() {
                expect(target.limit).toEqual(undefined);
            });

            it('should know that there are more options than the limit', function() {
                expect(target.countOptionsAfterLimit()).toEqual(0);
            });
        });
    });

    describe('When compiling the directive with an array of objects with two items selected', function() {
        var html;

        beforeEach(function() {
            amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
                return 'LABEL ' + option.id;
            });

            amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
                return 'VALUE ' + option.id;
            });

            optionsMock = [
                {
                    id: 1,
                    label: 'One'
                },
                {
                    id: 2,
                    label: 'Two'
                },
                {
                    id: 3,
                    label: 'Three'
                }
            ];

            amoMultiselectFactoryInstanceSpy.getOptions.and.returnValue({
                null: optionsMock
            });

            compile('<amo-multiselect ng-model="model" options="option.id as option.label for option in options"></amo-multiselect>', {
                model: ['VALUE 2', 'VALUE 3'],
                options: optionsMock
            });
        });

        it('should set selected count to 2', function() {
            expect(target.getSelectedCount()).toEqual(2);
        });
        
        it('should expose options', function() {
            expect(target.groupOptions).toEqual({
                null: [
                    {
                        id: 0,
                        label: 'LABEL 1',
                        value: 'VALUE 1',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL 2',
                        value: 'VALUE 2',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 2,
                        label: 'LABEL 3',
                        value: 'VALUE 3',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ]
            });
        });
    });

    describe('When compiling the directive with groups and two items selected', function() {
        var html;

        beforeEach(function() {
            amoMultiselectFactoryInstanceSpy.getGroup.and.callFake(function(option) {
                return option.color;
            });

            amoMultiselectFactoryInstanceSpy.getGroups.and.returnValue([
                'Red',
                'Green',
                'Blue'
            ]);

            amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
                return 'LABEL ' + option.id;
            });

            amoMultiselectFactoryInstanceSpy.getOptions.and.returnValue({
                'Red': [
                    {
                        id: 1,
                        color: 'Red',
                        label: 'Maroon'
                    },
                    {
                        id: 3,
                        color: 'Red',
                        label: 'Ruby'
                    },
                    {
                        id: 5,
                        color: 'Red',
                        label: 'Crimson'
                    }
                ],
                'Green': [
                    {
                        id: 2,
                        color: 'Green',
                        label: 'Lime'
                    }
                ],
                'Blue': [
                    {
                        id: 4,
                        color: 'Blue',
                        label: 'Azure'
                    },
                    {
                        id: 6,
                        color: 'Blue',
                        label: 'Sapphire'
                    }
                ]
            });

            amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
                return 'VALUE ' + option.id;
            });

            amoMultiselectFactoryInstanceSpy.isGrouped.and.returnValue(true);

            optionsMock = [
                {
                    id: 1,
                    color: 'Red',
                    label: 'Maroon'
                },
                {
                    id: 2,
                    color: 'Green',
                    label: 'Lime'
                },
                {
                    id: 3,
                    color: 'Red',
                    label: 'Ruby'
                },
                {
                    id: 4,
                    color: 'Blue',
                    label: 'Azure'
                },
                {
                    id: 5,
                    color: 'Red',
                    label: 'Crimson'
                },
                {
                    id: 6,
                    color: 'Blue',
                    label: 'Sapphire'
                }
            ];

            compile('<amo-multiselect ng-model="model" options="option.id as option.label for option in options"></amo-multiselect>', {
                model: [
                    'VALUE 4',
                    'VALUE 5'
                ],
                options: optionsMock
            });
        });

        it('should set selected count to 2', function() {
            expect(target.getSelectedCount()).toEqual(2);
        });

        it('should set the groups in the proper order', function() {
            expect(target.groups).toEqual([
                'Red',
                'Green',
                'Blue'
            ]);
        });
        
        it('should expose options', function() {
            expect(target.groupOptions).toEqual({
                'Red': [
                    {
                        id: 0,
                        label: 'LABEL 1',
                        value: 'VALUE 1',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL 3',
                        value: 'VALUE 3',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 2,
                        label: 'LABEL 5',
                        value: 'VALUE 5',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ],
                'Green': [
                    {
                        id: 0,
                        label: 'LABEL 2',
                        value: 'VALUE 2',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    }
                ],
                'Blue': [
                    {
                        id: 0,
                        label: 'LABEL 4',
                        value: 'VALUE 4',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL 6',
                        value: 'VALUE 6',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    }
                ]
            });
        });
    });

    describe('When the "label" attribute is set', function() {
        describe('and nothing is selected', function() {
            beforeEach(function() {
                compile('<amo-multiselect label="label" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });
            });

            it('should display "Select..."', function() {
                expect(target.selectedLabel).toEqual('Select...');
            });

            it('the default "Select..." text should be exposed', function() {
                expect(parentScope.label).toEqual('Select...');
            });
        });

        describe('and select text is specified', function() {
            beforeEach(function() {
                compile('<amo-multiselect label="label" select-text="SELECT" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });
            });

            it('should display "Select..."', function() {
                expect(target.selectedLabel).toEqual('SELECT');
            });

            it('the specified select text should be exposed', function() {
                expect(parentScope.label).toEqual('SELECT');
            });
        });

        describe('and items are selected', function() {
            beforeEach(function() {
                compile('<amo-multiselect label="label" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    model: ['VALUE One', 'VALUE Two'],
                    options: optionsMock
                });
            });

            it('should join labels', function() {
                expect(amoMultiselectFormatServiceSpy.joinLabels).toHaveBeenCalledWith([
                    'LABEL One',
                    'LABEL Two'
                ]);
            });

            it('should display labels', function() {
                expect(target.selectedLabel).toEqual('JOIN');
            });

            it('the labels should be exposed', function() {
                expect(parentScope.label).toEqual('JOIN');
            });
        });

        describe('and labels are undefined', function() {
            beforeEach(function() {
                amoMultiselectFactoryInstanceSpy.getLabel.and.returnValue();

                compile('<amo-multiselect label="label" selected-suffix-text="items" selected-suffix-singular-text="item" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    model: ['VALUE One', 'VALUE Two'],
                    options: optionsMock
                });
            });

            it('should join labels', function() {
                expect(amoMultiselectFormatServiceSpy.pluralize).toHaveBeenCalledWith(
                    2,
                    'items',
                    'item'
                );
            });

            it('should display labels', function() {
                expect(target.selectedLabel).toEqual('PLURALIZE');
            });

            it('the labels should be exposed', function() {
                expect(parentScope.label).toEqual('PLURALIZE');
            });
        });
    });

    describe('When an option is selected', function() {
        describe('without any event handlers', function() {
            beforeEach(function() {
                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                target.toggleSelectedState(target.groupOptions[null][1]);
            });

            it('should check selected option', function() {
                expect(target.groupOptions).toEqual({
                    null: [
                        {
                            id: 0,
                            label: 'LABEL One',
                            value: 'VALUE One',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            id: 1,
                            label: 'LABEL Two',
                            value: 'VALUE Two',
                            selected: true,
                            $$hashKey: jasmine.any(String)
                        }
                    ]
                });
            });
        });

        describe('and the "onChange" attribute is set', function() {
            var onChangeSpy;

            beforeEach(function() {
                onChangeSpy = jasmine.createSpy('onChange');

                compile('<amo-multiselect on-change="onChange(label)" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    onChange: onChangeSpy,
                    options: optionsMock
                });

                target.toggleSelectedState(target.groupOptions[null][1]);
            });

            it('should check selected option', function() {
                expect(target.groupOptions).toEqual({
                    null: [
                        {
                            id: 0,
                            label: 'LABEL One',
                            value: 'VALUE One',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            id: 1,
                            label: 'LABEL Two',
                            value: 'VALUE Two',
                            selected: true,
                            $$hashKey: jasmine.any(String)
                        }
                    ]
                });
            });

            it('should get option', function() {
                expect(amoMultiselectFactoryInstanceSpy.getOption).toHaveBeenCalledWith(
                    1,
                    'null'
                );
            });

            it('should set model', function() {
                expect(scope.model).toEqual(['VALUE Two']);
            });

            it('should call onChange handler', function() {
                expect(onChangeSpy).toHaveBeenCalledWith('JOIN');
            });
        });
    });

    describe('When toggling the dropdown', function() {
        describe('to open', function() {
            beforeEach(function() {
                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                target.filter = 'SEARCH';

                target.onToggleDropdown(true);

                timeout.flush();
            });

            it('should not clear filter', function() {
                expect(target.filter).toEqual('SEARCH');
            });
        });

        describe('to closed', function() {
            beforeEach(function() {
                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                target.filter = 'SEARCH';

                target.onToggleDropdown(false);

                timeout.flush();
            });

            it('should clear filter', function() {
                expect(target.filter).toEqual({});
            });
        });

        describe('and the "onToggleDropdown" attribute is set', function() {
            var onToggleDropdownSpy;

            beforeEach(function() {
                onToggleDropdownSpy = jasmine.createSpy('onToggleDropdown');

                compile('<amo-multiselect on-toggle-dropdown="onToggleDropdown(isOpen)" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    onToggleDropdown: onToggleDropdownSpy,
                    options: optionsMock
                });

                target.onToggleDropdown('IS OPEN');
            });

            it('should call the onToggleDropdown handler', function() {
                expect(onToggleDropdownSpy).toHaveBeenCalledWith('IS OPEN');
            });
        });
    });

    /**
     * getSelectAllLabel
     */
    
    describe('When getting the select/deselect all toggle text', function() {
        describe('and both options are enabled', function() {
            describe('and the "deselectAllText" attribute is set', function() {
                beforeEach(function() {
                    compile('<amo-multiselect deselect-all-text="DESELECT" ng-model="model" options="option for option in options"></amo-multiselect>', {
                        options: optionsMock
                    });

                    target.isAllSelected = true;

                    result = target.getSelectAllLabel();
                });

                it('should return custom text', function() {
                    expect(result).toEqual('DESELECT');
                });
            });

            describe('and the "selectAllText" attribute is set', function() {
                beforeEach(function() {
                    compile('<amo-multiselect select-all-text="SELECT" ng-model="model" options="option for option in options"></amo-multiselect>', {
                        options: optionsMock
                    });

                    target.isAllSelected = false;

                    result = target.getSelectAllLabel();
                });

                it('should return custom text', function() {
                    expect(result).toEqual('SELECT');
                });
            });
        });

        describe('and only select all is enabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect is-deselect-all-enabled="false" ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                result = target.getSelectAllLabel();
            });

            it('should return select all text', function() {
                expect(result).toEqual('Select All');
            });
        });

        describe('and only deselect all is enabled', function() {
            beforeEach(function() {
                amoMultiselectConfigSpy.isSelectAllEnabled = false;

                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                result = target.getSelectAllLabel();
            });

            it('should return select all text', function() {
                expect(result).toEqual('Deselect All');
            });
        });
    });

    /**
     * toggleAllSelectedState
     */

    describe('When selecting all items', function() {
        var onChangeSpy;

        beforeEach(function() {
            onChangeSpy = jasmine.createSpy('onChange');

            compile('<amo-multiselect on-change="onChange(label)" ng-model="model" options="option for option in options"></amo-multiselect>', {
                onChange: onChangeSpy,
                options: optionsMock
            });

            target.toggleAllSelectedState();
        });

        it('should check select all checkbox', function() {
            expect(target.isAllSelected).toEqual(true);
        });

        it('should check all options', function() {
            expect(target.groupOptions).toEqual({
                null: [
                    {
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ]
            });
        });

        it('should get option', function() {
            expect(amoMultiselectFactoryInstanceSpy.getOption.calls.count()).toEqual(2);
        });

        it('should set model', function() {
            expect(scope.model).toEqual([
                'VALUE One',
                'VALUE Two'
            ]);
        });

        it('should call onChange handler', function() {
            expect(onChangeSpy).toHaveBeenCalledWith('JOIN');
        });
    });

    describe('When deselecting all items (with groups)', function() {
        beforeEach(function() {
            amoMultiselectFactoryInstanceSpy.getGroup.and.callFake(function(option) {
                return option.group;
            });

            amoMultiselectFactoryInstanceSpy.getGroups.and.returnValue([
                'A',
                'B'
            ]);

            amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
                return 'LABEL ' + option.id;
            });

            amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
                return 'VALUE ' + option.id;
            });

            amoMultiselectFactoryInstanceSpy.isGrouped.and.returnValue(true);

            optionsMock = [
                {
                    id: 1,
                    group: 'A',
                    value: 'One'
                },
                {
                    id: 2,
                    group: 'B',
                    value: 'Two'
                },
                {
                    id: 3,
                    group: 'A',
                    value: 'Two'
                }
            ];

            amoMultiselectFactoryInstanceSpy.getOptions.and.returnValue({
                'A': [
                    {
                        id: 1,
                        group: 'A',
                        value: 'One'
                    },
                    {
                        id: 3,
                        group: 'A',
                        value: 'Two'
                    }
                ],
                'B': [
                    {
                        id: 2,
                        group: 'B',
                        value: 'Two'
                    }
                ]
            });

            compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                model: [
                    'VALUE 1',
                    'VALUE 2',
                    'VALUE 3',
                ],
                options: optionsMock
            });

            target.isAllSelected = true;

            target.toggleAllSelectedState();
        });

        it('should uncheck select all checkbox', function() {
            expect(target.isAllSelected).toEqual(false);
        });

        it('should uncheck all options', function() {
            expect(target.groupOptions).toEqual({
                A: [
                    {
                        id: 0,
                        label: 'LABEL 1',
                        value: 'VALUE 1',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL 3',
                        value: 'VALUE 3',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    }
                ],
                B: [
                    {
                        id: 0,
                        label: 'LABEL 2',
                        value: 'VALUE 2',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    }
                ]
            });
        });

        it('should set model', function() {
            expect(scope.model).toEqual([]);
        });
    });

    describe('When selecting all of a filtered set', function() {
        beforeEach(function() {
            compile('<amo-multiselect on-change="onChange(label)" ng-model="model" options="option for option in options"></amo-multiselect>', {
                options: optionsMock
            });

            target.filter.label = 'One';

            scope.$digest();

            target.toggleAllSelectedState();
        });

        it('should check all filtered options', function() {
            expect(target.groupOptions).toEqual({
                null: [
                    {
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    }
                ]
            });
        });

        it('should set model', function() {
            expect(scope.model).toEqual(['VALUE One']);
        });
    });

    describe('When toggling the selected state', function() {
        describe('and "isSelectAllEnabled" is disabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    model: ['One'],
                    options: optionsMock
                });

                target.isAllSelected = false;
                target.state.isSelectAllEnabled = false;

                target.toggleAllSelectedState();
            });

            it('should uncheck all options', function() {
                expect(target.groupOptions).toEqual({
                    null: [
                        jasmine.objectContaining({
                            selected: false
                        }),
                        jasmine.objectContaining({
                            selected: false
                        })
                    ]
                });
            });
        });

        describe('and "isDeselectAllEnabled" is disabled', function() {
            beforeEach(function() {
                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    model: ['One'],
                    options: optionsMock
                });

                target.isAllSelected = true;
                target.state.isSelectAllEnabled = true;
                target.state.isDeselectAllEnabled = false;

                target.toggleAllSelectedState();
            });

            it('should check all options', function() {
                expect(target.groupOptions).toEqual({
                    null: [
                        jasmine.objectContaining({
                            selected: true
                        }),
                        jasmine.objectContaining({
                            selected: true
                        })
                    ]
                });
            });
        });
    });

    describe('When selecting all items', function() {
        var onChangeSpy;

        beforeEach(function() {
            onChangeSpy = jasmine.createSpy('onChange');

            compile('<amo-multiselect on-change="onChange(label)" ng-model="model" options="option for option in options"></amo-multiselect>', {
                onChange: onChangeSpy,
                options: optionsMock
            });

            target.toggleAllSelectedState();
        });

        it('should check select all checkbox', function() {
            expect(target.isAllSelected).toEqual(true);
        });

        it('should check all options', function() {
            expect(target.groupOptions).toEqual({
                null: [
                    {
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ]
            });
        });

        it('should get option', function() {
            expect(amoMultiselectFactoryInstanceSpy.getOption.calls.count()).toEqual(2);
        });

        it('should set model', function() {
            expect(scope.model).toEqual([
                'VALUE One',
                'VALUE Two'
            ]);
        });

        it('should call onChange handler', function() {
            expect(onChangeSpy).toHaveBeenCalledWith('JOIN');
        });
    });

    describe('When the "filterText" attribute is set', function() {
        beforeEach(function() {
            compile('<amo-multiselect filter-text="SEARCH" ng-model="model" options="option for option in options"></amo-multiselect>', {
                options: optionsMock
            });
        });

        it('should return custom text', function() {
            expect(target.text.filter).toEqual('SEARCH');
        });
    });

    describe('When the "selectText" attribute is set', function() {
        beforeEach(function() {
            compile('<amo-multiselect label="label" select-text="SELECT" ng-model="model" options="option for option in options"></amo-multiselect>', {
                options: optionsMock
            });
        });

        it('should expose custom text', function() {
            expect(scope.label).toEqual('SELECT');
        });
    });
});
