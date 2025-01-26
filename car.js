const mongoose= require ('mongoose');

const Schema= mongoose.Schema;

const carSchema= new Schema({
    make : {type : String, required: true},
    model: {type : String, required: true},
    year: {type : Number, required: true},
    // image: {type: String, required : true},
    buyer:{type : mongoose.Types.ObjectId, required : true, ref:'Buyer' },
});



module.exports= mongoose.model('Car',carSchema);