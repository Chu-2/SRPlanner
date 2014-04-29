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
                res.status(403);
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
                        quantity: product.quantity
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
                res.status(403);
                return res.send({ reason: err.toString() });
            }
            res.send(204);
        });
    };

})(module.exports);
