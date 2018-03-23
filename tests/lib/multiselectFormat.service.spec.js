describe('amoMultiselectFormatService', function() {
    var result;
    var target;

    beforeEach(module('amo.multiselect'));

    beforeEach(inject(function(amoMultiselectFormatService) {
        target = amoMultiselectFormatService;
    }));

    /**
     * joinLabels
     */
    
    describe('When joining', function() {
        describe('one label', function() {
            beforeEach(function() {
                result = target.joinLabels(['ONE']);
            });

            it('should return label', function() {
                expect(result).toEqual('ONE');
            });
        });

        describe('two labels', function() {
            beforeEach(function() {
                result = target.joinLabels(['ONE', 'TWO']);
            });

            it('should return labels, joined by "and"', function() {
                expect(result).toEqual('ONE and TWO');
            });
        });

        describe('three labels', function() {
            beforeEach(function() {
                result = target.joinLabels(['ONE', 'TWO', 'THREE']);
            });

            it('should return labels, joined by commands', function() {
                expect(result).toEqual('ONE, TWO, and THREE');
            });
        });
    });

    /**
     * pluralize
     */
    
    describe('When pluralizing', function() {
        describe('a single item', function() {
            describe('without a text override', function() {
                beforeEach(function() {
                    result = target.pluralize(1);
                });

                it('should return "1 item"', function() {
                    expect(result).toEqual('1 item');
                });
            });

            describe('with a text override', function() {
                beforeEach(function() {
                    result = target.pluralize(1, 'things', 'thing');
                });

                it('should return "1 item"', function() {
                    expect(result).toEqual('1 thing');
                });
            });
        });

        describe('multiple items', function() {
            describe('without a text override', function() {
                beforeEach(function() {
                    result = target.pluralize(2);
                });

                it('should return "1 item"', function() {
                    expect(result).toEqual('2 items');
                });
            });

            describe('with a text override', function() {
                beforeEach(function() {
                    result = target.pluralize(2, 'things');
                });

                it('should return "1 item"', function() {
                    expect(result).toEqual('2 things');
                });
            });
        });
    });
});
