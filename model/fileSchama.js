const mongoose =  require('mongoose');

const fileSchema = new mongoose.Schema({
    file :{

        type: String,
        default:null
    },
    userid:{
        type:String,
        default:null
    }

})
 

const fileS = mongoose.model('Employee',fileSchema);
module.exports = fileS;
