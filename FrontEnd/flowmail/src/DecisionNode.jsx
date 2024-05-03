import { useCallback, useState } from "react";
import { Handle, Position, Panel, useReactFlow } from "reactflow";
const handleStyle = { left: 10 };
import DecisionForm from "./DecisionForm";
function DecisionNode({ data, isConnectable }) {
  const [decisionName, setDecisionName] = useState("Decision Node");
  const [showFormButton, setShowFormButton] = useState(false);
  const { setNodes } = useReactFlow();
  const { setEdges } = useReactFlow();
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  function handleButtonChange() {
    setShowFormButton((val) => !val);
  }
  function handleDecisionChanges(trueLabel, falseLabel) {
    data.trueLabel = trueLabel;
    data.falseLabel = falseLabel;
    console.log(data);
  }

  return (
    <div className="text-updater-node">
      <div>
        <button onClick={handleButtonChange}>{decisionName}</button>
        {showFormButton && (
          <DecisionForm
            buttonChange={handleButtonChange}
            setDecisionName={setDecisionName}
            onDelete={data.onDelete}
            onDecisionChange={handleDecisionChanges}
          ></DecisionForm>
        )}
      </div>
      {!showFormButton && (
        <div>
          <Handle
            type="source"
            id="a"
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            id="left"
            position={Position.Left}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            id="right"
            position={Position.Right}
            isConnectable={isConnectable}
          />
        </div>
      )}
    </div>
  );
}

export default DecisionNode;
