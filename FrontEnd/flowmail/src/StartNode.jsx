import { useCallback, useState } from "react";
import { Handle, Position, Panel } from "reactflow";
import StartForm from "./StartForm";
const handleStyle = { left: 10 };

function StartNode({ data, isConnectable }) {
  const [showFormButton, setShowFormButton] = useState(false);
  //handles hide button
  function handleButtonChange() {
    setShowFormButton((val) => !val);
  }
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div className="text-updater-node">
      <div>
        <button onClick={handleButtonChange}>Start Node</button>
        {showFormButton && (
          <StartForm buttonChange={handleButtonChange} data={data}></StartForm>
        )}
      </div>
      {!showFormButton && (
        <Handle
          type="target"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
}

export default StartNode;
