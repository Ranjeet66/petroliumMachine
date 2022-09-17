const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAggregate =require('mongoose-aggregate-paginate')
const mongoosePaginate = require('mongoose-paginate');
const addressSchema = new Schema(
 {
   userId:{
     type:Schema.Types.ObjectId,
     ref:'user'
   },
   machineId:{
    type:Schema.Types.ObjectId,
    ref:'machine'
  },
   street: {
     type: String,
   },
   area: {
     type: String,
   },
   city: {
     type: String,
   },
   state: {
     type: String,
   },
   country: {
     type: String,
   },
   pin: {
     type: Number,
   },
   status: {
     type: String,
     enum: ["ACTIVE", "BLOCK", "DELETE"],
     default: "ACTIVE",
   },
 },
 { timestamps: true }
);
addressSchema.plugin(mongoosePaginate);
addressSchema.plugin(mongooseAggregate);
let addresscode = mongoose.model("address", addressSchema);
module.exports = addresscode;
