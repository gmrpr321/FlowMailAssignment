import { React, useState } from "react";
const DecisionForm = (props) => {
  function handleFormSubmit(event) {
    event.preventDefault();
    props.buttonChange();
    props.onDecisionChange(
      event.target.elements.trueConditionLabel.value,
      event.target.elements.falseConditionLabel.value
    );

    if (event.target.elements.conditionName.value !== "")
      props.setDecisionName(event.target.elements.conditionName.value);
  }
  return (
    <div
      style={{
        display: "flex",
        color: "white",
        background: "Lightgray",
        padding: "20px",
        margin: "10px",
        marginLeft: "-120px",
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="conditionName"
            placeholder="Condition Name"
            style={{
              width: "98%",
              marginBottom: "10px",
              height: "24px",
            }}
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              name="trueConditionLabel"
              placeholder="True Condition Label"
              style={{
                height: "24px",
              }}
            />
            <input
              type="text"
              name="falseConditionLabel"
              placeholder="False Condition Label"
              style={{
                height: "24px",
              }}
            />
          </div>
        </div>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
        <button
          type="button"
          style={{ marginLeft: "90px" }}
          onClick={props.onDelete}
        >
          Delete Node
        </button>
      </form>
    </div>
  );
};

export default DecisionForm;
