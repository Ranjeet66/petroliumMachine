const machineModel = require('../models/machineModel');
const userModel = require('../models/userModel')
const commonFunction = require('../helper/commonFunction');
const qrCode = require('qrcode')
const addressModel = require('../models/addressModel')

module.exports = {
    machineNozzel: async (req, res) => {
        try {
                let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
                let admin = await userModel.findOne(query1);
                if(admin){
                let query = { $and: [{ machineName:req.body.machineName}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
                let machineResult = await machineModel.findOne(query);
                if (!machineResult) {
                    req.body.machineName = req.body.machineName
                    let nozzel = req.body.nozzel
                    if (nozzel > 4) {
                        return res.send({ reponseCode: 400, responseMessage: 'Nozzel limit exceed', result: [] })
                    }
                    else {
                        req.body.machineColor=req.body.machineColor
                        let a = req.body.machineColor.toUpperCase();
                        req.body.serialNo = (a.slice(0,3))+"-"+commonFunction.generatedSNo(await machineModel.count())
                        let image = [];
                        for (let index = 0; index < req.files.length; index++) {
                            let f = await commonFunction.uploadImage(req.files[index].path);
                            image.push(f);
                        }
                        req.body.machineImages=image
                        let data = await new machineModel(req.body).save()
                        if (data) {
                            req.body.machineId=data._id;
                            let saveAddress = await new addressModel(req.body).save();
                            if(saveAddress){
                            let updateMac = await machineModel.findByIdAndUpdate({_id:data._id},{$set:{addressId:saveAddress._id}},{new:true})
                            if(updateMac){
                            let stringData = JSON.stringify(updateMac)
                            let qr = await qrCode.toDataURL(stringData)
                            let qrImage =await commonFunction.uploadImage(qr)
                            let updater = await machineModel.findByIdAndUpdate({_id:updateMac._id},{$set:{qrImg: qrImage}},{new:true})
                            if(updater){
                            return res.send({ reponseCode: 200, responseMessage: 'Machine registered successfully', responseResult: updater,saveAddress })
                            }
                        }
                             }
                        }
                    }
                }
                else {
                    return res.send({ reponseCode: 409, responseMessage: 'Machine name already exists', result: [] })
                } 
            }
        } catch (error) {
            return res.send({ reponseCode: 501, responseMessage: 'Something went worng', result: error.message })
        }
    },
    machineList: async (req, res) => {
        try {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
            let admin = await userModel.findOne(query1);
            if(admin){
            let query = {   status: { $ne: "DELETE" } , userType: 'ADMIN'  };
            if (req.query.search) {
                query.$or = [
                    { machineName: { $regex: req.query.search, $option: 'i' } },
                    { serialNo: { $regex: req.query.search, $option: 'i' } },
                ]
            }
            let options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.body.limit) || 10,
                
                populate: 'addressId',
                // $project:[{_id:0,machineName:1,nozzel:1,machineColor:1,machineCapacity:1,machineFeulType:1,machineImages:1,qrImg:1,addressId:1}],
                sort: { createdAt: -1},
            };
            if (req.query.fromDate) {
                query.createdAt = { $gte: req.body.fromDate }
            }
            if (req.query.toDate) {
                query.createdAt = { $lte: req.body.toDate }
            }
            if (req.query.fromDate && req.query.toDate) {
                query.$and = [{ createdAt: { $gte: req.body.fromDate } }, { createdAt: { $lte: req.body.toDate } }]
            }
            let machineData = await machineModel.paginate(query, options);
            if (machineData.docs.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Machine data not found!', responseResult: [] })
            } else {
                res.send({ responseCode: 200, responseMessage: 'Machine data found!', responseResult: machineData })
            }
        }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: 'Something went wrong!', responseResult: error.message })
        }
    },
    editMachine: async (req, res) => {
        try {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
            let admin = await userModel.findOne(query1);
            if(admin){
            let query = { $and: [{machineName:req.body.machineName}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
            let machine = await machineModel.findOne(query);
            if (!machine) {
                return res.send({ reponseCode: 404, responseMessage: 'Machine not found .', responseResult: [] });
            } else {
                let nozzel = req.body.nozzel
                if (nozzel > 4) {
                    return res.send({ reponseCode: 400, responseMessage: 'Nozzel limit exceed', result: [] })
                }
                else {
                    req.body.nozzel=nozzel
                    let image = [];
                    for (let index = 0; index < req.files.length; index++) {
                        let f = await commonFunction.uploadImage(req.files[index].path);
                        image.push(f);
                    }
                    req.body.machineImages=image
                    let updateMachine = await machineModel.findByIdAndUpdate({ _id: machine._id }, { $set:req.body }, { new: true })
                    if (updateMachine) {
                        let stringData = JSON.stringify(updateMachine)
                        let qr = await qrCode.toDataURL(stringData)
                        let qrImage =await commonFunction.uploadImage(qr)
                        req.body.qrImg=qrImage
                        let dataMachine = await machineModel.findByIdAndUpdate({ _id: machine._id }, { $set: {qrImg:req.body.qrImg} },{ new: true })
                        if(dataMachine){
                        return res.send({ reponseCode: 200, responseMessage: 'Succesfully updated', responseResult: dataMachine });
                    }
                }
                }
            }
        }
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: 'Something went wrong', responseResult: error.message });
        }
    },
    deleteMachine:async(req,res)=>{
        try {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
            let admin = await userModel.findOne(query1);
            if(admin){
            let query = { $and: [{ machineName:req.body.machineName}, { status: { $ne: "DELETE" } }, { userType: 'ADMIN' }], };
            let machine = await machineModel.findOne(query);
            if (!machine) {
                return res.send({ reponseCode: 404, responseMessage: 'Machine not found .', responseResult: [] });
            } else {
                let deleteMachine = await machineModel.deleteOne({_id:machine._id})
                if (deleteMachine) {
                    return res.send({ reponseCode: 200, responseMessage: 'Machine successfully deleted', result:machine })
                }
         }
        }
        } catch (error) {
            return res.send({ reponseCode: 501, responseMessage: 'Something went worng', result: error.message })
        }
    },
}