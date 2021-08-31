const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity can not be less then 1.']
    },
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [itemSchema],
    subTotal: {
        default: 0,
        type: Number
    }
},{
    timestamps: true
});

var Carts = mongoose.model('Cart', cartSchema);

module.exports = Carts;