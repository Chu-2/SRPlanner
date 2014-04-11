srPlanner.controller('MainCtrl', function ($scope) {
    $scope.message = 'Place holder';
});

srPlanner.controller('OrderListCtrl', function ($scope, $route, OrderData) {
    $scope.orders = OrderData.getAllOrders();
    $scope.predicate = 'created';

    $scope.editOrder = function (order) {
        console.log('Edit order: ' + order._id);
    };

    $scope.deleteOrder = function (order) {
        OrderData.deleteOrder(order).$promise.then(function () {
            console.log('delete success');
            $route.reload();
        }, function (response) {
            console.log(response);
        });
    }
});

srPlanner.controller('OrderCreateCtrl', function ($scope, $location, ProductData, OrderData, pTotal) {
    $scope.order = {};
    $scope.order.products = ProductData.getAllProducts();
    $scope.intReg = /^\d+$/;

    $scope.order.total = 0;
    $scope.calcTotal = function () {
        $scope.order.total = pTotal($scope.order.products);
    };

    $scope.createOrder = function (order) {
        order.created = new Date();
        OrderData.createOrder(order).then(function () {
            console.log('create success');
            $location.path('/orders')
        }, function (reason) {
            console.log(reason);
        });
    }
});

srPlanner.controller('OrderEditCtrl', function ($scope, OrderData) {

});

srPlanner.controller('ProductListCtrl', function ($scope, $route, ProductData) {
    $scope.products = ProductData.getAllProducts();
    $scope.floatReg = /^\d+(\.\d+)?$/;

    $scope.editProduct = function (product) {
        if (product === undefined) {
            $scope.tmp = {};
            $scope.actionText = 'Add'
        } else {
            $scope.actionText = 'Update';
            $scope.tmp = angular.copy(product);
        }
        $('#editProductModal').modal();
    };

    $scope.updateProduct = function () {
        $('body').on('hidden.bs.modal', function () {
            location.reload();
        });
        if ($scope.actionText === 'Add') {
            ProductData.createProduct($scope.tmp).then(function () {
                console.log('create success');
                $('#editProductModal').modal('hide');
            }, function (reason) {
                console.log(reason);
            });
        } else {
            ProductData.updateProduct($scope.tmp).$promise.then(function () {
                console.log('update success');
                $('#editProductModal').modal('hide');
            }, function (reason) {
                console.log(reason);
            });
        }
    };

    $scope.deleteProduct = function (product) {
        ProductData.deleteProduct(product).$promise.then(function () {
            console.log('delete success');
            $route.reload()
        }, function (response) {
            console.log(response);
        });
    }
});
