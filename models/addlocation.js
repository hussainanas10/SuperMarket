var mongoose=require('mongoose')
var locationschema = new mongoose.Schema({

    locations: {
        type: String,
        
    },
    status:{
        type:String
    }
})
module.exports=mongoose.model('addlocation',locationschema);
