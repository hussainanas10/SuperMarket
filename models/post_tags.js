var mongoose=require('mongoose')
var Schema = mongoose.Schema;


var tags = new Schema({

  
    tagname:{
        type:String,
        
    },
    slugs:{
        type:String,

    },
    userId: { type: Schema.Types.ObjectId , ref: 'user' },    
},
{
    timestamps:true,
})
module.exports=mongoose.model('post_tags',tags);