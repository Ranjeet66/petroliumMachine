const centerModel = require('../models/centerModel')
const subAdminModel = require('../models/subAdminModel');
const commonFunction = require('../helper/commonFunction');
const userModel = require('../models/userModel');
const bookingModel = require('../models/bookingModel');

module.exports={
    slotBooking:async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let user = await userModel.findOne(query);
            if (!user) {
                return res.send({ reponseCode: 404, responseMessage: 'User not found .', responseResult: [] });
            } else {
            let query1= { $and: [{centerName:req.body.centerName}, { status: { $ne: "DELETE" } },], };
            let data= await centerModel.findOne(query1)
            if (data) {
                if (data.slots.length==1) {
                return res.send({ reponseCode: 404, responseMessage: 'slots are not available .', responseResult: [] });
                } else {
                    const bookingFind = await bookingModel.findOne({userId:user._id})
                    if (bookingFind) {
                    return res.send({ reponseCode: 404, responseMessage: 'you are already booked a vaccine slot .', responseResult: [] });
                    } else {
                        const r = req.body.slotDate
                        const d = new Date().toISOString().split('T')[0];
                        if (r==d) {
                            let day =new Date(r)
                            let sun =day.getDay()
                            if (sun!=0) {
                                const d1 = new Date().toLocaleTimeString()
                                if (req.body.slotTime>=d1) {  
                                    const bsData = ({ $and: [{ slotTime: req.body.slotTimes }, { bookingDate: r }] });
                                    const bookData = await bookingModel.findOne(bsData)
                                    if (bookData) {
                                        return res.send({ responseCode: 401, responseMessage: "Slots Are Already Booked" });
                                    } else {
                                        req.body.userId = user._id
                                        req.body.email = user.email
                                        req.body.slotCenter=data.centerName
                                        const bookingSave = await bookingModel(req.body).save()
                                        subject = "Appointment";
                                        text = `Your Slot Booking Id is  ${bookingSave._id} .You are wait for confimation `;
                                        const mail = await commonFunction.sendMail(user.email, subject, text)
                                        if (mail) {
                                            return res.send({ responseCode: 200, responseMessage: "Booking Successfully", responseResult: bookingSave });
                                        } else {
                                            return res.send({ responseCode: 401, responseMessage: "Booking Failed" });
                                        }
                                    }
                                }else{
                                    return res.send({reponseCode:404,responseMessage:'you enter time before current time',result:[]})    
                                }
                            } else {
                                return res.send({reponseCode:404,responseMessage:'Booking not allowed on sunday',result:[]})    
                            } 
                        }else if(new Date(r)>new Date(d)){
                            let day =new Date(r)
                            let sun =day.getDay()
                            if (sun!=0) {
                                        const bsData = ({ $and: [{ slotTime: req.body.slotTimes }, { bookingDate: r }] });
                                        const bookData = await bookingModel.findOne(bsData)
                                        if (bookData) {
                                            return res.send({ responseCode: 401, responseMessage: "Slots Are Already Booked" });
                                        } else {
                                        req.body.userId = user._id
                                        req.body.email = user.email
                                        const bookingSave = await bookingModel(req.body).save()
                                        subject = "Appointment";
                                        text = `Your Slot Booking Id is  ${bookingSave._id} .You are wait for confimation `;
                                        const mail = await commonFunction.sendMail(user.email, subject, text)
                                        if (mail) {
                                            return res.send({ responseCode: 200, responseMessage: "Booking Successfully", responseResult: bookingSave });
                                        } else {
                                            return res.send({ responseCode: 401, responseMessage: "Booking Failed" });
                                        }
                                    }  
                            } else {
                            return res.send({reponseCode:404,responseMessage:'Booking not allowed on sunday',result:[]})    
                            } 
                        } else {
                        return res.send({reponseCode:404,responseMessage:'you enter past date',result:[]})
                        }
                    }
                }
            } else {
            return res.send({reponseCode:404,responseMessage:'center not found',result:[]})
            }
        }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    slotApprove:async(req,res)=>{
        try {
            let query= { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } }, { userType:'SUB-ADMIN'}, ]};
            let data=await subAdminModel.findOne(query)
            if (data) {
                var bookingApprove = await bookingModel.findOne({ $and: [{ _id:req.body._id}, { status: { $ne: "DELETE" } }, ]});
                if (!bookingApprove) {
                    return res.send({ responseCode: 409, responseMessage: "Booking data is not exist" });
                } else {
                    if (bookingApprove.status == "PENDING") {
                        subject = "Appointment";
                        text = `Your Booking ID: ${req.body._id} .your approved successfully and you are going to center take vaccine`;
                        const mail = await commonFunction.sendMail(bookingApprove.email, subject, text)
                        if (mail) {
                           let bd= await bookingModel.findByIdAndUpdate({ _id: bookingApprove._id }, { $set: { status: "BOOKED" } }, { new: true });
                            if (bd) {
                            return res.send({ responseCode: 200, responseMessage: "Slot Approve Successfully", responseResult: bd });
                            } else {
                                return res.send({ responseCode: 404, responseMessage: "Slot Approve Failed", responseResult: [] });   
                            }
                        }
                    } else {
                        return res.send({ responseCode: 200, responseMessage: "Already approved" });
                    }
                }
            } else {
                return res.send({reponseCode:404,responseMessage:'you are not sub-admin',result:[]})
            }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    viewBookingDetails:async(req, res) => {
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let user = await userModel.findOne(query);
            if (!user) {
                return res.send({ reponseCode: 404, responseMessage: 'User not found .', responseResult: [] });
            } else {
                let bookData = await bookingModel.findOne({ $and:[{_id: req.body._id}, {status: "BOOKED" }]});
                if (bookData) {
                    return res.send({ responseCode: 200, responseMessage: "slot booking details", responseResult: bookData })
                } else {
                    return res.send({ responseCode: 200, responseMessage: "your slot are in pending",responseResult:[] })
                }
            }
        } catch (error) {
            console.log(error)
            return res.send({ responseCode: 501, responseMessage: "somehting went wrong", responseResult: error.message });
        }
    },    
    updateSlot:async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let user = await userModel.findOne(query);
            if (!user) {
                return res.send({ reponseCode: 404, responseMessage: 'User not found .', responseResult: [] });
            } else {
            let query1= { $and: [{centerName:req.body.centerName}, { status: { $ne: "DELETE" } },], };
            let data= await centerModel.findOne(query1)
            if (data) {
                if (data.slots.length==1) {
                return res.send({ reponseCode: 404, responseMessage: 'slots are not available .', responseResult: [] });
                } else {
                    const bookingFind = await bookingModel.findOne({userId:user._id})
                    if (!bookingFind) {
                    return res.send({ reponseCode: 404, responseMessage: 'slot book are not exists', responseResult: [] });
                    } else {
                        const r = req.body.slotDate
                        const d = new Date().toISOString().split('T')[0];
                        if (r==d) {
                            let day =new Date(r)
                            let sun =day.getDay()
                            if (sun!=0) {
                                const d1 = new Date().toLocaleTimeString()
                                if (req.body.slotTime>=d1) {  
                                    const bsData = ({ $and: [{ slotTime: req.body.slotTimes }, { bookingDate: r }] });
                                    const bookData = await bookingModel.findOne(bsData)
                                    if (bookData) {
                                        return res.send({ responseCode: 401, responseMessage: "Slots Are Already Booked" });
                                    } else {
                                        req.body.userId = user._id
                                        req.body.email = user.email
                                        req.body.slotCenter = data.centerName
                                        const bookingSave = await bookingModel(req.body).save()
                                        subject = "Appointment";
                                        text = `Your Slot Booking Id is  ${bookingSave._id} .You are wait for confimation `;
                                        const mail = await commonFunction.sendMail(user.email, subject, text)
                                        if (mail) {
                                            return res.send({ responseCode: 200, responseMessage: "Booking Successfully", responseResult: bookingSave });
                                        } else {
                                            return res.send({ responseCode: 401, responseMessage: "Booking Failed" });
                                        }
                                    }
                                }else{
                                    return res.send({reponseCode:404,responseMessage:'you enter time before current time',result:[]})    
                                }
                            } else {
                                return res.send({reponseCode:404,responseMessage:'Booking not allowed on sunday',result:[]})    
                            } 
                        }else if(new Date(r)>new Date(d)){
                            let day =new Date(r)
                            let sun =day.getDay()
                            if (sun!=0) {
                                        const bsData = ({ $and: [{ slotTime: req.body.slotTimes }, { bookingDate: r }] });
                                        const bookData = await bookingModel.findOne(bsData)
                                        if (bookData) {
                                            return res.send({ responseCode: 401, responseMessage: "Slots Are Already Booked" });
                                        } else {
                                        req.body.userId = user._id
                                        req.body.email = user.email
                                        const bookingSave = await bookingModel(req.body).save()
                                        subject = "Appointment";
                                        text = `Your Slot Booking Id is  ${bookingSave._id} .You are wait for confimation `;
                                        const mail = await commonFunction.sendMail(user.email, subject, text)
                                        if (mail) {
                                            return res.send({ responseCode: 200, responseMessage: "Booking Successfully", responseResult: bookingSave });
                                        } else {
                                            return res.send({ responseCode: 401, responseMessage: "Booking Failed" });
                                        }
                                    }  
                            } else {
                            return res.send({reponseCode:404,responseMessage:'Booking not allowed on sunday',result:[]})    
                            } 
                        } else {
                        return res.send({reponseCode:404,responseMessage:'you enter past date',result:[]})
                        }
                    }
                }
            } else {
            return res.send({reponseCode:404,responseMessage:'center not found',result:[]})
            }
        }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    cancelSlot:async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let user = await userModel.findOne(query);
            if (!user) {
                let slotData=await bookingModel.findOne({$and:[{_id: req.body._id}, {status: "BOOKED" }]})
                if (slotData) {
                    let delSlot =await bookingModel.deleteOne({_id:slotData._id})
                    if (delSlot) {
                        return res.send({reponseCode:200,responseMessage:'Slot cancel successfully',result:[]})
                    }
                } else {
                    return res.send({reponseCode:404,responseMessage:'Slot not found',result:[]})
                }
            }else{
                return res.send({reponseCode:404,responseMessage:'user not found',result:[]})
            }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    bookingSlotList:async(req,res)=>{
        try {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } },{userType:"ADMIN"}], };
                let admin1 = await subAdminModel.findOne(query1); 
                if(admin1){
                    return res.send({responseCode:404,responseMessage:'Admin not found!',responseResult:[]})
                }else{
                    let query = {  status: { $ne: "DELETE" } };
                    if(req.query.search){
                        query.$or=[ 
                            {_id:{$regex:req.query.search,$option:'i'}},
                        ]
                    }
                    let options = {
                        page: parseInt(req.query.page) || 1,
                        limit: parseInt(req.body.limit) || 10,
                    };
                    let slotData = await bookingModel.paginate(query,options);
                    if(slotData.docs.length==0){
                        return res.send({responseCode:404,responseMessage:'Booking slot data not found!',responseResult:[]})
                    }else{
                        return res.send({responseCode:200,responseMessage:'Booking Slot data found!',responseResult:slotData})
                    }
                }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
}