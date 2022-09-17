const subAdminModel = require('../models/subAdminModel');
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel')
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken')
const commonFunction = require('../helper/commonFunction');

module.exports =
{
    addSubAdmin:async(req, res)=>
    {
        try
        {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } },{userType:"ADMIN"}], };
                let admin1 = await subAdminModel.findOne(query1);
                if(admin1){
            let result = await subAdminModel.findOne({$and:[{$or:[{email:req.body.email},{mobileNumber:req.body.mobileNumber}]},{status:{$ne:"DELETE"}},{userType:'SUB-ADMIN'}],},)
            if (result) {
                if(result.email == req.body.email){
                    return res.send({reponseCode:409,responseMessage:'Email already exists',result:[]})
                }
                else{
                    if(result.mobileNumber== req.body.mobileNumber)
                    {
                        return res.send({reponseCode:409,responseMessage:'Mobile number already exists',result:[]})
                    }
                }
            }
                else
                {
                    req.body.otp = commonFunction.otp();
                    req.body.otpExpireTime=Date.now()+5*60*1000;
                    let password = req.body.password;
                    let conpass  = req.body.confirmPassword
                    if(password!=conpass)
                    {
                        res.send({reponseCode:401,responseMessage:'password do not match.',})
                    }
                    else{
                        req.body.password=bcrypt.hashSync(password)
                        let profilePic=req.file.path
                        req.body.profilePic = await commonFunction.uploadImage(profilePic);
                        req.body.profilePic = req.body.profilePic
                        let subject = 'signUP OTP';
                        let text = `Your OTP : ${req.body.otp}`;
                        let mail = await commonFunction.sendMail(req.body.email,subject,text,)
                        if(mail){
                        let subAdminSave = await  new subAdminModel(req.body).save()
                            if (subAdminSave) {
                                req.body.subAdminId=subAdminSave._id;
                                let saveAddress = await new addressModel(req.body).save();
                                if(saveAddress){
                                let updateSubAdmin = await subAdminModel.findByIdAndUpdate({_id:subAdminSave._id},{$set:{addressId:saveAddress._id,otp:req.body.otp}},{new:true})
                                if (updateSubAdmin) {
                                return res.send({reponseCode:200,responseMessage:'subadmin add successfully',result:updateSubAdmin,saveAddress})                          
                                   }
                                }
                            }
                        }
                    }
                }
        }
    }
        catch(error)
        {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
    otpVerifySAdmin:async (req,res)=>
    {
        try 
        {
           let resultVerify =await subAdminModel.findOne({$and:[{$or:[{email:req.body.email}]},{status:{$ne:"DELETE"}},{userType:'SUB-ADMIN'}],},)
                     if(!resultVerify){
                       return res.send({reponseCode:404,responseMessage:'sub-admin not found',responseResult:[]},);
                    } else {
                        if (resultVerify.otpVerify == true) {
                            return res.send({ responseCode: 409, responseMessage: 'sub-admin already verified.', responseResult:[] })
                            }
                        else{ 
                            let currentTime =Date.now();
                            if(req.body.otp==resultVerify.otp){
                                if(resultVerify.otpExpireTime>=currentTime){
                              let resVerify = await subAdminModel.findByIdAndUpdate({_id:resultVerify._id},{$set:{otpVerify: true}},{new:true},)
                                        if (resVerify) {
                                            return res.send({reponseCode:200,responseMessage:'sub-admin verify successfully',responseResult:resVerify},);
                                        }
                            }else{
                                   return res.send({reponseCode:410,responseMessage:'OTP is Expired',responseResult:[]},);
                                   }
                            }else{
                                return res.send({reponseCode:400,responseMessage:'Wrong OTP',responseResult:[]},);
                            }

                      }
                    }
        } catch (error) 
        {
           return res.send({reponseCode:501,responseMessage:'Something went worng',responseResult:error.message})
       }
    },
    resendOtpSAdmin:async(req,res)=>{
        try {
            let query ={$and:[{email:req.body.email},{status:{$ne:"DELETE"}},{userType:"SUB-ADMIN"}],}; 
            let subAdminResult = await subAdminModel.findOne(query);
            if (!subAdminResult) {
                return res.send({reponseCode:404,responseMessage:'sub-admin not found .',responseResult:[],});
            } else {
                if(subAdminResult.otpVerify==true){
                    return res.send({reponseCode:401,responseMessage:'sub-admin already verified',responseResult:[]},);
                }else{
                let otp = commonFunction.otp();
                let expireTime = Date.now()+5*60*1000;
                let subject = 'OTP for verify';
                let text = `${otp}`;
                let mailResult = await  commonFunction.sendMail(subAdminResult.email,subject,text);
                if(mailResult){
                    let updateSubAdmin = await subAdminModel.findByIdAndUpdate({_id:subAdminResult._id},{$set:{otpVerify:false,otp:otp,otpExpireTime:expireTime}},{new:true})
                    if(updateSubAdmin){
                        return res.send({reponseCode:200,responseMessage:'OTP send successfully .',responseResult:updateSubAdmin,});
                    }
                }
            }
            }          
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went wrong .',responseResult:error.message,});
        }
    },
    loginSAdmin:async(req,res)=>{
        try{
          let query = {$and:[{$or:[{email:req.body.email},{mobileNumber:req.body.email}]},{status:{$ne:"DELETE"}},{userType:'SUB-ADMIN'}],}
          let sAdminResult = await subAdminModel.findOne(query);
          if(!sAdminResult){
            return res.send({reponseCode:404,responseMessage:'sub-admin not found .',responseResult:[],});
          }
          else{
            if(sAdminResult.otpVerify==false){
                return res.send({reponseCode:401,responseMessage:'sub-admin not verified',responseResult:[]},);
            }
            else{
                let passCheck = bcrypt.compareSync(req.body.password,sAdminResult.password);
                if(passCheck==false){
                  return res.send({reponseCode:401,responseMessage:'Incorrect password.',})
                }
                else{
                    let dataToken = {sAdminId:sAdminResult._id,email:sAdminResult.email}
                      let token = jwt.sign(dataToken,'test',{expiresIn:'1h'})
                  return res.send({reponseCode:200,responseMessage:'login Successfully',responseResult:sAdminResult,token},); 
                }
            }
          }
        }catch(error)
        {
          return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    forgotPasswordSAdmin:async(req,res)=>{
        try{
          let query = {$and:[{email:req.body.email},{status:{$ne:"DELETE"}},{userType:'SUB-ADMIN'}],};
          let sAdminResult = await subAdminModel.findOne(query);
          if(!sAdminResult){
            return res.send({reponseCode:404,responseMessage:'sub-admin not found .',responseResult:[],});
          }
          else{
            let otpForgot = commonFunction.otp()
            req.body.otpExpireTime=Date.now()+5*60*1000;
            let otpTime = req.body.otpExpireTime
            let subject = 'OTP varification for forgot password';
            let text = `Your OTP for verification : ${otpForgot}`;
            let send = await commonFunction.sendMail(req.body.email,subject,text,)
            if(send){
                let otpUpdate = await subAdminModel.findOneAndUpdate({_id:sAdminResult._id},{$set:{otp:otpForgot,otpVerify:false,otpExpireTime:otpTime}},{new:true})
                if(otpUpdate){
                    return res.send({reponseCode:200,responseMessage:'OTP send successfully',result:otpUpdate},); 
                }
            }
          }
        }catch(error)
        {
          return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    editProfileSAdmin: async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'SUB-ADMIN' }], };
            let subAdmin = await subAdminModel.findOne(query);
            if (!subAdmin) {
                return res.send({ reponseCode: 404, responseMessage: 'sub-admin not found .', responseResult: [] });
            } else {
                    let profilePic=req.file.path
                    req.body.profilePic = await commonFunction.uploadImage(profilePic);
                    req.body.profilePic = req.body.profilePic
                    let updatesubAdmin = await subAdminModel.findByIdAndUpdate({ _id: subAdmin._id }, { $set: req.body }, { new: true })
                    if (updatesubAdmin) {
                        req.body.sAdminId=updatesubAdmin._id;
                                let saveAddress = await new addressModel(req.body).save();
                                if(saveAddress){
                                let updateSAdmin = await subAdminModel.findByIdAndUpdate({_id:updateUser._id},{$set:{addressId:saveAddress._id}},{new:true})
                                if(updateSAdmin){
                        return res.send({ reponseCode: 200, responseMessage: 'Succesfully updated', responseResult: updateSAdmin });
                    }
                }
                }
                else {
                    if (req.body.email == userCheck.email) {
                        return res.send({ reponseCode: 409, responseMessage: 'Email already in use.', responseResult: [] });
                    }
                }
            }
        } catch (error) {
            return res.send({ reponseCode: 501, responseMessage: 'Something went wrong', responseResult: error.message });
        }
    },
    resetPasswordSAdmin:async(req,res)=>{
        try {
            let query = {$and:[{$or:[{email:req.body.email},],},{status:{$ne:"DELETE"}},{userType:'SUB-ADMIN'}],};
            let sAdminResult = await subAdminModel.findOne(query);
            if(!sAdminResult){
              return res.send({reponseCode:404,responseMessage:'sub-admin not found .',responseResult:[],});
            }
            else{
                    let currentTime =Date.now();
                    if(req.body.otp==sAdminResult.otp)
                    {
                        if(sAdminResult.otpExpireTime>=currentTime){
                            req.body.newPassword=bcrypt.hashSync(req.body.newPassword)
                            let updateSAdmin =await subAdminModel.findByIdAndUpdate({_id:sAdminResult._id},{$set:{password:req.body.newPassword,otpVerify:true,}},{new:true})   
                                if (updateSAdmin) {
                                    return res.send({reponseCode:200,responseMessage:'Reset password successfully',result:updateSAdmin});
                                }
                    }else{
                            res.send({reponseCode:410,responseMessage:'OTP is Expired',result:[]},);
                           }
                    }   else{
                        res.send({reponseCode:400,responseMessage:'Wrong OTP',result:[]},);
                    }
            }   
        } catch (error) {
            return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    changePasswordSAdmin:async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId }, { status: { $ne: "DELETE" } }, { userType: 'SUB-ADMIN' }], };
            let sAdminResult1 = await subAdminModel.findOne(query);
            if(!sAdminResult1){
              return res.send({reponseCode:404,responseMessage:'sub-admin not found .',responseResult:[],});
            }
            else{
                let passCheck = bcrypt.compareSync(req.body.password,sAdminResult1.password);
                if(passCheck==false){
                  return res.send({reponseCode:401,responseMessage:'Incorrect password.',})
                }
                else{   
                    let newPassword = req.body.newPassword;
                    let confirmNewPassword  = req.body.confirmNewPassword
                    if(newPassword!=confirmNewPassword)
                    {
                        res.send({reponseCode:401,responseMessage:'password do not match.',})
                    }
                    else{
                        req.body.newPassword=bcrypt.hashSync(newPassword)
                    let updateSAdmin =await subAdminModel.findByIdAndUpdate({_id:sAdminResult1._id},{$set:{password:req.body.newPassword,}},{new:true})   
                        if (updateSAdmin) {
                            return res.send({reponseCode:200,responseMessage:'Password changed successfully',result:updateSAdmin},);
                        }
                    }
                }
            }               
        } catch (error) {
            return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    viewSubAmdinSAdmin: async (req, res) => {
        try {
            let query = { $and: [{_id:req.dataId }, { status: { $ne: "DELETE" } }, { userType: 'SUB-ADMIN' }], };
          let sAdminData = await subAdminModel.findOne(query);
          if(!sAdminData){
            res.send({responseCode:404,responseMessage: "sub-admin data not found",responseResult:[]})
          }else{
            let data = await subAdminModel.paginate(query,{populate: 'addressId'});        
            if(data.docs.length!=0){
                res.send({responseCode:200,responseMessage:'sub-admin data found!',responseResult:data})
            }      
          }
        } catch (error) {
          return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    deleteSubAdmin:async(req,res)=>{
        try {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } },{userType:"ADMIN"}], };
                let admin1 = await subAdminModel.findOne(query1);
                if(admin1){
                    let sAdmin = await subAdminModel.findOne({ $and: [{_id:req.body._id}, { status: { $ne: "DELETE" } }, { userType: "SUB-ADMIN" }], })
                    if (sAdmin) {
                        let delSadmin =await subAdminModel.findByIdAndUpdate({_id:sAdmin._id},{$set:{userType:"DELETE"}},{new:true})
                        if (delSadmin) {
                            return res.send({reponseCode:200,responseMessage:'Sub-Admin Delete Successfully'})
                        }
                    } else {
                        return res.send({reponseCode:404,responseMessage:'user not found',result:[]})
                    }
                }else{
                    return res.send({reponseCode:404,responseMessage:'admin token not found',result:[]})
                }
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went worng',result:error.message})
        }
    },
}