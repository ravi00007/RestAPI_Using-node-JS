const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        requied : true
    },
    email:{
        type:String,
        requied : true
    },
    password:{
        type:String,
        requied : true
    },
    img :{
        type: String,
    },
    date:{
        type:Date,
        default : Date.now
    }
   
})
 

const User = mongoose.model('Employee',UserSchema);
module.exports = User;