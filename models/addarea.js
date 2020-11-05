

var mongoose=require('mongoose')
var areaschema = new mongoose.Schema({

    areas: {
        type: String,
        
    },
    locations:{
        type:String
    },
    status:{
        type:String
    }
})
module.exports=mongoose.model('addarea',areaschema);
