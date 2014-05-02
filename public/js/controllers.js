srPlanner.controller('MainCtrl', function ($scope) {
});

srPlanner.controller('OrderListCtrl', function ($scope, $location, $route, OrderData) {
    $scope.orders = OrderData.getAllOrders();
    $scope.predicate = 'created';

    $scope.editOrder = function (order) {
        $location.path('/order/' + order._id);
    };

    $scope.deleteOrder = function (order) {
        OrderData.deleteOrder(order).then(function () {
            console.log('delete success');
            $route.reload();
        }, function (response) {
            console.log(response);
        });
    };

    $scope.planOrder = function (order) {
        $location.path('/order/' + order._id + '/plan');
    }
});

srPlanner.controller('OrderEditCtrl', function ($scope, $location, $routeParams, OrderData, ProductData, pTotal) {
    $scope.intReg = /^\d+$/;

    if ($routeParams.id) {
        $scope.order = OrderData.getOrder($routeParams.id);
        $scope.hideEmpty = true;
    } else {
        $scope.order = {};
        $scope.order['products'] = ProductData.getAllProducts();
    }

    $scope.calcTotal = function () {
        return pTotal($scope.order.products);
    };

    $scope.calcTotalQuantity = function () {
        if (!$scope.order.products) return 0;
        return $scope.order.products.reduce(function (prev, curr) {
            if (curr.hasOwnProperty('quantity') && curr.quantity)
                return prev + parseInt(curr.quantity, 10);
            return prev;
        }, 0);
    };

    $scope.submitOrder = function () {
        $scope.order.total = $scope.calcTotal();

        if ($routeParams.id) {
            OrderData.updateOrder($scope.order).then(function () {
                console.log('update success');
                $location.path('/orders');
            }, function (reason) {
                console.log(reason);
            });
        } else {
            OrderData.createOrder($scope.order).then(function () {
                console.log('create success');
                $location.path('/orders');
            }, function (reason) {
                console.log(reason);
            });
        }
    };
});

srPlanner.controller('OrderPlanCtrl', function ($scope, $location, $routeParams, SubOrderData, pTotal, qTotal, sTotal) {
    $scope.order = SubOrderData.getOrder($routeParams.id);
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

    $scope.addColumn = function () {
        $scope.order.products.forEach(function (product) {
            product.subs.push({});
        });
        $scope.order.subs_count++;
    };

    $scope.removeColumn = function (index) {
        $scope.order.products.forEach(function (product) {
            product.subs.splice(index, 1);
        });
        $scope.order.subs_count--;
    };


    $scope.submitPlanner = function () {
        SubOrderData.updateOrder($scope.order).then(function () {
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
            $scope.actionText = 'Add';
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
            ProductData.updateProduct($scope.tmp).then(function () {
                console.log('update success');
                $('#editProductModal').modal('hide');
            }, function (reason) {
                console.log(reason);
            });
        }
    };

    $scope.deleteProduct = function (product) {
        ProductData.deleteProduct(product).then(function () {
            console.log('delete success');
            $route.reload();
        }, function (response) {
            console.log(response);
        });
    };
});
