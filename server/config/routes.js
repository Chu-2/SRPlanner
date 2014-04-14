var Order = require('mongoose').model('Order');
var Product = require('mongoose').model('Product');

module.exports = function (app) {
    app.get('/api/orders', function (req, res) {
        Order.find({}, '_id name created total').exec(function (err, collection) {
            res.send(collection);
        });
    });
    app.post('/api/orders', function (req, res) {
        var orderData = req.body;
        Order.create(orderData, function (err, order) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            res.send(order);
        });
    });
    app.get('/api/orders/:id', function (req, res) {
        Order.findOne({ _id: req.params.id }).populate('products._id').exec(function (err, doc) {
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
    });
    app.delete('/api/orders/:id', function (req, res) {
        Order.remove({ _id: req.params.id }).exec(function (err) {
            if (err) {
                res.status(403);
                return res.send({ reason: err.toString() });
            }
            res.send(204);
        });
    });

    app.get('/api/products', function (req, res) {
        Product.find({}).exec(function (err, collection) {
            res.send(collection);
        });
    });
    app.post('/api/products', function (req, res) {
        var productData = req.body;
        Product.create(productData, function (err, product) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            res.send(product);
        });
    });
    app.post('/api/products/:id', function (req, res) {
        var productData = req.body;
        delete productData._id;
        Product.update({ _id: req.params.id }, productData).exec(function (err) {
            if (err) {
                res.status(403);
                return res.send({ reason: err.toString() });
            }
            res.send(200);
        });
    });
    app.delete('/api/products/:id', function (req, res) {
        Product.remove({ _id: req.params.id }).exec(function (err) {
            if (err) {
                res.status(403);
                return res.send({ reason: err.toString() });
            }
            res.send(204);
        });
    });

    app.get('/partials/*', function (req, res) {
        res.render('partials/' + req.params);
    });

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('*', function (req, res) {
        res.render('index');
    });
};
