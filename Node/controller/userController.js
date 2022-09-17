const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel')
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken')
const commonFunction = require('../helper/commonFunction');
var ifsc = require('ifsc');
const subAdminModel = require('../models/subAdminModel')

module.exports =
{
    signUp:async(req, res)=>
    {
        try
        {
            let result = await userModel.findOne({$and:[{$or:[{email:req.body.email},{mobileNumber:req.body.mobileNumber}]},{status:{$ne:"DELETE"}},{userType:'USER'}],},)
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
                        let userSave = await  new userModel(req.body).save()
                            if (userSave) {
                                req.body.userId=userSave._id;
                                let saveAddress = await new addressModel(req.body).save();
                                if(saveAddress){
                                let updateUser = await userModel.findByIdAndUpdate({_id:userSave._id},{$set:{addressId:saveAddress._id,otp:req.body.otp}},{new:true})
                                if (updateUser) {
                                return res.send({reponseCode:200,responseMessage:'Signup successfully',result:updateUser,saveAddress})                          
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
    otpVerify:async (req,res)=>
    {
        try 
        {
           let resultVerify =await userModel.findOne({$and:[{email:req.body.email},{status:{$ne:"DELETE"}},{userType:'USER'}],},)
                     if(!resultVerify){
                       return res.send({reponseCode:404,responseMessage:'User not found',responseResult:[]},);
                    } else {
                        if (resultVerify.otpVerify == true) {
                            return res.send({ responseCode: 409, responseMessage: 'User already verified.', responseResult: resultVerify })
                            }
                        else{ 
                            let currentTime =Date.now();
                            if(req.body.otp==resultVerify.otp){
                                if(resultVerify.otpExpireTime>=currentTime){
                              let resVerify = await userModel.findByIdAndUpdate({_id:resultVerify._id},{$set:{otpVerify: true}},{new:true},)
                                        if (resVerify) {
                                            return res.send({reponseCode:200,responseMessage:'User verify successfully',result:[]},);
                                        }
                            }else{
                                    res.send({reponseCode:410,responseMessage:'OTP is Expired',result:[]},);
                                   }
                            }else{
                                res.send({reponseCode:400,responseMessage:'Wrong OTP',result:[]},);
                            }

                      }
                    }
        } catch (er) 
        {
           return res.send({reponseCode:501,responseMessage:'Something went worng',result:er.message})
       }
    },
    resendOtp:async(req,res)=>{
        try {
            let query ={$and:[{email:req.body.email},{status:{$ne:"DELETE"}},],}; 
            let userResult = await userModel.findOne(query);
            if (!userResult) {
                return res.send({reponseCode:404,responseMessage:'User not found .',responseResult:[],});
            } else {
                if(userResult.otpVerify==true){
                    return res.send({reponseCode:401,responseMessage:'User already verified',responseResult:[]},);
                }else{
                let otp = commonFunction.otp();
                let expireTime = Date.now()+5*60*1000;
                let subject = 'OTP for verify';
                let text = `${otp}`;
                let mailResult = await  commonFunction.sendMail(userResult.email,subject,text);
                if(mailResult){
                    let updateUser = await userModel.findByIdAndUpdate({_id:userResult._id},{$set:{otpVerify:false,otp:otp,otpExpireTime:expireTime}},{new:true})
                    if(updateUser){
                        return res.send({reponseCode:200,responseMessage:'OTP send successfully .',responseResult:updateUser,});
                    }
                }
            }
            }          
        } catch (error) {
            return res.send({reponseCode:501,responseMessage:'Something went wrong .',responseResult:error.message,});
        }
    },
    login:async(req,res)=>{
        try{
          let query = {$and:[{$or:[{email:req.body.email},{mobileNumber:req.body.email}]},{status:{$ne:"DELETE"}},{userType:'USER'}],}
          let userResult = await userModel.findOne(query);
          if(!userResult){
            return res.send({reponseCode:404,responseMessage:'User not found .',responseResult:[],});
          }
          else{
            if(userResult.otpVerify==false){
                return res.send({reponseCode:401,responseMessage:'User not verified',responseResult:[]},);
            }
            else{
                let passCheck = bcrypt.compareSync(req.body.password,userResult.password);
                if(passCheck==false){
                  return res.send({reponseCode:401,responseMessage:'Incorrect password.',})
                }
                else{
                    let dataToken = {userId:userResult._id,email:userResult.email}
                      let token = jwt.sign(dataToken,'test',{expiresIn:'1h'})
                  return res.send({reponseCode:200,responseMessage:'login Successfully',responseResult:userResult,token},); 
                }
            }
          }
        }catch(error)
        {
          return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    forgotPassword:async(req,res)=>{
        try{
          let query = {$and:[{email:req.body.email},{status:{$ne:"DELETE"}},{userType:'USER'}],};
          let userResult = await userModel.findOne(query);
          if(!userResult){
            return res.send({reponseCode:404,responseMessage:'User not found .',responseResult:[],});
          }
          else{
            let otpForgot = commonFunction.otp()
            req.body.otpExpireTime=Date.now()+5*60*1000;
            let otpTime = req.body.otpExpireTime
            let subject = 'OTP varification for forgot password';
            let text = `Your OTP for verification : ${otpForgot}`;
            let send = await commonFunction.sendMail(req.body.email,subject,text,)
            if(send){
                let otpUpdate = await userModel.findOneAndUpdate({_id:userResult._id},{$set:{otp:otpForgot,otpVerify:false,otpExpireTime:otpTime}},{new:true})
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
    getProfile:async(req,res)=>{
        try{
            let query = { _id:req.params._id, status: { $ne: "DELETE" }, userType: 'USER' };
            let userResult = await userModel.findOne(query)
            if (!userResult) {
                return res.send({ reponseCode: 404, responseMessage: 'User not found .', responseResult: [], });
            }
            else {
                  const data = await userModel.findOne({_id:userResult._id}).populate('addressId')  
                  if(data){
                return res.send({ reponseCode: 200, responseMessage: 'Profile fetched successfully.', responseResult: data });
                  }
            }
        }catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message });
        }
    },
    editProfile: async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let user = await userModel.findOne(query);
            if (!user) {
                return res.send({ reponseCode: 404, responseMessage: 'User not found .', responseResult: [] });
            } else {
                    let profilePic=req.file.path
                    req.body.profilePic = await commonFunction.uploadImage(profilePic);
                    req.body.profilePic = req.body.profilePic
                    let updateUser = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: req.body }, { new: true })
                    if (updateUser) {
                        req.body.userId=updateUser._id;
                                let saveAddress = await new addressModel(req.body).save();
                                if(saveAddress){
                                let updateUsers = await userModel.findByIdAndUpdate({_id:updateUser._id},{$set:{addressId:saveAddress._id}},{new:true})
                                if(updateUsers){
                        return res.send({ reponseCode: 200, responseMessage: 'Succesfully updated', responseResult: updateUsers });
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
    resetPassword:async(req,res)=>{
        try {
            let query = {$and:[{$or:[{email:req.body.email},],},{status:{$ne:"DELETE"}},{userType:'USER'}],};
            let userResult = await userModel.findOne(query);
            if(!userResult){
              return res.send({reponseCode:404,responseMessage:'User not found .',responseResult:[],});
            }
            else{
                    let currentTime =Date.now();
                    if(req.body.otp==userResult.otp)
                    {
                        if(userResult.otpExpireTime>=currentTime){
                            req.body.newPassword=bcrypt.hashSync(req.body.newPassword)
                            let userUpdate =await userModel.findByIdAndUpdate({_id:userResult._id},{$set:{password:req.body.newPassword,otpVerify:true,}},{new:true})   
                                if (userUpdate) {
                                    return res.send({reponseCode:200,responseMessage:'Reset password successfully',result:userUpdate});
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
    changePassword:async(req,res)=>{
        try {
            let query = { $and: [{_id:req.dataId }, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            let userResult1 = await userModel.findOne(query);
            if(!userResult1){
              return res.send({reponseCode:404,responseMessage:'User not found .',responseResult:[],});
            }
            else{
                let passCheck = bcrypt.compareSync(req.body.password,userResult1.password);
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
                    let userUpdate =await userModel.findByIdAndUpdate({_id:userResult1._id},{$set:{password:req.body.newPassword,}},{new:true})   
                        if (userUpdate) {
                            return res.send({reponseCode:200,responseMessage:'Password changed successfully',result:userUpdate},);
                        }
                    }
                }
            }               
        } catch (error) {
            return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    listUser:async (req,res)=>{
        try {
            let query = { $and: [{ status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            if(req.query.search){
                query.$or=[ 
                    {name:{$regex:req.query.search,$option:'i'}},
                    {email:{$regex:req.query.search,$option:'i'}},
                ]
            }
            let options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.body.limit) || 10,
                populate: 'addressId',
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
            let userData = await userModel.paginate(query,options);
            if(userData.docs.length==0){
                res.send({responseCode:404,responseMessage:'User data not found!',responseResult:[]})
            }else{
                res.send({responseCode:200,responseMessage:'User data found!',responseResult:userData})
            }
        } catch (error) {
        res.send({responseCode:501,responseMessage:'Something went wrong!',responseResult:error.message})
        }
    },
    viewUser: async (req, res) => {
        try {
            let query = { $and: [{_id:req.dataId }, { status: { $ne: "DELETE" } }, { userType: 'USER' }], };
          let usersData = await userModel.findOne(query);
          if(!usersData){
            res.send({responseCode:404,responseMessage: "User data not found",responseResult:[]})
          }else{
            let userData = await userModel.paginate(query,{populate: 'addressId'});        
            if(userData.docs.length!=0){
                res.send({responseCode:200,responseMessage:'User data found!',responseResult:userData})
            }      
          }
        } catch (error) {
          return res.send({responseCode: 501,responseMessage: "Something went wrong!",responseResult: error.message,});
        }
    },
    getIfsc:async(req,res)=>{
        try {
            let upper = req.query.ifscCode.toUpperCase();
            let check = await ifsc.validate(upper)
            if(check == false){
                res.send({responseCode:400,responseMessage:'Invalid IFSC!',responseResult:[]})
            }
           else{
            let data = await ifsc.fetchDetails(upper);
            res.send({responseCode:200,responseMessage:'Data found!',responseResult:data})
           }
        } catch (error) {
            res.send({responseCode:501,responseMessage:'Something went wrong!',responseResult:error.message})
        }
    },
    userDetails:async (req,res)=>{
        try {
            let query = { $and: [{ status: { $ne: "DELETE" } }, { userType: 'USER' }], };
            if(req.query.search){
                query.$or=[ 
                    {name:{$regex:req.query.search,$option:'i'}},
                    {email:{$regex:req.query.search,$option:'i'}},
                ]
            }
            let options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.body.limit) || 10,
                // populate: 'addressId',
                // sort: { createdAt: -1},
            };
            await userModel.aggregate([
                {$lookup:{
                    from: 'addresses', 
                    localField:'addressId', 
                    foreignField:'_id',
                    as:'address_User'
                    },
                    // $geoNear: {
                    //     near: {
                    //         type: "Point",
                    //         coordinates: coordinates
                    //     },
                    //     maxDistance: maxDistance,
                    //     distanceField: "dist.calculated",
                    //     spherical: true
                    // }
                },
                // {
                //     $project: {
                //       _id: 1,
                //       firstName: 1,
                //       lastName: 1,      
                //       phoneNumber: 1,
                //       email: 1,
                //       address_User: 1
                //     }
                // },    
            ])
            .then((result) => {
              return res.send(result);
            })
            .catch((error) => {
              return res.send(error);
            });
        } catch (error) {
        return res.send({responseCode:501,responseMessage:'Something went wrong!',responseResult:error.message})
        }
    },
    deleteUser:async(req,res)=>{
        try {
            let query1 = { $and: [{ _id:req.dataId}, { status: { $ne: "DELETE" } },{userType:"ADMIN"}], };
                let admin1 = await subAdminModel.findOne(query1);
                if(admin1){
                    let user = await userModel.findOne({ $and: [{_id:req.body._id}, { status: { $ne: "DELETE" } }, { userType: 'USER' }], })
                    if (user) {
                        let delUser =await userModel.findByIdAndUpdate({_id:user._id},{$set:{userType:"DELETE"}},{new:true})
                        if (delUser) {
                            return res.send({reponseCode:200,responseMessage:'User Delete Successfully'})
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

