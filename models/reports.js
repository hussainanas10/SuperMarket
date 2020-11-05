var mongoose=require('mongoose')
var Schema = mongoose.Schema;


var report = new Schema({
    year:{type:Number},
    months:[{
        totOrders:{type:Number},
        totSales:{type:Number},
    }]
},
{
    timestamps:true,
})
module.exports=mongoose.model('reports',report);
