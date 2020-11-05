var mongoose = require('mongoose');

var bannerschema = new mongoose.Schema({

    bannertitle: {
        type: String,
    },

    discount: {
        type: Number,
    },
    category: {
        type: String,

    },
    
    bannerimage: {
        type: String,
    }



})
module.exports = mongoose.model('banner', bannerschema);
