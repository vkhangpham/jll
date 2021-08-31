const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let shippingSchema = new Schema({
    fullName: {
        type: String,
        default: ''
    },
    address: { 
        type: String,
        default: ''
    },
    address2: { 
        type: String,
        default: ''
    },
    tel: { 
        type: String,
        default: ''
    },
    city: { 
        type: String,
        default: ''
    },
    zipCode: { 
        type: String,
        default: ''
    },
});

let paymentSchema = new Schema({
    creditCard: {
        type: String,
        default: ''
    },
    cardName: {
        type: String,
        default: ''
    },
    expiredDate: {
        type: Date,
        default: new Date("11/22/2023")
    },
    cvv: {
        type: Number,
        min: 100,
        max: 999,
        default: 100
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
