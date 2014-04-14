srPlanner.value('pTotal', function (products) {
    var total = 0;
    products.forEach(function (product) {
        if (product.hasOwnProperty('quantity') && !isNaN(parseInt(product.quantity, 10))) {
            total += product.member_price * parseInt(product.quantity, 10);
        }
    });
    return total;
});

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
        getOrder: function (id) {
            return OrderResource.get({ id: id });
        },
        deleteOrder: function (order) {
            return OrderResource.delete({ id: order._id });
        },
        getAllOrders: function () {
            return OrderResource.query();
        }
    }
});

srPlanner.factory('ProductData', function ($resource, $q) {
    var ProductResource = $resource('/api/products/:id', { id: '@_id' });
    return {
        createProduct: function (product) {
            var newProduct = new ProductResource(product);
            var dfd = $q.defer();
            newProduct.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        updateProduct: function (product) {
            return ProductResource.save({ id: product._id }, product);
        },
        deleteProduct: function (product) {
            return ProductResource.delete({ id: product._id });
        },
        getAllProducts: function () {
            return ProductResource.query();
        }
    }
});
