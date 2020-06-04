const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linuxQuestionSchema = new Schema({
        
        user:{
            type:Schema.Types.ObjectId,
            ref:'myPerson'
        },
        description:{
            type:String,
            required:true
        },
        code:{
            type:String,
            required:true
        },
        error:{
            type:String
        },

    love:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'myPerson',
        },
           awsome:{
                type:String,     
           },
           verygood:{
               type:String,   
           },
           good:{
               type:String
           },
           bad:{
               type:String,
               
           },
           verybad:{
               type:String,   
           },
           date:{
            type:Date,
            default:Date.now
        }

       }],

    answers:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'myPerson'
        },
        awsome:{
            type:String,
            required:true
       },
       verygood:{
           type:String,
           required:true
       },
       good:{
           type:String
       },
       bad:{
           type:String
       },
       verybad:{
           type:String
       } ,
       date:{
        type:Date,
        default:Date.now
    }
    }],
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = linuxQuestion = mongoose.model('mylinuxQuestion', linuxQuestionSchema);