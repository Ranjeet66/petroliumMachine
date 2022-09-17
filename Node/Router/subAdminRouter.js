const router =  require('express').Router();
const subAdminController = require('../controller/subAdminController')
const auth = require('../middleware/auth')
const multer = require('multer')
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({storage:storage})

/**
* @swagger
* /subAdmin/addSubAdmin:
*   post:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: firstName
*         description: firstName is required.
*         in: formData
*         required: true
*       - name: lastName
*         description: lastName is required.
*         in: formData
*         required: true
*       - name: dateOfBirth
*         description: dateOfBirth is required.
*         in: formData
*         required: true
*       - name: mobileNumber
*         description: mobileNumber is required.
*         in: formData
*         required: true
*       - name: email
*         description: email is required.
*         in: formData
*         required: true
*       - name: password
*         description: password is required.
*         in: formData
*         required: true
*       - name: confirmPassword
*         description: confirmPassword is required.
*         in: formData
*         required: true
*       - name: image
*         description: image is required.
*         in: formData
*         type: file
*         required: true
*       - name: street
*         description: street is required.
*         in: formData
*         required: false
*       - name: area
*         description: area is required.
*         in: formData
*         required: false
*       - name: city
*         description: city is required.
*         in: formData
*         required: false
*       - name: state
*         description: state is required.
*         in: formData
*         required: false
*       - name: country
*         description: country is required.
*         in: formData
*         required: false
*       - name: pin
*         description: pin is required.
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.post("/addSubAdmin",auth.subJwtToken,upload.single('image'),subAdminController.addSubAdmin)
/**
* @swagger
* /subAdmin/otpVerifySAdmin:
*   put:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: email
*         description: email is required.
*         in: formData
*         required: true
*       - name: otp
*         description: otp is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.put("/otpVerifySAdmin",subAdminController.otpVerifySAdmin)
/**
* @swagger
* /subAdmin/resendOtpSAdmin:
*   put:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: email
*         description: email is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.put("/resendOtpSAdmin",subAdminController.resendOtpSAdmin)
/**
* @swagger
* /subAdmin/loginSAdmin:
*   post:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: email
*         description: email is required.
*         in: formData
*         required: true
*       - name: password
*         description: password is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.post("/loginSAdmin",subAdminController.loginSAdmin)
/**
* @swagger
* /subAdmin/forgotPasswordSAdmin:
*   put:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: email
*         description: email is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.put("/forgotPasswordSAdmin",subAdminController.forgotPasswordSAdmin)
/**
* @swagger
* /subAdmin/editProfileSAdmin:
*   put:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: firstName
*         description: firstName is required.
*         in: formData
*         required: false
*       - name: lastName
*         description: lastName is required.
*         in: formData
*         required: false
*       - name: dateOfBirth
*         description: dateOfBirth is required.
*         in: formData
*         required: false
*       - name: image
*         description: image is required.
*         in: formData
*         type: file
*         required: true
*       - name: street
*         description: street is required.
*         in: formData
*         required: false
*       - name: area
*         description: area is required.
*         in: formData
*         required: false
*       - name: city
*         description: city is required.
*         in: formData
*         required: false
*       - name: state
*         description: state is required.
*         in: formData
*         required: false
*       - name: country
*         description: country is required.
*         in: formData
*         required: false
*       - name: pin
*         description: pin is required.
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.put("/editProfileSAdmin",auth.subJwtToken,upload.single('image'),subAdminController.editProfileSAdmin)
/**
* @swagger
* /subAdmin/resetPasswordSAdmin:
*   put:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: email
*         description: email is required.
*         in: formData
*         required: true
*       - name: otp
*         description: otp is required.
*         in: formData
*         required: true
*       - name: newPassword
*         description: newPassword is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.put("/resetPasswordSAdmin",subAdminController.resetPasswordSAdmin)
/**
* @swagger
* /subAdmin/changePasswordSAdmin:
*   put:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: password
*         description: password is required.
*         in: formData
*         required: true
*       - name: newPassword
*         description: newPassword is required.
*         in: formData
*         required: true
*       - name: confirmNewPassword
*         description: confirmNewPassword is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.put("/changePasswordSAdmin",auth.subJwtToken,subAdminController.changePasswordSAdmin)
/**
* @swagger
* /subAdmin/viewSubAmdinSAdmin:
*   get:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.get('/viewSubAmdinSAdmin',auth.subJwtToken,subAdminController.viewSubAmdinSAdmin)
/**
* @swagger
* /subAdmin/deleteSubAdmin:
*   delete:
*     tags:
*       - SUB-ADMIN MANAGEMENT
*     description: Creating Docs for SUB-ADMIN
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: _id
*         description: Id is required.
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.delete('/deleteSubAdmin',auth.subJwtToken,subAdminController.deleteSubAdmin)

module.exports =router
