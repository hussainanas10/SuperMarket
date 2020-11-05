var mongoose = require('mongoose');

var categoryschema = new mongoose.Schema({

    cname:{type:String},
    status: {
        type: String,
    },
    
    cimage: {
        type: String,
        
    },
    description:{
        type:String
    }
})

    module.exports=mongoose.model('category',categoryschema);
