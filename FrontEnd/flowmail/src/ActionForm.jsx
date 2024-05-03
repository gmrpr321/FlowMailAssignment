import { React, useState } from "react";
const ActionForm = (props) => {
  const [emailContent, setEmailContent] = useState([]);

  function handleFormSubmit(event) {
    event.preventDefault();
    props.buttonChange();
    console.log(event.target.elements.actionName.value);
    if (event.target.elements.actionName.value !== "")
      props.setActionName(event.target.elements.actionName.value);
    console.log(props.data);
    props.data.content = event.target.elements.Emailtext.value;
  }
  console.log(emailContent);
  return (
    <div
      style={{
        background: "lightgray",
        padding: "20px",
        margin: "10px",
        marginLeft: "-150px",
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            style={{ marginBottom: "5px" }}
            type="text"
            placeholder="Action Label"
            name="actionName"
          />
          <textarea
            id="textarea2"
            name="Emailtext"
            rows="4"
            cols="50"
            placeholder="Email Content"
          />
        </div>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
        <button
          type="button"
          style={{ marginLeft: "170px" }}
          onClick={props.onDelete}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default ActionForm;
