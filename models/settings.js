var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settings = new Schema({
    name:{
        type:String,
    },
    siteName:{
        type:String,
        // required:true,
    },
    siteTitle:{
        type:String,
        // required:true,
    },
    siteDescription:{
        type:String,
    },
    logo:{
        type:String,
        // required:true,
    },
    favicon:{
        type:String,
        // required:true,
    },
    analyticsId:{
        type:String,
        // required:true,
    },
    contactEmail:{
        type:String,
        // required:true,
    },
    contactPhone:{
        type:String,
        // required:true,
    },
    contactLocation:{
        type:String,
        // required:true,
    },
    merchantId:{
        type:String,
        // required:true,
    },
    website:{
        type:String,
        // required:true,
    },
    industryType:{
        type:String,
        // required:true,
    },
    channelId:{
        type:String,
        // required:true,
    },
    callbackUrl:{
        type:String,
        // required:true,
    },
    transactionUrl:{
        type:String,
        // required:true,
    },
    merchantKey:{
        type:String
    },
    emailEmail:String,
    emailUsername:String,
    emailPassword:String
},{
    timestamps:true,
})

const Settings = mongoose.model('settings',settings);

module.exports = Settings;