const BASE_URL = "http://localhost:3002";
const nodemailer = require("nodemailer");
//Email in transporterData contains From email details, To email details are sent from frontEnd
const transporterData = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  service: "Gmail",
  auth: {
    user: "flowmaildemo@gmail.com", //from gmail
    pass: "iifi aynx hkcm esuv", //app passcode
  },
};
const DatabaseUtil = require("./databaseUtil");
const ExecuteUtil = {
  operations: (function () {
    const _sendMail = async (to, activity_id, text, isConditional) => {
      //function to send a mail to a specific email, also sends interactive elements if the type of mail is conditional
      let updatedText = text;
      if (isConditional) {
        //links for conditional emails
        updatedText += `\n Yes : ${BASE_URL}/conditionalYes/${activity_id}/${to}\n No : ${BASE_URL}/conditionalNo/${activity_id}/${to}`;
      }
      const transporter = nodemailer.createTransport(transporterData);
      const mailOptions = {
        from: transporterData.auth.user,
        to: to,
        subject: "This is an automated email",
        text: updatedText,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.error("Error:", error);
        else {
          console.log("Email sent:", info.response);
        }
      });
    };
    const _executeDelay = async (time) => {
      //function to execte a delay node that comes before an action, time is
      // given in "{number}D? {number}H? {number}M" format
      const parts = time.split(" ");

      let days = 0;
      let hours = 0;
      let minutes = 0;

      parts.forEach((part) => {
        if (part.includes("D")) {
          days = parseInt(part.replace("D", ""));
        } else if (part.includes("H")) {
          hours = parseInt(part.replace("H", ""));
        } else if (part.includes("M")) {
          minutes = parseInt(part.replace("M", ""));
        }
      });
      console.log(days, hours, minutes);
      totalMilliseconds =
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000;

      // Delay execution using setTimeout
      console.log(time, totalMilliseconds);
      await new Promise((resolve) => setTimeout(resolve, totalMilliseconds));
      return new Date();
    };
    const _getFlowActionByID = (flow, id) => {
      //function to get a specific flowaction from a list of actions in flow instance
      const actions = flow.actions.actions;
      const result = actions.find((action) => action.action_id == id);
      return result;
    };
    // const _nextActionByID = async () => {};
    const _executeActionByID = async (action_id, emailID) => {
      //given a action_id and emailid, retrieve that action from flow instance and perform it for this specific email
      //also performs delays and updates user entries
      const flowObj = await DatabaseUtil.flowUtil.getFlow();
      const action = _getFlowActionByID(flowObj, action_id);
      const time_to_delay = action.delay.trim();
      let isConditional = false;
      if (
        action.responses.get("yes") != "EOG" &&
        action.responses.get("no") !== "EOG"
      )
        isConditional = true;
      //perform delay
      console.log("Performing delay");
      const currentDate = await _executeDelay(time_to_delay);
      console.log("delay period complete");
      // const currentDateStr = currentDate.toISOString()
      //send Email
      const email_content = action.content;
      _sendMail(emailID, action.action_id, email_content, isConditional);
      DatabaseUtil.activityUtil.setRequestTimeOfActivity(emailID);
      //execute next action
      if (
        action.responses.get("yes") === "EOG" &&
        action.responses.get("no") === "EOG"
      )
        return; //leaf node
      if (isConditional) return; //conditional node, handle at endpoint
      if (
        action.responses.get("yes") != "EOG" &&
        action.responses.get("no") === "EOG"
      ) {
        //execute next seuential action
        _executeActionByID(action.responses.get("yes"), emailID);
      }
    };
    const _executeFirstAction = async () => {
      //function to execute the starting action, action execution follows DAG pattern and
      // this function repeatedly calls subsequent actions (clild nodes) if available
      //conditional nodes are handled at endpoint
      const flowDoc = await DatabaseUtil.flowUtil.getFlow();
      console.log(flowDoc.actions.start.responses);
      if (flowDoc.actions.start.responses.get("yes") != "EOG") {
        //get first action from start action
        const FirstActionID = flowDoc.actions.start.responses.get("yes");
        const firstAction = _getFlowActionByID(flowDoc, FirstActionID);
        let isConditional = false;
        if (
          firstAction.responses.get("yes") !== "EOG" &&
          firstAction.responses.get("no") !== "EOG"
        )
          isConditional = true;
        //send the first mail
        const mailIdList = flowDoc.ids;
        console.log(FirstActionID, mailIdList);
        await _executeDelay(firstAction.delay.trim());
        for (let i = 0; i < mailIdList.length; i++) {
          console.log(
            "attempt to send mail",
            flowDoc.actions.start.responses.get("yes")
          );
          //execute delay
          //send email to all in mailIDList
          await _sendMail(
            mailIdList[i],
            FirstActionID,
            firstAction.content,
            isConditional
          );
          console.log("send");
          //set the requestTime to current time
          DatabaseUtil.activityUtil.setRequestTimeOfActivity(mailIdList[i]);
        }
        //call upon next action
        if (firstAction.responses.get("yes") === "EOG") return;
        if (
          firstAction.responses.get("yes") !== "EOG" &&
          firstAction.responses.get("no") !== "EOG"
        )
          return; //handle at endpoint
        if (
          firstAction.response.Yes !== "EOG" &&
          firstAction.responses.get("no") === "EOG"
        ) {
          //execute the sequential action
          for (let i = 0; i < mailIdList.length; i++) {
            await _executeActionByID(firstAction.response.Yes, mailIdList[i]);
          }
        }
      }
    };

    return {
      executeFirstAction: _executeFirstAction,
      executeActionByID: _executeActionByID,
      getFlowActionByID: _getFlowActionByID,
    };
  })(),
};

module.exports = ExecuteUtil;
