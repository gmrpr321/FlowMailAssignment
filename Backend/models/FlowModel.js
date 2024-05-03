const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  action_id: String,
  delay: String,
  content: String,
  responses: {
    type: Map,
    of: String,
  },
});

const dataSchema = new mongoose.Schema({
  ids: [String],
  actions: {
    start: {
      ids: [String],
      action_id: String,
      delay: String,
      responses: {
        type: Map,
        of: String,
      },
    },
    actions: [actionSchema],
  },
});

const DataModel = mongoose.model("FlowModel", dataSchema);

module.exports = DataModel;
