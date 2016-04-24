describe('AmoMultiselectFactory', function() {
    var result,
        target,
        targetConstructor;

    beforeEach(module('amo.multiselect'));

    beforeEach(inject(function(AmoMultiselectFactory) {
        targetConstructor = AmoMultiselectFactory;
    }));

    describe('When parsing an array of strings', function() {
        beforeEach(function() {
            target = new targetConstructor('option for option in options', {});

            target.setOptions([
                'One',
                'Two'
            ]);
        });

        describe('and getting the label of the second option', function() {
            beforeEach(function() {
                result = target.getLabel('Two');
            });

            it('should return "Two"', function() {
                expect(result).toEqual('Two');
            });
        });

        describe('and getting the first option', function() {
            beforeEach(function() {
                result = target.getOption(0);
            });

            it('should return "One"', function() {
                expect(result).toEqual('One');
            });
        });

        describe('and getting the second option', function() {
            beforeEach(function() {
                result = target.getOption(1, null);
            });

            it('should return "Two"', function() {
                expect(result).toEqual('Two');
            });
        });

        describe('and getting the count of options', function() {
            beforeEach(function() {
                result = target.getOptionsCount();
            });

            it('should return count', function() {
                expect(result).toEqual(2);
            });
        });

        describe('and getting the options expression', function() {
            beforeEach(function() {
                result = target.getOptionsExpression();
            });

            it('should return "options"', function() {
                expect(result).toEqual('options');
            });
        });

        describe('and getting the groups', function() {
            beforeEach(function() {
                result = target.getGroups();
            });

            it('should return array of groups', function() {
                expect(result).toEqual([
                    null
                ]);
            });
        });

        describe('and getting the options', function() {
            beforeEach(function() {
                result = target.getOptions();
            });

            it('should return array of options', function() {
                expect(result).toEqual({
                    null: [
                        'One',
                        'Two'
                    ]
                });
            });
        });

        describe('and getting the value of the second option', function() {
            beforeEach(function() {
                result = target.getValue('Two');
            });

            it('should return "Two"', function() {
                expect(result).toEqual('Two');
            });
        });
    });

    describe('When parsing an array of objects', function() {
        describe('without a specified select property', function() {
            beforeEach(function() {
                target = new targetConstructor('option.prop for option in ctrl.arrayOfObjects', {});

                target.setOptions([
                    {
                        prop: 'One'
                    },
                    {
                        prop: 'Two'
                    }
                ]);
            });

            describe('and getting the label of the first option', function() {
                beforeEach(function() {
                    result = target.getLabel({
                        prop: 'One'
                    });
                });

                it('should return "One"', function() {
                    expect(result).toEqual('One');
                });
            });

            describe('and getting the first option', function() {
                beforeEach(function() {
                    result = target.getOption(0);
                });

                it('should return first option', function() {
                    expect(result).toEqual({
                        prop: 'One'
                    });
                });
            });

            describe('and getting the options expression', function() {
                beforeEach(function() {
                    result = target.getOptionsExpression();
                });

                it('should return "options"', function() {
                    expect(result).toEqual('ctrl.arrayOfObjects');
                });
            });

            describe('and getting the options', function() {
                beforeEach(function() {
                    result = target.getOptions();
                });

                it('should return array of options', function() {
                    expect(result).toEqual({
                        null: [
                            {
                                prop: 'One'
                            },
                            {
                                prop: 'Two'
                            }
                        ]
                    });
                });
            });

            describe('and getting the value of the first option', function() {
                beforeEach(function() {
                    result = target.getValue({
                        prop: 'One'
                    });
                });

                it('should return first option', function() {
                    expect(result).toEqual({
                        prop: 'One'
                    });
                });
            });
        });

        describe('with a specified select property', function() {
            beforeEach(function() {
                target = new targetConstructor('option.key as option.prop for option in ctrl.arrayOfObjects', {});

                target.setOptions([
                    {
                        key: 1,
                        prop: 'One'
                    },
                    {
                        key: 2,
                        prop: 'Two'
                    }
                ]);
            });

            describe('and getting the label of the first option', function() {
                beforeEach(function() {
                    result = target.getLabel({
                        prop: 'One'
                    });
                });

                it('should return "One"', function() {
                    expect(result).toEqual('One');
                });
            });

            describe('and getting the first option', function() {
                beforeEach(function() {
                    result = target.getOption(0);
                });

                it('should return first option', function() {
                    expect(result).toEqual({
                        key: 1,
                        prop: 'One'
                    });
                });
            });

            describe('and getting the value of the first option', function() {
                beforeEach(function() {
                    result = target.getValue({
                        key: 1,
                        prop: 'One'
                    });
                });

                it('should return first option', function() {
                    expect(result).toEqual(1);
                });
            });
        });

        describe('with groups', function() {
            beforeEach(function() {
                target = new targetConstructor('option group by option.group for option in ctrl.arrayOfObjects', {});

                target.setOptions([
                    {
                        key: 1,
                        group: 'B'
                    },
                    {
                        key: 2,
                        group: 'A'
                    },
                    {
                        key: 3,
                        group: 'B'
                    }
                ]);
            });

            describe('and getting the groups', function() {
                beforeEach(function() {
                    result = target.getGroups();
                });

                it('should return array of groups', function() {
                    expect(result).toEqual([
                        'B',
                        'A'
                    ]);
                });
            });

            describe('and getting the options', function() {
                beforeEach(function() {
                    result = target.getOptions();
                });

                it('should return array of options', function() {
                    expect(result).toEqual({
                        A: [
                            {
                                key: 2,
                                group: 'A'
                            }
                        ],
                        B: [
                            {
                                key: 1,
                                group: 'B'
                            },
                            {
                                key: 3,
                                group: 'B'
                            }
                        ]
                    });
                });
            });

            describe('and getting the first option of the first group', function() {
                beforeEach(function() {
                    result = target.getOption(0, 'A');
                });

                it('should return option', function() {
                    expect(result).toEqual({
                        key: 2,
                        group: 'A'
                    })
                });
            });

            describe('and getting the first option of the second group', function() {
                beforeEach(function() {
                    result = target.getOption(0, 'B');
                });

                it('should return option', function() {
                    expect(result).toEqual({
                        key: 1,
                        group: 'B'
                    })
                });
            });

            describe('and getting the second option of the second group', function() {
                beforeEach(function() {
                    result = target.getOption(1, 'B');
                });

                it('should return option', function() {
                    expect(result).toEqual({
                        key: 3,
                        group: 'B'
                    })
                });
            });
        });
    });

    describe('When parsing an expression', function() {
        var formatLabelSpy,
            formatValueSpy;

        describe('with format methods', function() {
            beforeEach(function() {
                formatLabelSpy = jasmine.createSpy('formatLabel');
                formatLabelSpy.and.returnValue('LABEL');

                formatValueSpy = jasmine.createSpy('formatValue');
                formatValueSpy.and.returnValue('VALUE');

                target = new targetConstructor('formatValue( option ) as formatLabel(option) for option in options', {
                    formatLabel: formatLabelSpy,
                    formatValue: formatValueSpy
                });
            });

            describe('and getting the label of an option', function() {
                beforeEach(function() {
                    result = target.getLabel('Two');
                });

                it('should format label', function() {
                    expect(formatLabelSpy).toHaveBeenCalledWith('Two');
                });

                it('should return formatted label', function() {
                    expect(result).toEqual('LABEL');
                });
            });

            describe('and getting the value of an option', function() {
                beforeEach(function() {
                    result = target.getValue('One');
                });

                it('should format value', function() {
                    expect(formatValueSpy).toHaveBeenCalledWith('One');
                });

                it('should return formatted value', function() {
                    expect(result).toEqual('VALUE');
                });
            });
        });

        describe('without groups', function() {
            beforeEach(function() {
                target = new targetConstructor('option.label for option in ctrl.arrayOfObjects', {});
            });

            describe('and getting the group of the first option', function() {
                beforeEach(function() {
                    result = target.getGroup({
                        label: 'One'
                    });
                });

                it('should return "null"', function() {
                    expect(result).toEqual(null);
                });
            });

            describe('and getting the grouped status', function() {
                beforeEach(function() {
                    result = target.isGrouped();
                });

                it('should return false', function() {
                    expect(result).toEqual(false);
                });
            });
        });

        describe('without groups', function() {
            beforeEach(function() {
                target = new targetConstructor('option.label group by option.group for option in ctrl.arrayOfObjects', {});
            });

            describe('and getting the group of the first option', function() {
                beforeEach(function() {
                    result = target.getGroup({
                        label: 'One',
                        group: 'A'
                    });
                });

                it('should return group', function() {
                    expect(result).toEqual('A');
                });
            });

            describe('and getting the grouped status', function() {
                beforeEach(function() {
                    result = target.isGrouped();
                });

                it('should return true', function() {
                    expect(result).toEqual(true);
                });
            });
        });
    });

    describe('When parsing an invalid options expression', function() {
        it('should throw error', function() {
            expect(function() {
                new targetConstructor('option for option inoptions', {});
            }).toThrow(jasmine.any(Error));
        });
    });
});
