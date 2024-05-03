import { React, useState } from "react";
const DelayForm = (props) => {
  function handleFormSubmit(event) {
    props.buttonChange();
    event.preventDefault();
    props.changeDelayName(
      event.target.elements.days.value,
      event.target.elements.hours.value,
      event.target.elements.minutes.value
    );
  }
  return (
    <div
      style={{
        background: "lightgray",
        padding: "20px",
        margin: "10px",
        marginLeft: "-80px",
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="number"
            name="days"
            id="days"
            placeholder="Days"
            style={{ height: "25px", width: "70px" }}
          />
          <input
            type="number"
            name="hours"
            id="hours"
            placeholder="Hours"
            style={{ height: "25px", width: "70px" }}
          />
          <input
            type="number"
            name="minutes"
            id="minutes"
            placeholder="Minutes"
            style={{ height: "25px", width: "70px" }}
          />
        </div>
        <button type="submit" style={{ marginLeft: "0px" }}>
          Submit
        </button>
        <button
          type="button"
          style={{ marginLeft: "50px" }}
          onClick={props.onDelete}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default DelayForm;
