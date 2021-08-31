const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let shippingSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    address: { 
        type: String,
        required: true
    },
    address2: { 
        type: String,
        default: ''
    },
    tel: { 
        type: String,
        required: true
    },
    city: { 
        type: String,
        required: true
    },
    zipCode: { 
        type: String,
        required: true
    },
});

let paymentSchema = new Schema({
    creditCard: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    expiredDate: {
        type: Date,
        required: true
    },
    cvv: {
        type: Number,
        min: 000,
        max: 999,
        required: true
    }
});

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
});

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [itemSchema],
    subTotal: {
        default: 0,
        type: Number
    },
    shippingDetails: shippingSchema,
    paymentDetails: paymentSchema,
    status: {
        type: String,
        default: 'Pending'
    }
},{
    timestamps: true
});

var Orders = mongoose.model('Order', orderSchema);
module.exports = Orders;
