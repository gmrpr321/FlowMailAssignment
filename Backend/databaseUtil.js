const Activity = require("./models/ActivityModel");
const Flow = require("./models/FlowModel");

const DatabaseUtil = {
  flowUtil: (function () {
    const _saveFlow = async (data) => {
      //save a flow instance
      const doc = new Flow(data);
      await doc.save();
    };
    const _getFlow = async () => {
      //get a flow instance
      const doc = await Flow.findOne({});
      return doc;
    };
    const _deleteAllInstance = async () => {
      //delete all flow instances
      try {
        const result = await Flow.deleteMany({});
        console.log(`${result.deletedCount} instances deleted.`);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    return {
      saveFlow: _saveFlow,
      getFlow: _getFlow,
      deleteAllInstance: _deleteAllInstance,
    };
  })(),
  activityUtil: (function () {
    const _getActivityFromID = async (emailId) => {
      //returns the activity instance with this specific emailID
      const doc = await Activity.findOne({ emailId: emailId });
      return doc;
    };
    const _setRequestTimeOfActivity = async (emailId) => {
      //used when delay node is expired, the Request time of Activity instance
      //is updated to current time
      try {
        const doc = await Activity.findOne({ emailId: emailId });
        if (!doc) {
          console.error("Activity document not found for emailId:", emailId);
          return;
        }
        doc.activity.requestTime = new Date().toISOString();
        await doc.save();

        console.log("Request time updated for emailId:", emailId);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const _deleteAllInstance = async () => {
      //deletes all instances of activity
      try {
        const result = await Activity.deleteMany({});
        console.log(`${result.deletedCount} instances deleted.`);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const _createActivityFromFlow = async (data) => {
      //populates the Activity collection from Flow instance
      const docs = [];
      console.log(data, typeof data);
      const emailIds = data.ids;
      for (let i = 0; i < emailIds.length; i++) {
        const currentDoc = {
          emailId: emailIds[i],
          activity: [],
        };
        const activities = data.actions.actions;
        for (let j = 0; j < activities.length; j++) {
          const currentActivity = {
            conditionName: activities[j].action_id,
            content: activities[j].content,
            requestTime: "",
            response: {
              conditionName: "",
              conditionResponse: "",
              responseTime: "",
            },
          };
          currentDoc.activity.push(currentActivity);
        }
        docs.push(currentDoc);
      }
      try {
        console.log(docs);
        const result = await Activity.create(docs);
        console.log(` ${result} ${result.length} Activity docs inserted.`);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    return {
      deleteAllInstance: _deleteAllInstance,
      createActivityFromFlow: _createActivityFromFlow,
      getActivityFromID: _getActivityFromID,
      setRequestTimeOfActivity: _setRequestTimeOfActivity,
    };
  })(),
};
module.exports = DatabaseUtil;
