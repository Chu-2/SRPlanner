srPlanner.controller('MainCtrl', function ($scope) {
    $scope.message = 'Place holder';
});

srPlanner.controller('OrderListCtrl', function ($scope, $route, OrderData) {
    $scope.orders = OrderData.getAllOrders();
    $scope.predicate = 'created';

    $scope.editOrder = function (order) {
        console.log('Edit order: ' + order._id);
    }
    $scope.deleteOrder = function (order) {
        OrderData.deleteOrder(order).$promise.then(function () {
            console.log('delete success');
            $route.reload();
        }, function (response) {
            console.log(response);
        });
    }
});

srPlanner.controller('OrderCreateCtrl', function ($scope, $location, ProductData, OrderData) {
    $scope.order = {};
    $scope.order.products = ProductData.getAllProducts();

    $scope.order.total = 0.0;
    $scope.change = function (products) {
        $scope.order.total = 0.0;
        for (var i = 0; i < products.length; ++i) {
            var product = products[i];
            if (product.hasOwnProperty('quantity') && !isNaN(parseInt(product.quantity, 10))) {
                $scope.order.total += product.member_price * parseInt(product.quantity, 10);
            }
        }
    }

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

srPlanner.controller('ProductListCtrl', function ($scope, $route, ProductData) {
    $scope.products = ProductData.getAllProducts();

    $scope.editProduct = function (product) {
        console.log('Edit product: ' + product._id);
    }
    $scope.deleteProduct = function (product) {
        ProductData.deleteProduct(product).$promise.then(function () {
            console.log('delete success');
            $route.reload()
        }, function (response) {
            console.log(response);
        });
    }
});
