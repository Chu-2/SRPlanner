srPlanner.controller('MainCtrl', function ($scope) {
    $scope.message = 'Place holder';
});

srPlanner.controller('OrderListCtrl', function ($scope, $location, $route, OrderData) {
    $scope.orders = OrderData.getAllOrders();
    $scope.predicate = 'created';

    $scope.editOrder = function (order) {
        $location.path('/order/' + order._id);
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

srPlanner.controller('OrderCreateCtrl', function ($scope, $location, OrderData, ProductData, pTotal) {
    $scope.order = {};
    $scope.products = ProductData.getAllProducts();
    $scope.intReg = /^\d+$/;

    $scope.calcTotal = function () {
        return pTotal($scope.products);
    };

    $scope.createOrder = function () {
        $scope.order.total = $scope.calcTotal();
        $scope.order.products = $scope.products;
        OrderData.createOrder($scope.order).then(function () {
            console.log('create success');
            $location.path('/orders');
        }, function (reason) {
            console.log(reason);
        });
    }
});

srPlanner.controller('OrderEditCtrl', function ($scope, $location, $routeParams, OrderData, pTotal, qTotal, sTotal) {
    $scope.order = OrderData.getOrder($routeParams.id);
    $scope.hideEmpty = true;
    $scope.intReg = /^\d+$/;

    $scope.calcRemaining = function (product) {
        if (!product.quantity) return 0;
        return product.quantity - qTotal(product.subs);
    };

    $scope.calcTotal = function () {
        return pTotal($scope.order.products);
    };

    $scope.calcSubTotal = function (index) {
        return sTotal($scope.order.products, index);
    };

    $scope.updateOrder = function () {
        $scope.order.total = $scope.calcTotal();
        OrderData.updateOrder($scope.order).$promise.then(function () {
            console.log('update success');
            $location.path('/orders');
        }, function (reason) {
            console.log(reason);
        });
    }
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
