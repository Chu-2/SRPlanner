srPlanner.value('pTotal', function (products) {
    if (!products) return 0;
    var total = 0;
    products.forEach(function (product) {
        if (product.hasOwnProperty('quantity') && product.quantity) {
            total += product.member_price * parseInt(product.quantity, 10);
        }
    });
    return total;
});

srPlanner.value('qTotal', function (subs) {
    var total = 0;
    subs.forEach(function (sub) {
        if (sub.value) {
            total += parseInt(sub.value, 10);
        }
    });
    return total;
});

srPlanner.value('sTotal', function (products, index) {
    if (!products) return 0;
    var total = 0;
    products.forEach(function (product) {
        if (product.subs[index].value) {
            total += product.member_price * parseInt(product.subs[index].value, 10);
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
        updateOrder: function (order) {
            return OrderResource.save({ id: order._id }, order).$promise;
        },
        deleteOrder: function (order) {
            return OrderResource.delete({ id: order._id }).$promise;
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
            return ProductResource.save({ id: product._id }, product).$promise;
        },
        deleteProduct: function (product) {
            return ProductResource.delete({ id: product._id }).$promise;
        },
        getAllProducts: function () {
            return ProductResource.query();
        }
    }
});

srPlanner.factory('SubOrderData', function ($resource) {
    var SubOrderResource = $resource('/api/orders/:id/subs', { id: '@_id' });
    return {
        getOrder: function (id) {
            return SubOrderResource.get({ id: id });
        },
        updateOrder: function (order) {
            return SubOrderResource.save({ id: order._id }, order).$promise;
        }
    }
});
