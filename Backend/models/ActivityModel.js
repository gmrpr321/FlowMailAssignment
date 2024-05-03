const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  conditionName: String,
  content: String,
  requestTime: String,
  response: {
    conditionName: String,
    conditionResponse: String,
    responseTime: String,
  },
});

const ActivitySchema = new mongoose.Schema({
  emailId: String,
  activity: [activitySchema],
});

const ActivityModel = mongoose.model("ActivityModel", ActivitySchema);

module.exports = ActivityModel;
