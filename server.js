const express = require("express");
const app = express();
require('./database/mongoosedb');
require('./models/userModel');
const cors = require("cors");
const userModel = require('./models/userModel');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const moment = require("moment")


var corsOptions = {
    origin: "https://manage-task-app.herokuapp.com/",
    credentials: true,
  };
  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin',  'https://manage-task-angular-app.herokuapp.com/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })


app.post("/sign-up/", async (request, response) => {
    let userObj = {
        "firstName":request.body.firstName ? request.body.firstName : "",
        "lastName":request.body.lastName ? request.body.lastName : "",
        "email": request.body.email ? request.body.email : "",
        "password":request.body.password ? request.body.password : "",
        "dateCreated": new Date().toISOString()
    }
    const user = new userModel(userObj);
    console.log(user,"Added User")
    try {
      let responseObject = {
        status : 200,
        message :"User created successfully",
        data : user
      }
      await user.save();
      response.send(responseObject);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.post("/login", async (request, response) => {
    try {
      let user = {
        "email":request.body.email,
        "password":request.body.pwd,
    }
    let userInfo = await userModel.findOne(
      user
    )
    console.log(userInfo,"USUSU")
    if(!userInfo){
    response.send(500).send("Email & password doesn't match")
    } else {
      let responseObject = {
        status : 200,
        message :"User logged in successfully"
      }
      response.send(responseObject);
    }
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/getUsers", async (request, response) => {
    try {
      let userInfo = await userModel.find({})
      let responseObject = {
        status : 200,
        message :"User logged in successfully",
        data : userInfo
      }
      userInfo.forEach(element => { 
        console.log(moment(element.dateCreated).format("YYYY-MM-DD hh:mm:ss"))
        element.dateCreated = moment(element.dateCreated).format('MM/DD/YYYY hh:mm:ss');
      });
      const newArr = userInfo.map(obj => {
        if (obj.id === 1) {
          return {...obj, dateCreated: moment(element.dateCreated).format("YYYY-MM-DD hh:mm:ss")};
        }
      
        return obj;
      });
      
      console.log(newArr)
      response.send(userInfo);
    } catch (error) {
      response.status(500).send(error);
    }
});
