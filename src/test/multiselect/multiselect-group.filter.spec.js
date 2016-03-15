describe('amoMultiselectGroupFilter', function() {
    var input,
        result,
        target;

    beforeEach(module('amo.multiselect'));

    beforeEach(inject(function(amoMultiselectGroupFilter) {
        target = amoMultiselectGroupFilter;
    }));

    describe('When grouping', function() {
        var group;

        beforeEach(function() {
            group = 'One';
        });

        describe('with an array of objects', function() {
            beforeEach(function() {
                input = [
                    { id: 0, group: 'One' },
                    { id: 1, group: 'One' },
                    { id: 2, group: 'Two' }
                ];
                result = target(input, group);
            });

            it('should return only objects in the group', function() {
                expect(result).toEqual([
                    { id: 0, group: 'One' },
                    { id: 1, group: 'One' }
                ]);
            });
        });
    });
});

