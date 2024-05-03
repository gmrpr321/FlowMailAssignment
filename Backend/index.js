const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const DatabaseUtil = require("./databaseUtil");
const ExecuteUtil = require("./executeUtil");
dotenv.config();

const PORT = process.env.PORT | 3002;
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("[:date[web]] :method :url :status :total-time ms"));

app.get("/conditionalYes/:activity_id/:emailId", async (req, res) => {
  //Endpoint to handle the True condition made by user interaction to perform subsequent operations
  const activityId = req.params.activity_id;
  const emailId = req.params.emailId;
  const flowObj = await DatabaseUtil.flowUtil.getFlow();
  //get activity obj of ID
  console.log(flowObj);
  const activityObj = ExecuteUtil.operations.getFlowActionByID(
    flowObj,
    activityId
  );
  //get ID of true activity
  let trueActivity = null;
  if (activityObj) trueActivity = activityObj.responses.get("yes");
  if (trueActivity && trueActivity != "EOG")
    ExecuteUtil.operations.executeActionByID(trueActivity, emailId); //execute the true activity
  console.log(activityId, emailId);
  res.send(`Activity ID: ${activityId}, Email ID: ${emailId}`);
});

app.get("/conditionalNo/:activity_id/:emailId", async (req, res) => {
  //Endpoint to handle the False condition made by user interaction to perform subsequent operations
  const activityId = req.params.activity_id;
  const emailId = req.params.emailId;
  const flowObj = await DatabaseUtil.flowUtil.getFlow();
  //get activity obj of ID
  console.log(flowObj);
  const activityObj = ExecuteUtil.operations.getFlowActionByID(
    flowObj,
    activityId
  );
  //get ID of false activity
  let falseActivity = null;
  if (activityObj) falseActivity = activityObj.responses.get("no");
  if (falseActivity && falseActivity != "EOG")
    ExecuteUtil.operations.executeActionByID(falseActivity, emailId); //execute the false activity
  console.log(activityId, emailId);
  res.send(`Activity ID: ${activityId}, Email ID: ${emailId}`);
});

app.post("/createFlow", async (req, res) => {
  const flowData = req.body;
  console.log(flowData, typeof flowData);

  await DatabaseUtil.flowUtil.deleteAllInstance();
  await DatabaseUtil.activityUtil.deleteAllInstance();
  await DatabaseUtil.flowUtil.saveFlow(flowData);

  const savedFlow = await DatabaseUtil.flowUtil.getFlow();
  //constructing Activity models for users using flowData
  const flowObj = flowData;
  console.log("flowoo", flowObj);
  await DatabaseUtil.activityUtil.createActivityFromFlow(flowObj);
  //initiate flow execution
  await ExecuteUtil.operations.executeFirstAction();
  console.log("done");
  //fun nextActionbyID => if actions.ID.responses.get("no") == EOG but yes is true, call executeActionByID of yes and modifies responseTime
  //if actions.ID.responses.get("yes") == EOG return (reached the leaf node) and modifies responseTime
  // if actions.ID.responses.get("yes") and no , handle this at endpt
  //fun performDelaybyID => modifies requestTime, performs delay
  // fun excetueActionByID => finds the activity object, calls performDelayByID, sends email ,calls nextAction
  // endpt(email,ActivityID,responses:[yes,no])
  //find activity object
  //modifies response,responseTime of activity
  //find flow model of this activity
  // if response == True, call excetueActionByID(yes.ID)
  // if response == False, call excetueActionByID(no,ID)

  return res.status(200).json(savedFlow);
});

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAILED");
  }
  console.log(`APP LISTENING ON PORT ${PORT} - ${new Date()}`);
});
