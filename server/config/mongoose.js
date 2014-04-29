var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var connection_string = '127.0.0.1:27017/srPlanner';
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + 'srplanner';
}

mongoose.connect(connection_string);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('srPlanner db opened');
});

var productSchema = Schema({
    product_code: { type: String, required: '{PATH} is required!' },
    product_description: { type: String, required: '{PATH} is required!' },
    member_price: { type: Number, required: '{PATH} is required!' }
});

var productsQuantity = Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Product', required: '{PATH} is required!' },
    quantity: Number
});

var orderSchema = Schema({
    name: { type: String, required: '{PATH} is required!' },
    created: { type: Date, default: Date.now },
    total: Number,
    products: [productsQuantity]
});

var Product = mongoose.model('Product', productSchema);
var Order = mongoose.model('Order', orderSchema);
