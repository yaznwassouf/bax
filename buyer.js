const mongoose= require('mongoose');

const uniqueValidator= require('mongoose-unique-validator');

const Schema= mongoose.Schema;

const buyerSchema = new Schema({
    name: {type: String, required: true},


    email: {type: String, required: true, unique: true},


    password: {type: String, required: true, minlength: 6},

    cars:[{type : mongoose.Types.ObjectId, required : true, ref:'Car' }]
});


buyerSchema.plugin(uniqueValidator);

module.exports= mongoose.model('Buyer', buyerSchema);