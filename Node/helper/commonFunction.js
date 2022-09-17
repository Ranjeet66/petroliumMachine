const nodeMailer = require('nodemailer');
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: 'dlqjbnrqk', 
    api_key: '792375176357873', 
    api_secret: '7MhD3CtCTt2h_dSPdHmbZglqEOQ' 
  });

module.exports = {
    otp: ()=>{
            let randomNumber =Math.random();
            let sixDigit= Math.floor(randomNumber*100000)+100000;
            return sixDigit;
    },
    generateSlots:async(req,res)=>{
        try {
            let ra=[]
            let d2 = new Date()
            for(j=09;j<17;j++){
                if(j<=12){
                    d2.setMinutes(00)+d2.setHours(j)+d2.setSeconds(00)
                    for(let i=0;i<4;i++){
                        let f =15*i
                        d2.setMinutes(f)
                        let r= d2.toLocaleTimeString()
                        ra.push(r);
                    }
                }else if(j>=14){
                    d2.setMinutes(00)+d2.setHours(j)+d2.setSeconds(00)
                    for(let i=0;i<4;i++){
                        let f =15*i
                        d2.setMinutes(f)
                        let r= d2.toLocaleTimeString()
                        ra.push(r);
                    }
                }else{
                    d2.setMinutes(00)+d2.setHours(13)+d2.setSeconds(00)
                    let sbTime= d2.toLocaleTimeString()
                    d2.setMinutes(00)+d2.setHours(14)+d2.setSeconds(00)
                    let ebTime= d2.toLocaleTimeString()
                    let r= `Lunch/Break : ${sbTime} To ${ebTime}`
                    ra.push(r);
                }
            }
            return  ra;
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong !", responseResult: error.message });
        }
    },
    sendMail: async (email, subject, text) => {
        try {
            let transporter = nodeMailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                auth: {
                    user: "Usergmail",
                    pass: "password",
                },
            });
            let options = {
                from: "Usergmail",
                to: email,
                subject: subject,
                text: text,
            }
            return await transporter.sendMail(options)
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong !", responseResult: error.message })
        }
    },
    uploadImage: async (image) => {
        try {
            let upload = await cloudinary.uploader.upload(image);
            return upload.secure_url;
        } catch (error) {
            return res.send({ responseCode: 501, responseMessage: "Something went wrong !", responseResult: error.message });
        }
    },
    generatedSNo(count){
        var str =""+count
        var pad ="00001" 
        var ans= pad.substring(0,pad.length-str.length)+str
        return ans;
    },  
}
