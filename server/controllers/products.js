(function (products) {

    var Product = require('mongoose').model('Product');

    products.getAllProducts = function (req, res) {
        Product.find({}).exec(function (err, collection) {
            res.send(collection);
        });
    };

    products.createProduct = function (req, res) {
        var productData = req.body;
        Product.create(productData, function (err, product) {
            if (err) {
                res.status(400);
                return res.send({ reason: err.toString() });
            }
            res.send(201, product);
        });
    };

    products.updateProduct = function (req, res) {
        var productData = req.body;
        delete productData._id;
        Product.update({ _id: req.params.id }, productData).exec(function (err) {
            if (err) {
                res.status(403);
                return res.send({ reason: err.toString() });
            }
            res.send(200);
        });
    };

    products.removeProduct = function (req, res) {
        Product.remove({ _id: req.params.id }).exec(function (err) {
            if (err) {
                res.status(403);
                return res.send({ reason: err.toString() });
            }
            res.send(204);
        });
    };

})(module.exports);
