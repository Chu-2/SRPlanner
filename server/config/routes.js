var orders = require('../controllers/orders'),
    products = require('../controllers/products');

module.exports = function (app) {

    app.get('/api/orders', orders.getAllOrders);
    app.post('/api/orders', orders.createOrder);
    app.post('/api/orders/:id', orders.updateOrder);
    app.get('/api/orders/:id', orders.getOrder);
    app.delete('/api/orders/:id', orders.removeOrder);

    app.get('/api/products', products.getAllProducts);
    app.post('/api/products', products.createProduct);
    app.post('/api/products/:id', products.updateProduct);
    app.delete('/api/products/:id', products.removeProduct);

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
