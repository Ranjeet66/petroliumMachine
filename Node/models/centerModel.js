
const mongoose = require("mongoose");
let aggregatePaginate =require('mongoose-aggregate-paginate-v2')
const Schema = mongoose.Schema;

const centerSchema = new Schema({
	centerName: {
		type: String,
		required: true
	},
	slots:{
		type:[String]
    },   
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    address: {
		type: String,
	},
    contractNo:{
        type:Number
    },
    openingTime:{
        type:String
    },
    closingTime:{
        type:String
    },
    addressId:{
        type:Schema.Types.ObjectId,
        ref:'address'
        }, 
	status:{
        type:String,
        enum:["ACTIVE","BLOCKED","DELETE"],
        default:"ACTIVE"
    },
},
    {
    timestamps:true
});

centerSchema.plugin(aggregatePaginate);
centerSchema.index({location: "2dsphere" });

let centerModel = mongoose.model("center", centerSchema);
module.exports = centerModel


