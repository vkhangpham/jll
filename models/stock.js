const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    stock: {
        type: Number,
        min: 0,
        default: 100
    },
    sales: {
        type: Number,
        min: 0,
        default: 0
    }
}, { collection: 'stock', timestamps: true});

var Stock = mongoose.model('stock', stockSchema);
module.exports = Stock;