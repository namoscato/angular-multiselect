describe('amoMultiselect', function() {
    var element,
        result,
        parentScope,
        target;

    var amoMultiselectFactorySpy,
        amoMultiselectFactoryInstanceSpy;

    var optionsMock;

    beforeEach(module('amo.multiselect'));
    beforeEach(module('app/multiselect/multiselect-dropdown.html'));

    beforeEach(function() {
        amoMultiselectFactoryInstanceSpy = jasmine.createSpyObj('AmoMultiselectFactory()', [
            'getOptions',
            'getOptionsExpression',
            'getLabel',
            'getValue',
            'setOptions',
        ]);
    });

    beforeEach(module(function($provide) {
        $provide.service('AmoMultiselectFactory', function() {
            amoMultiselectFactorySpy = jasmine.createSpy('AmoMultiselectFactory');
            amoMultiselectFactorySpy.and.returnValue(amoMultiselectFactoryInstanceSpy);

            return amoMultiselectFactorySpy;
        });
    }));

    describe('When compiling the directive with an array of strings', function() {
        var html;

        beforeEach(function() {
            amoMultiselectFactoryInstanceSpy.getLabel.and.callFake(function(option) {
                return 'LABEL ' + option
            });

            amoMultiselectFactoryInstanceSpy.getValue.and.callFake(function(option) {
                return 'VALUE ' + option
            });

            html = '<amo-multiselect ng-model="model" options="option for option in options"></amo-multiselect>';

            optionsMock = [
                'One',
                'Two',
                'Three'
            ];
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
                    search: 'Search...',
                    selectAll: 'Select All',
                });
            });

            it('should set multiselect options', function() {
                expect(amoMultiselectFactoryInstanceSpy.setOptions).toHaveBeenCalledWith([
                    'One',
                    'Two',
                    'Three'
                ]);
            });

            it('should expose options', function() {
                expect(target.options).toEqual([
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
                ]);
            });
        });
        
        describe('with an item selected', function() {
            beforeEach(function() {
                compile(html, {
                    model: ['VALUE Two'],
                    options: optionsMock
                });
            });

            it('should expose options', function() {
                expect(target.options).toEqual([
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
                    },
                    {
                        id: 2,
                        label: 'LABEL Three',
                        value: 'VALUE Three',
                        selected: false,
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
        
        it('should expose options', function() {
            expect(target.options).toEqual([
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
            ]);
        });
    });
    
    function compile(html, locals) {
        amoMultiselectFactoryInstanceSpy.getOptions.and.returnValue(optionsMock);

        amoMultiselectFactoryInstanceSpy.getOptionsExpression.and.returnValue('options');

        inject(function($compile, $rootScope) {
            element = angular.element(html);

            parentScope = $rootScope.$new();

            $compile(element)(angular.extend(parentScope, locals));

            parentScope.$digest();

            element = element.find('amo-multiselect-dropdown');

            target = element.scope();
        });
    }
});
