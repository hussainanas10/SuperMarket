var mongoose = require('mongoose');

var addproductschema = new mongoose.Schema({

    productname: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    discountmrp: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    benefits: {
        type: String
    },

    seller: {
        type: String
    },
    howtouse: {
        type: String
    },
    disclaimer: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    images: [{
        type: String,

    }],
},
    {

    timestamps:true

})
module.exports = mongoose.model('addproduct', addproductschema);
