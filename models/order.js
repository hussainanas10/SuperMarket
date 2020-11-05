var mongoose=require('mongoose')
var Schema = mongoose.Schema;


var order = new Schema({

    
    items:[{
        productId:{ type: Schema.Types.ObjectId , ref: 'addproduct' },
        qty: { type:Number  },
        orderId:{type:String},
    date:{type:Date},
    address:{type:String}
        
    }],
    userId: { type: Schema.Types.ObjectId , ref: 'user' },
   updateDate:{type:Date}
       
},
{
    timestamps:true,
})
module.exports=mongoose.model('order',order);
