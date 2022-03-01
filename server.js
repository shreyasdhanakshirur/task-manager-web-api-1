const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('./database/mongoosedb');
require('./models/tasksModel');
const cors = require("cors");
const tasksModel = require('./models/tasksModel');
require('dotenv').config();
const PORT = process.env.PORT || 3000;


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

  var router = express.Router();

app.post("/addTask/", async (request, response) => {
    let task = {
        "title":request.body.title,
        "description":request.body.description,
        "dateCreated": new Date().toISOString(),
        "dateModified":new Date().toISOString(),
        "status":"NEW"
    }
    const user = new tasksModel(task);
    console.log(user,"Added task")
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/getTasks", async (request, response) => {
    try {
     let tasksList = await tasksModel.find({});
     console.log(tasksList,"Fetched task")
      response.send(tasksList);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.post("/addSubTasks", async (request, response) => {
    try {
        let subTasks = {
            "subTasks": request.body.subTasks,
            "dateModified": new Date(),
            "_id": request.body._id
        }
      await tasksModel.updateOne({ _id: subTasks._id }, { $set: { subTasks: subTasks.subTasks , dateModified : subTasks.dateModified , status : "IN PROGRESS"} }).catch(
        error => {
           console.log(error);
         }
      );
      console.log("Successfully updated sub task")
      response.send({msg:"Updated Subtasks Successfully"});
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/task", async (request, response) => {
    try {
      let id = request.query.id;
      let task = await tasksModel.findOne({"_id":id})
      console.log(task,"Fetched task")
      response.send({task:task});
    } catch (error) {
      response.status(500).send(error);
    }
});
app.put("/updateTask", async (request, response) => {
    try {
        let updatedTask = request.body;
        updatedTask.dateModified = new Date();
        let id = request.query.id;
        if (updatedTask.subTasks.length === 0){
            updatedTask.status = "COMPLETED";
            await tasksModel.updateOne({ _id: id }, updatedTask).catch(
                error => {
                   console.log(error);
                 }
              );
        } else {
            await tasksModel.updateOne({ _id: id }, updatedTask).catch(
                error => {
                   console.log(error);
                 }
              );
        }
        console.log("Updated Subtasks Successfully")
      response.send({msg:"Updated Subtasks Successfully"});
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/taskOnStatus", async (request, response) => {
    try {
      let status = request.query.status;
      status = status.toUpperCase();
      let task = await tasksModel.find({"status":status})
      response.send({task:task});
    } catch (error) {
      response.status(500).send(error);
    }
});