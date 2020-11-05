var mongoose = require('mongoose');

var contactschema = new mongoose.Schema({
    
    sendername: {
        type: String,
        required: true
    },
    
    emailaddress: {
        type: String,
        required: true
    },
    sendersubject: {
        type: String,
        required: true
    },
    sendermessage: {
        type: String,
        required: true
    }
    
})
module.exports=mongoose.model('contactus',contactschema);
