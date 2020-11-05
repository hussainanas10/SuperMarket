var mongoose=require('mongoose')
var Schema = mongoose.Schema;


var posts = new Schema({

    
    userId: { type: Schema.Types.ObjectId , ref: 'user' },
    title:{type:String},
    content:{type:String},
    publish:{type:String},
    draft:{type:String},
    category:{type:String},
    tags:{type:String},
    images:{type:String},   
},
{
    timestamps:true,
})
module.exports=mongoose.model('posts',posts);
