const router =  require('express').Router();
const centerController = require('../controller/centerController')
const auth = require('../middleware/auth')

/**
* @swagger
* /center/addCenter:
*   post:
*     tags:
*       - VACCINE CENTER MANAGEMENT
*     description: Creating Docs for VACCINE CENTER
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: centerName
*         description: Center Name is required.
*         in: formData
*         required: true
*       - name: contractNo
*         description: Contract Number is required.
*         in: formData
*         required: true
*       - name: coordinates
*         description: coordinates  is required.
*         in: formData
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
router.post('/addCenter',auth.subJwtToken,centerController.addCenter)
/**
* @swagger
* /center/viewCenter:
*   put:
*     tags:
*       - VACCINE CENTER MANAGEMENT
*     description: Creating Docs for VACCINE CENTER
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: _id
*         description: Center Id is required.
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
router.put('/viewCenter',auth.jwtToken,centerController.viewCenter)
/**
* @swagger
* /center/updateCenter:
*   put:
*     tags:
*       - VACCINE CENTER MANAGEMENT
*     description: Creating Docs for VACCINE CENTER
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: _id
*         description: ceneter Id Name is required.
*         in: formData
*         required: true
*       - name: centerName
*         description: Center Name is required.
*         in: formData
*         required: true
*       - name: contractNo
*         description: Contract Number is required.
*         in: formData
*         required: true
*       - name: coordinates
*         description: coordinates  is required.
*         in: formData
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
router.put('/updateCenter',auth.subJwtToken,centerController.updateCenter)
/**
* @swagger
* /center/centerList:
*   get:
*     tags:
*       - VACCINE CENTER MANAGEMENT
*     description: Creating Docs for VACCINE CENTER
*     produces:
*       - application/json
*     parameters:
*       - name: long
*         description: longitide is required.
*         in: query
*         required: true
*       - name: lat
*         description: latitude is required.
*         in: query
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
router.get('/centerList',centerController.centerList)
/**
* @swagger
* /center/deleteCenter:
*   delete:
*     tags:
*       - VACCINE CENTER MANAGEMENT
*     description: Creating Docs for VACCINE CENTER
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: _id
*         description: Center Id is required.
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
router.delete('/deleteCenter',auth.subJwtToken,centerController.deleteCenter)

module.exports =router