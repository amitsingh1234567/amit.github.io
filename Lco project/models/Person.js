const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        male:{
            type:String,
            default:"https://www.flaticon.com/free-icon/user_149071?term=user&page=1&position=43"
        },
        female:{
            type:String,
            default:"https://www.flaticon.com/free-icon/user_149071?term=user&page=1&position=43"
        }
       
    },
    date:{
        type:Date,
        default:Date.now
    }       
})

module.exports = Person = mongoose.model('myPerson', personSchema);


