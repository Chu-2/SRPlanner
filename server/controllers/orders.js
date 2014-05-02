(function (orders) {

    var Order = require('mongoose').model('Order');

    orders.getAllOrders = function (req, res) {
        Order.find({}, '_id name created total').exec(function (err, collection) {
            res.send(collection);
        });
    };

    orders.createOrder = function (req, res) {
        var orderData = req.body;
        Order.create(orderData, function (err, order) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            res.send(201, order);
        });
    };

    orders.updateOrder = function (req, res) {
        var orderData = req.body;
        delete orderData._id;
        Order.update({ _id: req.params.id }, orderData).exec(function (err) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            res.send(200);
        });
    };

    orders.getOrder = function (req, res) {
        Order.findOne({ _id: req.params.id }).populate('products._id').exec(function (err, doc) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            if (!doc) return res.send(404);
            var products = [];
            doc.products.forEach(function (product) {
                if (product._id) {
                    products.push({
                        _id: product._id._id,
                        product_code: product._id.product_code,
                        product_description: product._id.product_description,
                        member_price: product._id.member_price,
                        quantity: product.quantity,
                        subs: product.subs
                    });
                }
            });
            var order = {
                _id: doc._id,
                name: doc.name,
                products: products
            };
            res.send(order);
        });
    };

    orders.removeOrder = function (req, res) {
        Order.remove({ _id: req.params.id }).exec(function (err) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            res.send(204);
        });
    };

    orders.getSubOrders = function (req, res) {
        Order.findOne({ _id: req.params.id }).populate('products._id').exec(function (err, doc) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            if (!doc) return res.send(404);
            var products = [];
            doc.products.forEach(function (product) {
                if (product._id && product.quantity) {
                    var subs = [];
                    if (product.subs.length === 0) {
                        subs = [{}, {}, {}];
                    }
                    else {
                        for (var i = 0; i < product.subs.length; ++i) {
                            product.subs[i] < 0 ? subs.push({}) : subs.push({ value: product.subs[i] });
                        }
                    }
                    products.push({
                        _id: product._id._id,
                        product_code: product._id.product_code,
                        product_description: product._id.product_description,
                        member_price: product._id.member_price,
                        quantity: product.quantity,
                        subs: subs
                    });
                }
            });
            var count = products.length > 0 ? products[0].subs.length : 0;
            var order = {
                _id: doc._id,
                name: doc.name,
                products: products,
                subs_count: count
            };
            res.send(order);
        });
    };

    orders.updateSubOrders = function (req, res) {
        var orderData = req.body;
        if (orderData.products.length === 0) return res.send(200);
        orderData.products.forEach(function (product) {
            var subs = [];
            for (var i = 0; i < product.subs.length; ++i) {
                var value = parseInt(product.subs[i].value, 10);
                value ? subs.push(value) : subs.push(-1);
            }

            Order.update({ _id: req.params.id, "products._id": product._id },
                { $set: { "products.$.subs": subs } },
                function (err) {
                    if (err) {
                        res.status(400);
                        return res.send({ reason: err.toString() });
                    }
                }
            );
        });

        res.send(200);
    }
})(module.exports);
