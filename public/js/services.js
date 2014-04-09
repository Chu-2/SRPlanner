srPlanner.factory('OrderData', function ($resource, $q) {
    var OrderResource = $resource('/api/orders/:id', { id: '@_id' });
    return {
        createOrder: function (order) {
            var newOrder = new OrderResource(order);
            var dfd = $q.defer();
            newOrder.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteOrder: function (order) {
            return OrderResource.delete({ id: order._id });
        },
        getAllOrders: function () {
            return OrderResource.query();
        }
    }
});

srPlanner.factory('ProductData', function ($resource) {
    var ProductResource = $resource('/api/products/:id', { id: '@_id' });
    return {
        deleteProduct: function (product) {
            return ProductResource.delete({ id: product._id })
        },
        getAllProducts: function () {
            return ProductResource.query();
        }
    }
});
