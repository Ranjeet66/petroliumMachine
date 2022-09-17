const router =  require('express').Router();
const bookingController = require('../controller/bookingController')
const auth = require('../middleware/auth')

/**
* @swagger
* /booking/slotBooking:
*   post:
*     tags:
*       - VACCINE SLOTS MANAGEMENT
*     description: Creating Docs for VACCINE SLOTS
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
*       - name: slotDate
*         description: Slot Date is required.
*         in: formData
*         required: true
*       - name: slotTime
*         description: Slot Time is required.
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
router.post("/slotBooking",auth.jwtToken,bookingController.slotBooking)
/**
* @swagger
* /booking/slotApprove:
*   put:
*     tags:
*       - VACCINE SLOTS MANAGEMENT
*     description: Creating Docs for VACCINE SLOTS
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: _id
*         description: Booking Id is required.
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
router.put("/slotApprove",auth.subJwtToken,bookingController.slotApprove)
/**
* @swagger
* /booking/viewBookingDetails:
*   get:
*     tags:
*       - VACCINE SLOTS MANAGEMENT
*     description: Creating Docs for VACCINE SLOTS
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: _id
*         description: Booking Id is required.
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
router.get("/viewBookingDetails",auth.jwtToken,bookingController.viewBookingDetails)
/**
* @swagger
* /booking/updateSlot:
*   put:
*     tags:
*       - VACCINE SLOTS MANAGEMENT
*     description: Creating Docs for VACCINE SLOTS
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
*       - name: slotDate
*         description: Slot Date is required.
*         in: formData
*         required: true
*       - name: slotTime
*         description: Slot Time is required.
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
router.put("/updateSlot",auth.jwtToken,bookingController.updateSlot)
/**
* @swagger
* /booking/cancelSlot:
*   delete:
*     tags:
*       - VACCINE SLOTS MANAGEMENT
*     description: Creating Docs for VACCINE SLOTS
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
*         in: header
*         required: true
*       - name: _id
*         description: Booking Id is required.
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
router.delete("/cancelSlot",auth.jwtToken,bookingController.cancelSlot)
/**
* @swagger
* /booking/bookingSlotList:
*   get:
*     tags:
*       - VACCINE SLOTS MANAGEMENT
*     description: Creating Docs for VACCINE SLOTS
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: Token is required.
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
router.get("/bookingSlotList",auth.subJwtToken,bookingController.bookingSlotList)

module.exports=router
