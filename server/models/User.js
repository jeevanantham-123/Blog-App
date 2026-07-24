const mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type :String,
        required :true
    },
    email:{
        type :String,
        required :true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:""

    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    }]
});

const User = mongoose.model("User",userSchema);

module.exports = User;