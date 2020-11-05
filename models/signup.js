var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Userschema = new Schema({

    username: {
        type: String,
    },
    fullname: {
        type: String,
        // required: true
    },
    images: {
        type: String
    },


    emailaddress: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        // required: true
    },
    password: {
        type: String
    },
    isVerified:{
        type:Boolean,
        default: false,
        enum: ["true","false"]
      },
      registerToken:{
        type: String,
        default:null,
      },
    address: [{
        country:{
            type:String

        },
        addressfullname:{
            type:String
        },
        addressphone:{
            type:String
        },
        pin:{
            type:String
        },
        flatnumber:{
            type:String
        },
        colony:{
            type:String
        },
        landmark:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        }
    }],
    favorites:[{type:Schema.Types.ObjectId, ref:'addproduct' }],

    admin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {type:String},
    resetPasswordExpires: {type:Date},
  
})



// Userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', Userschema);
