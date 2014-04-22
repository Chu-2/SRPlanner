describe('OrderData', function () {

    beforeEach(module('srPlanner'));

    describe('getOrder', function () {
        it('should issue a GET request to /api/orders/123 when the id is 123', inject(function (OrderData, $httpBackend) {
            $httpBackend.when('GET', '/api/orders/123').respond({ name: 'order123' });
            var order = OrderData.getOrder(123);
            $httpBackend.flush();

            expect(order.name).toBe('order123');
        }));
    });
});
