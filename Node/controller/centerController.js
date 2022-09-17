const centerModel = require('../models/centerModel')
const addressModel = require('../models/addressModel');
const subAdminModel = require('../models/subAdminModel');
const commonFunction = require('../helper/commonFunction');
const userModel = require('../models/userModel');
const bookingModel = require('../models/bookingModel');

module.exports ={
    addCenter:async(req,res)=>{
        try {
            let query= { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType:{$ne:"USER"}}, ]};
            let data=await subAdminModel.findOne(query)
            if (data){
            let query1= { $and: [{centerName:req.body.centerName}, { status: { $ne: "DELETE" } },], };
            let centerAdd= await centerModel.findOne(query1)
            if (centerAdd) {
                return res.send({reponseCode:409,responseMessage:'center already exists',result:[]})
            } else {
                let stime = new Date()
                stime.setHours(09)+stime.setMinutes(00)+stime.setSeconds(00)
                let startTime= stime.toLocaleTimeString()
                req.body.openingTime=startTime
                let eTime= new Date()
                eTime.setHours(05)+eTime.setMinutes(00)+eTime.setSeconds(00)
                let endTime= eTime.toLocaleTimeString()
                req.body.closingTime=endTime
                req.body.slots= await commonFunction.generateSlots()
                let saveCenter = await  new centerModel(req.body).save()
                if (saveCenter) {
                    let saveAddress = await new addressModel(req.body).save();
                    if(saveAddress){
                        let updateCenter = await centerModel.findByIdAndUpdate({_id:saveCenter._id},{$set:{addressId:saveAddress._id,otp:req.body.otp}},{new:true})
                        if (updateCenter) {
                            return res.send({reponseCode:200,responseMessage:'center add successfully',result:updateCenter,saveAddress})                          
                        }
                    }
                }
            } 
            }else{
                return res.send({reponseCode:404,responseMessage:'you are not admin or sub-admin',result:[]})
            }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    viewCenter:async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let user = await userModel.findOne(query);
            if (!user) {
                return res.send({ reponseCode: 404, responseMessage: 'User not found .', responseResult: [] });
            } else {
                let centerData = await centerModel.findOne({$and: [{_id:req.body._id}, { status: { $ne: "DELETE" } },],});
            if(!centerData){
                res.send({responseCode:404,responseMessage:'Center data not found!',responseResult:[]})
            }else{
                res.send({responseCode:200,responseMessage:'center data found Successfully',responseResult:centerData})
            }
            }
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "somehting went wrong", responseResult: error.message });
        }
    },
    updateCenter:async (req,res)=>{
        try {
            let query= { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType:{$ne:"USER"}}, ]};
            let data=await subAdminModel.findOne(query)
            if (data){
            let centerUp= await centerModel.findOne({ $and: [{_id:req.body._id}, { status: { $ne: "DELETE" } },], })
            if (!centerUp) {
                return res.send({reponseCode:404,responseMessage:'CENTER NOT FOUND',result:[]})
            } else {
                let stime = new Date()
                stime.setHours(09)+stime.setMinutes(00)+stime.setSeconds(00)
                let startTime= stime.toLocaleTimeString()
                req.body.openingTime=startTime
                let eTime= new Date()
                eTime.setHours(05)+eTime.setMinutes(00)+eTime.setSeconds(00)
                let endTime= eTime.toLocaleTimeString()
                req.body.closingTime=endTime
                req.body.slots= await commonFunction.generateSlots()
                let saveCenter = await centerModel.findByIdAndUpdate({_id:centerUp._id},{$set:req.body},{new:true})
                if (saveCenter) {
                    let saveAddress = await new addressModel(req.body).save();
                    if(saveAddress){
                        let updateCenter = await centerModel.findByIdAndUpdate({_id:saveCenter._id},{$set:{addressId:saveAddress._id,otp:req.body.otp}},{new:true})
                        if (updateCenter) {
                            return res.send({reponseCode:200,responseMessage:'center Update successfully',result:updateCenter,saveAddress})                          
                        }
                    }
                }
            } 
            }else{
                return res.send({reponseCode:404,responseMessage:'you are not admin or sub-admin',result:[]})
            }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    centerList:async(req,res)=>{
        try {
            let query = { status: { $ne: "DELETE" } };
            if(req.query.search){
                query.$or=[ 
                    {centerName:{$regex:req.query.search,$option:'i'}},
                ]
            }
            let findByLocation = centerModel.aggregate([{
                "$geoNear":{
                    "near":{
                        "type":"Point",
                        "coordinates":[parseFloat(req.query.long),parseFloat(req.query.lat)]
                    },
                    "maxDistance":5*1000,
                    "distanceField":'distance',
                    "distanceMultiplier":1/1000,
                    "spherical":true
                }
            }])
            let options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.body.limit) || 10,
            };
            let centerData = await centerModel.aggregatePaginate(findByLocation,options);
            if(centerData.docs.length==0){
                res.send({responseCode:404,responseMessage:'Center data not found!',responseResult:[]})
            }else{
                res.send({responseCode:200,responseMessage:'Center data found successfully',responseResult:centerData})
            }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    deleteCenter:async(req,res)=>{
        try {
            let query= { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType:{$ne:"USER"}}, ]};
            let data=await subAdminModel.findOne(query)
            if (!data) {
                return res.send({reponseCode:404,responseMessage:'you are not admin or sub-admin',result:[]})
            } else {
                let query = { $and: [{_id:req.body._id}, { status: { $ne: "DELETE" } },], };
                let dCenter = await centerModel.findOne(query);
                if (!dCenter) {
                    return res.send({responseCode:404,responseMessage:'Center not found!',responseResult:[]})
                } else {
                    let updateCenter = await centerModel.findByIdAndUpdate({_id:dCenter._id},{$set:{status:"DELETE"}},{new:true})
                    if (updateCenter) {
                        return res.send({responseCode:200,responseMessage:'Center delete successfully',responseResult:[]})  
                    }
                }
            }
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "somehting went wrong", responseResult: error.message });
        }
    },
}