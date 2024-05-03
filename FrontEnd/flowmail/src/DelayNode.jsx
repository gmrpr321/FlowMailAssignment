import { useCallback, useState } from "react";
import { Handle, Position, Panel } from "reactflow";
const handleStyle = { left: 10 };
import DelayForm from "./DelayForm";
function DelayNode({ data, isConnectable }) {
  const [delayName, setDelayName] = useState("Delay Node");
  function handleButtonChange() {
    setShowFormButton((val) => !val);
  }
  function handleDelayNameChange(days, hrs, mins) {
    let res = "";
    if (days != "") res += days + "D ";
    if (hrs != "") res += hrs + "H ";
    if (mins != "") res += mins + "M ";
    if (days != "" || hrs != "" || mins != "") {
      data.time = res;
      setDelayName("DELAY " + res);
      console.log(data.time);
    }
  }
  const [showFormButton, setShowFormButton] = useState(false);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div>
        <button
          onClick={() => {
            setShowFormButton((val) => !val);
          }}
        >
          {delayName}
        </button>
        {showFormButton && (
          <DelayForm
            buttonChange={handleButtonChange}
            changeDelayName={handleDelayNameChange}
            onDelete={data.onDelete}
          ></DelayForm>
        )}
      </div>
      {!showFormButton && (
        <div>
          {" "}
          <Handle
            type="target"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Top}
            isConnectable={isConnectable}
          />
        </div>
      )}
    </div>
  );
}

export default DelayNode;
