const routers =  require('express').Router();
const machineRouter = require('../controller/machineController')
const auth = require('../middleware/auth')
const multer = require('multer')
var storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, 'uploads')
    // },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({storage:storage})

/**
* @swagger
* /machine/machineNozzel:
*   post:
*     tags:
*       - MACHINE MANAGEMENT
*     description: Creating Docs for MACHINE
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: machineName
*         description: machineName is required.
*         in: formData
*         required: true
*       - name: nozzel
*         description: nozzel is required.
*         in: formData
*         required: true
*       - name: machineColor
*         description: machineColor is required.
*         in: formData
*         required: true
*       - name: machineCapacity
*         description: machineCapacity is required.
*         in: formData
*         required: true
*       - name: machineFuelType
*         description: machineFuelType is required.
*         in: formData
*         required: true
*       - name: machineImages
*         description: machineImages is required.
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
routers.post('/machineNozzel',auth.jwtToken,upload.array('image',15),machineRouter.machineNozzel);
/**
* @swagger
* /machine/machineList:
*   get:
*     tags:
*       - MACHINE MANAGEMENT
*     description: Creating Docs for MACHINE
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
routers.get('/machineList',auth.jwtToken,machineRouter.machineList);
/**
* @swagger
* /machine/editMachine:
*   put:
*     tags:
*       - MACHINE MANAGEMENT
*     description: Creating Docs for MACHINE
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: machineName
*         description: machineName is required.
*         in: formData
*         required: true
*       - name: nozzel
*         description: nozzel is required.
*         in: formData
*         required: true
*       - name: machineColor
*         description: machineColor is required.
*         in: formData
*         required: false
*       - name: machineCapacity
*         description: machineCapacity is required.
*         in: formData
*         required: true
*       - name: machineFuelType
*         description: machineFuelType is required.
*         in: formData
*         required: false
*       - name: machineImages
*         description: machineImages is required.
*         in: formData
*         type: file
*         required: true
*     responses:
*       200:
*         description: Done successfully.
*       404:
*         description: DATA NOT FOUND.
*       500:
*         description: Internal server error.
*/
routers.put('/editMachine',auth.jwtToken,upload.array('image',15),machineRouter.editMachine);
/**
* @swagger
* /machine/deleteMachine:
*   delete:
*     tags:
*       - MACHINE MANAGEMENT
*     description: Creating Docs for MACHINE
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token is required.
*         in: header
*         required: true
*       - name: machineName
*         description: machineName is required.
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
routers.delete('/deleteMachine',auth.jwtToken,machineRouter.deleteMachine);

module.exports =routers