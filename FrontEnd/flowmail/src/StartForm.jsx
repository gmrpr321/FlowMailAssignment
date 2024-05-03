import { React, useState } from "react";
const StartForm = (props) => {
  function handleFormSubmit(event) {
    event.preventDefault();
    props.buttonChange();
    console.log(event.target.elements);
    //collects email Ids to send to server
    props.data.emailIds = event.target.elements.Emailids.value.split(/\s+/);
  }

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
        <div style={{ marginBottom: "15px" }}>
          <textarea
            id="textarea1"
            name="Emailids"
            rows="4"
            cols="50"
            placeholder="List of newLine Separated Emails"
          />
        </div>

        <button type="submit" style={{ marginLeft: "150px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default StartForm;
