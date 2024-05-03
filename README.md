# FlowMail
### An email marketing sequence via flowcharts
![Image](https://i.ibb.co/TrwZyqv/introDoc.png)
## Setup
- First, clone this repo using git clone
### Frontend
1. To navigate to FrontEnd folder, go to frontend/flowmail
    `cd frontend/flowmail`
2. Install Dependencies
   `npm install`
3. Run the FrontEnd server
   `npm run dev`
4. Visit the site link from the terminal to view the frontEnd
> Link for Deployed frontEnd Site via Vercel : https://dep-flow-mail.vercel.app/
### Backend
1. To navigate to the BackEnd folder, go to backend
    `cd backend`
2. Install Dependencies in package.json
   `npm install`
3. Change the localhost port if index.js if needed
4. Visit executeUtil.js and change the From email to your address
5. Also specify the app password for email. Follow this link to know how to generate an app code : https://miracleio.me/snippets/use-gmail-with-nodemailer/
6. Run the backend server
   `npm run dev`
7. Make calls from FrontEnd !!

## Flow of Execution 
<img src="https://i.ibb.co/Twq6X66/scale.png" width="700" height="700">

## Logic behind flowmail - Frontend 
 To make sure user has complete freedom to customizations, custom nodes were created with reactflow library to perform a specific action
#### StartNode

<img src="https://i.ibb.co/G2bvxRD/start-Node.png" width="300" height="180">

- It is a special node that cannot be deleted, and there can exist only one StartNode in a canvas. It denotes the start of execution of flow operations.
- StartNode accepts a list of emails separated by a newline to send automated messages:
    ```
    emailid1@gmail.com
    emailid2@gmail.com
    emailid#@gmail.com
    ...
    ```
- Nodes that are not children of StartNode will not be executed because the flow execution follows a Tree structure with StartNode as root.

  
#### ActionNode

<img src="https://i.ibb.co/ftS0r2G/action-Node.png" width="300" height="180">

- ActionNode denotes an action that can be executed in the flowChart. Each action node takes in a label to be displayed and an Email to send.
- Actions are executed only to email IDs that belong to the specific logic branch.

#### DelayNode

<img src="https://i.ibb.co/BctdyFC/delay-Node.png" width="300" height="180">

- Used to simulate a delay before an action and can only precede an ActionNode.
- Delay is specified in this format: {Days, Hours, Minutes}.
- The child action to DelayNode will be performed only after this duration ends.

#### DecisionNode

<img src="https://i.ibb.co/txxSrbF/decision-Node.png" width="300" height="180">

- Facilitates conditional branching and logic into flowcharts.
- Takes in a Decision label, True label, and False label.
- Nodes connected to DecisionNode have a special edge that describes the true and false flow of execution.
- Chaining of subsequent DecisionNodes is not supported in this version. (Coming soon!)

    
 #### FlowChart to JSON Representation
- Below is the JSON Representation of the flowchart in canvas, this is updated every time a change occurs in Canvas.
    ```  
    {
    "ids": ["e1", "e2", "e3"], //Email IDs collected from Start Node
     "actions": {
    "start": { //Start Action, Root node which calls other child actions
      "ids": [],
      "action_id": "0", 
      "delay": "",   //Delay before executing an acttion
      "responses": { "Yes": "a1", "No": "a2" }    //conditional responses, next actions are determined via these values for every user
    },
    "actions": [
     {
        "action_id": "a1",
        "delay": "",
        "content": "email Content",
        "responses": { "Yes": "a2", "No": "a3" }
      },
      {
        "action_id": "a2",
        "delay": "",
        "content": "email Content",
        "responses": { "Yes": "EOG", "No": "EOG" }   //EOG : End of Graph, specifies a leaf node
      },
      ]
     }
    }
    ```
## Logic behind Flowmail - Backend
#### GET /conditionalYes/:activity_id/:emailId

- **Description:** Endpoint to handle the True condition made by user interaction to perform subsequent operations.
- **Parameters:**
  - `activity_id`: The ID of the activity.
  - `emailId`: The email ID associated with the activity.
- **Functionality:**
  - Retrieves the activity object based on the provided `activity_id`.
  - Gets the ID of the subsequent activity for the "yes" response.
  - Executes the subsequent action if it exists and is not "EOG".

#### GET /conditionalNo/:activity_id/:emailId

- **Description:** Endpoint to handle the False condition made by user interaction to perform subsequent operations.
- **Parameters:**
  - `activity_id`: The ID of the activity.
  - `emailId`: The email ID associated with the activity.
- **Functionality:**
  - Retrieves the activity object based on the provided `activity_id`.
  - Gets the ID of the subsequent activity for the "no" response.
  - Executes the subsequent action if it exists and is not "EOG".

#### POST /createFlow

- **Description:** Endpoint to create and initiate flow execution based on provided flow data.
- **Request Body:** 
  - Flow data containing information about the flow and activities.
- **Functionality:**
  - Deletes all existing instances of flows and activities.
  - Saves the provided flow data to the database.
  - Creates activity models for users based on the flow data.
  - Initiates flow execution by executing the first action.




    
