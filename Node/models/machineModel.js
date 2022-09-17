const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const machineSchema= new Schema({
      machineName:{
        type:String
      },
      serialNo:{
        type:String
      },
      nozzel:{
        type:Number,
      },
      machineColor:{
        type:String,
      },
      machineCapacity:{
        type:String,
      },
      machineFuelType:{
        type:String,
      },
      machineImages:{
        type:[String]
      },
      qrImg:{
        type:String,
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
        enum:["ADMIN","USER"],
        default:"ADMIN"
    }
},
{ timestamps: true })

machineSchema.plugin(mongoosePaginate) 
const adminModel = mongoose.model('machine',machineSchema);
module.exports = adminModel