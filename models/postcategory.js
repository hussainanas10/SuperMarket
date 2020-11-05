var mongoose=require('mongoose');

var Schema = mongoose.Schema;


var postcategory = new Schema({

    
    postcategory:{
        type:String,

    },
    postslug:{
        type:String,

    },
    userId: { type: Schema.Types.ObjectId , ref: 'user' },    
},
{
    timestamps:true,
})
module.exports=mongoose.model('post_category',postcategory);