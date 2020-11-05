var mongoose = require('mongoose');

var addshopschema = new mongoose.Schema({
    
    shopname: {
        type: String,
        
    },
    
    locations: {
        type: String,
        
    },
    areas: {
        type: String,
        
    },
    categorys: {
        type: String,
        
    },
    deliverycharge:{
        type:Number,
       
    },
    latitude: {
        type:Number,

    },
    longitude: {
        type:Number,

    },
    currentstatus: {
        type:String,

    },
    status: {
        type:String,

    },
    address: {
        type:String,

    },
    description: {
        type:String,

    },
    image:{

        type:String
    },
    openingtime: {
        type:String,
        // timestamps: true
    },
    closingtime: {
        type:String,
        // timestamps: true
    },
    fullname: {
        type:String,

    },
    username: {
        type:String,

    },
    email: {
        type:String,

    },
    phone: {
        type:Number,

    },
    owenraddress: {
        type:String,

    }
    
})
module.exports=mongoose.model('addshops',addshopschema);
