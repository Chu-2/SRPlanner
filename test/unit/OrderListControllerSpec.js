describe('OrderListCtrl', function () {

    var scope, mockOrderData, $controllerConstructor;

    beforeEach(module('srPlanner'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        mockOrderData = sinon.stub({ getAllOrders: function () {
        } });
        $controllerConstructor = $controller;
    }));

    it('should set the scope orders to the result of OrderData.getAllOrders', function () {
        var mockOrders = {};
        mockOrderData.getAllOrders.returns(mockOrders);

        var ctrl = $controllerConstructor('OrderListCtrl',
            { $scope: scope, $location: {}, $route: {}, OrderData: mockOrderData });

        expect(scope.orders).toBe(mockOrders);
    });

    it('should navigate to the correct url when editOrder is called', function () {
        var mockLocation = sinon.stub({ path: function () {
        } });
        var ctrl = $controllerConstructor('OrderListCtrl',
            { $scope: scope, $location: mockLocation, $route: {}, OrderData: mockOrderData });

        var order = { _id: 27 };
        scope.editOrder(order);

        expect(mockLocation.path.calledWith('/order/27')).toBe(true);
    });
});
