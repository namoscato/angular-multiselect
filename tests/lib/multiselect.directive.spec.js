describe('amoMultiselect', function() {
    var result,
        parentScope,
        scope,
        target;

    var html;

    var timeout,
        amoMultiselectFactorySpy,
        amoMultiselectFactoryInstanceSpy,
        amoMultiselectFormatServiceSpy;

    var optionsMock;

    beforeEach(module('amo.multiselect'));

    beforeEach(function() {
        amoMultiselectFactoryInstanceSpy = jasmine.createSpyObj('AmoMultiselectFactory()', [
            'getGroup',
            'getOption',
            'getOptions',
            'getOptionsExpression',
            'getLabel',
            'getValue',
            'isGrouped',
            'setOptions',
        ]);

        optionsMock = [
            'One',
            'Two'
        ];

        amoMultiselectFactoryInstanceSpy.getOption.and.callFake(function(index) {
            return optionsMock[index];
        });

        amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
            return 'LABEL ' + option
        });

        amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
            return 'VALUE ' + option
        });
    });

    beforeEach(module(function($provide) {
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

            it('should initialize search model', function() {
                expect(target.search).toEqual({});
            });

            it('should expose text', function() {
                expect(target.text).toEqual({
                    deselectAll: 'Deselect All',
                    search: 'Search...'
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

            it('should expose options', function() {
                expect(target.options).toEqual([
                    {
                        group: 'ungrouped',
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        group: 'ungrouped',
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    }
                ]);
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
                    expect(target.options).toEqual([
                        {
                            group: 'ungrouped',
                            id: 0,
                            label: 'LABEL One',
                            value: 'VALUE One',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            group: 'ungrouped',
                            id: 1,
                            label: 'LABEL Two',
                            value: 'VALUE Two',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            group: 'ungrouped',
                            id: 2,
                            label: 'LABEL Three',
                            value: 'VALUE Three',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        }
                    ]);
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
                    expect(target.options).toEqual([
                        {
                            group: 'ungrouped',
                            id: 0,
                            label: 'LABEL One',
                            value: 'VALUE One',
                            selected: true,
                            $$hashKey: jasmine.any(String)
                        },
                        {
                            group: 'ungrouped',
                            id: 1,
                            label: 'LABEL Two',
                            value: 'VALUE Two',
                            selected: false,
                            $$hashKey: jasmine.any(String)
                        }
                    ]);
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
                expect(target.options).toEqual([
                    {
                        group: 'ungrouped',
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        group: 'ungrouped',
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ]);
            });
        });
    });

    describe('When compiling the directive with an array of objects with two items selected', function() {
        var html;

        beforeEach(function() {
            amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
                return 'LABEL ' + option.id
            });

            amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
                return 'VALUE ' + option.id
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

            compile('<amo-multiselect ng-model="model" options="option.id as option.label for option in options"></amo-multiselect>', {
                model: ['VALUE 2', 'VALUE 3'],
                options: optionsMock
            });
        });

        it('should set selected count to 2', function() {
            expect(target.getSelectedCount()).toEqual(2);
        });

        it('should set the groups to their empty state', function() {
            expect(target.groups).toEqual(['ungrouped']);
        });

        it('should expose options', function() {
            expect(target.options).toEqual([
                {
                    group: 'ungrouped',
                    id: 0,
                    label: 'LABEL 1',
                    value: 'VALUE 1',
                    selected: false,
                    $$hashKey: jasmine.any(String)
                },
                {
                    group: 'ungrouped',
                    id: 1,
                    label: 'LABEL 2',
                    value: 'VALUE 2',
                    selected: true,
                    $$hashKey: jasmine.any(String)
                },
                {
                    group: 'ungrouped',
                    id: 2,
                    label: 'LABEL 3',
                    value: 'VALUE 3',
                    selected: true,
                    $$hashKey: jasmine.any(String)
                }
            ]);
        });
    });

    describe('When compiling the directive with an array of grouped objects with two items selected', function() {
        var html;

        beforeEach(function() {
            amoMultiselectFactoryInstanceSpy.getGroup.and.callFake(function(option) {
                return option.color;
            });

            amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
                return 'LABEL ' + option.label
            });

            amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
                return 'VALUE ' + option.id
            });

            amoMultiselectFactoryInstanceSpy.isGrouped.and.callFake(function(option) {
                return true;
            });

            optionsMock = [
                { id: 0, color: 'Red', label: 'Maroon' },
                { id: 1, color: 'Green', label: 'Lime' },
                { id: 2, color: 'Red', label: 'Ruby' },
                { id: 3, color: 'Blue', label: 'Azure' },
                { id: 4, color: 'Red', label: 'Crimson' },
                { id: 5, color: 'Blue', label: 'Sapphire' }
            ];

            compile('<amo-multiselect ng-model="model" options="option.id as option.label group by color for option in options"></amo-multiselect>', {
                model: ['VALUE 4', 'VALUE 5'],
                options: optionsMock
            });
        });

        it('should set selected count to 2', function() {
            expect(target.getSelectedCount()).toEqual(2);
        });

        it('should set the groups in the proper order', function() {
            expect(target.groups).toEqual(['Red', 'Green', 'Blue']);
        });

        it('should expose options', function() {
            expect(target.options).toEqual([
                { id: 0, label: 'LABEL Maroon', value: 'VALUE 0', selected: false, group: 'Red', $$hashKey: jasmine.any(String) },
                { id: 1, label: 'LABEL Lime', value: 'VALUE 1', selected: false, group: 'Green', $$hashKey: jasmine.any(String) },
                { id: 2, label: 'LABEL Ruby', value: 'VALUE 2', selected: false, group: 'Red', $$hashKey: jasmine.any(String) },
                { id: 3, label: 'LABEL Azure', value: 'VALUE 3', selected: false, group: 'Blue', $$hashKey: jasmine.any(String) },
                { id: 4, label: 'LABEL Crimson', value: 'VALUE 4', selected: true, group: 'Red', $$hashKey: jasmine.any(String) },
                { id: 5, label: 'LABEL Sapphire', value: 'VALUE 5', selected: true, group: 'Blue', $$hashKey: jasmine.any(String) }
            ]);
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
                    [undefined, undefined],
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

                expect(target.toggleSelectedState(target.options[1]));
            });

            it('should check selected option', function() {
                expect(target.options).toEqual([
                    {
                        group: 'ungrouped',
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        group: 'ungrouped',
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ]);
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

                expect(target.toggleSelectedState(target.options[1]));
            });

            it('should check selected option', function() {
                expect(target.options).toEqual([
                    {
                        group: 'ungrouped',
                        id: 0,
                        label: 'LABEL One',
                        value: 'VALUE One',
                        selected: false,
                        $$hashKey: jasmine.any(String)
                    },
                    {
                        group: 'ungrouped',
                        id: 1,
                        label: 'LABEL Two',
                        value: 'VALUE Two',
                        selected: true,
                        $$hashKey: jasmine.any(String)
                    }
                ]);
            });

            it('should get option', function() {
                expect(amoMultiselectFactoryInstanceSpy.getOption).toHaveBeenCalledWith(1);
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

                target.search = 'SEARCH';

                target.onToggleDropdown(true);

                timeout.flush();
            });

            it('should not clear search', function() {
                expect(target.search).toEqual('SEARCH');
            });
        });

        describe('to closed', function() {
            beforeEach(function() {
                compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                    options: optionsMock
                });

                target.search = 'SEARCH';

                target.onToggleDropdown(false);

                timeout.flush();
            });

            it('should clear search', function() {
                expect(target.search).toEqual({});
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

    describe('When deselecting all items', function() {
        beforeEach(function() {
            compile('<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>', {
                model: [
                    'One',
                    'Two'
                ],
                options: optionsMock
            });

            target.deselectAll();
        });

        it('should check all options', function() {
            expect(target.options).toEqual([
                {
                    group: 'ungrouped',
                    id: 0,
                    label: 'LABEL One',
                    value: 'VALUE One',
                    selected: false,
                    $$hashKey: jasmine.any(String)
                },
                {
                    group: 'ungrouped',
                    id: 1,
                    label: 'LABEL Two',
                    value: 'VALUE Two',
                    selected: false,
                    $$hashKey: jasmine.any(String)
                }
            ]);
        });

        it('should set model', function() {
            expect(scope.model).toEqual([]);
        });
    });

    describe('When the "deselectAllText" attribute is set', function() {
        beforeEach(function() {
            compile('<amo-multiselect deselect-all-text="DESELECT" ng-model="model" options="option for option in options"></amo-multiselect>', {
                options: optionsMock
            });

            result = target.text.deselectAll;
        });

        it('should return custom text', function() {
            expect(result).toEqual('DESELECT');
        });
    });

    describe('When the "searchText" attribute is set', function() {
        beforeEach(function() {
            compile('<amo-multiselect search-text="SEARCH" ng-model="model" options="option for option in options"></amo-multiselect>', {
                options: optionsMock
            });
        });

        it('should return custom text', function() {
            expect(target.text.search).toEqual('SEARCH');
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

    function compile(html, locals) {
        amoMultiselectFactoryInstanceSpy.getOptions.and.returnValue(optionsMock);

        amoMultiselectFactoryInstanceSpy.getOptionsExpression.and.returnValue('options');

        inject(function($compile, $rootScope, $timeout) {
            var element = angular.element(html);

            timeout = $timeout;

            parentScope = $rootScope.$new();

            $compile(element)(angular.extend(parentScope, locals));

            parentScope.$digest();

            element = element.find('amo-multiselect-dropdown');

            scope = element.scope();
            target = scope.multiselectDropdown;
        });
    }
});
