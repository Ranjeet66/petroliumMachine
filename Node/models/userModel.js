const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let mongooseAggregate =require('mongoose-aggregate-paginate')
const mongoosePaginate = require('mongoose-paginate')
const userSchema= new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    mobileNumber:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    dateOfBirth: {
      type: String
    }, 
    profilePic: {
      type: String
    },
    address: {
        type: String
    },
    otp:{
        type:String
    },
    otpExpireTime:{
        type:Number,
        allowNull: true
    },
    otpVerify:{
        type:Boolean,
        default:false
    },
    addressId:{
        type:Schema.Types.ObjectId,
        ref:'address'
      },     
    status:{
        type:String,
        enum:["ACTIVE","BLOCK","DELETE"],
        default:"ACTIVE"
    },
    userType:{
        type:String,
        enum:["ADMIN","SUB-ADMIN","USER"],
        default:"USER"
    }
},
{ timestamps: true }
);

userSchema.plugin(mongoosePaginate) 
userSchema.plugin(mongooseAggregate) 
const userModel = mongoose.model('user',userSchema);
module.exports = userModel


   