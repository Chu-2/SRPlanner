describe('CalcHelper', function () {

    var products;

    beforeEach(module('srPlanner'));

    beforeEach(function () {
        products = [
            {
                member_price: 5.5,
                quantity: 3,
                subs: [
                    {},
                    {},
                    { value: 1 }
                ]
            },
            {
                member_price: 7,
                subs: [
                    { value: 1 },
                    {},
                    { value: 2 }
                ]
            },
            {
                member_price: 10,
                quantity: 5,
                subs: [
                    { value: 2 },
                    { value: 2 },
                    {}
                ]
            }
        ];
    });

    describe('pTotal', function () {
        it('should return 66.5 with the given products object', inject(function (pTotal) {
            expect(pTotal(products)).toEqual(66.5);
        }));
    });

    describe('qTotal', function () {
        it('should return correct results with the given subs object', inject(function (qTotal) {
            expect(qTotal(products[0].subs)).toEqual(1);
            expect(qTotal(products[1].subs)).toEqual(3);
            expect(qTotal(products[2].subs)).toEqual(4);
        }));
    });

    describe('sTotal', function () {
        it('should return correct results with the given products and index', inject(function (sTotal) {
            expect(sTotal(products, 0)).toEqual(27);
            expect(sTotal(products, 1)).toEqual(20);
            expect(sTotal(products, 2)).toEqual(19.5);
        }));
    });
});
