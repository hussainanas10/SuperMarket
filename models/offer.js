var mongoose = require('mongoose');

var offerschema = new mongoose.Schema({

    title: {
        type: String,
    },

    discount: {
        type: Number,
    },
    addproduct: {
        type: String,

    },
    status: {
        type: String,
    },
    offerimage: {
        type: String,
    },
    description: {
        type: String,
    }



})
module.exports = mongoose.model('offer', offerschema);
