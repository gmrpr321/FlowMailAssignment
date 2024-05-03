import { useCallback, useState } from "react";
import { Handle, Position, Panel, useReactFlow } from "reactflow";
import ActionForm from "./ActionForm";
const handleStyle = { left: 10 };

function ActionNode({ data, isConnectable }) {
  const [showFormButton, setShowFormButton] = useState(false);
  const [actionName, setActionName] = useState("Action Node");
  function handleButtonChange() {
    setShowFormButton((val) => !val);
  }
  console.log(data);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div>
        <button onClick={handleButtonChange}>{actionName}</button>
        {showFormButton && (
          <ActionForm
            buttonChange={handleButtonChange}
            setActionName={setActionName}
            onDelete={data.onDelete}
            data={data}
          ></ActionForm>
        )}
      </div>
      {!showFormButton && (
        <div>
          <Handle
            type="source"
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
        </div>
      )}
    </div>
  );
}

export default ActionNode;
