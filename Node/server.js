const bodyParser = require('body-parser');
const express = require('express');
const app= express();
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
require('./dbConnection/db');
const PORT = 3001;
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use('/user',require('./Router/userRouter'))
app.use('/static',require('./Router/staticRouter'))
app.use('/machine',require('./Router/machineRouter'))
app.use('/admin',require('./Router/adminRouter'))
app.use('/subAdmin',require('./Router/subAdminRouter'))
app.use('/center',require('./Router/centerRouter'))
app.use('/booking',require('./Router/bookingRouter'))

const swaggerDefinition = {
    info: {
      title: "compliance-node",
      version: "1.0.0",
      description: "Swagger API Docs",
    },
    host: `localhost:${PORT}`,
    basePath: "/",
};
   const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ["./Router/*.js"],
};
   const swaggerSpec = swaggerJSDoc(options);
   app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});
    
   /** Server Listen **/
   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   

    app.get('/data',function(req, res){
    res.send(`Hi my name is Ranjeet Singh`);
})
app.listen(PORT,(err,res)=>{
    if (err) {
        console.log('Internal server error',err);
    } else {
        console.log('Server is running on',PORT);
    }
});