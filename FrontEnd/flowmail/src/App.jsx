import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Panel,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import StartNode from "./StartNode";
import DelayNode from "./DelayNode";
import ActionNode from "./ActionNode";
import DecisionNode from "./DecisionNode";
import NormalEdge from "./NormalEdge";
import DecisionEdge from "./DecisionEdge";
import JSONModule from "./util";

const BASE_URL = "http://localhost:3002";

const rfStyle = {};
let nodeId = 1;

const toSendJSON = {
  ids: [],
  actions: {
    start: { ids: [], action_id: "0", delay: "0M", responses: {} },
    actions: [],
  },
};
const initialNodes = [
  {
    id: "0",
    type: "startnode",
    position: { x: 0, y: 0 },
    data: { emailIds: [], prevNode: "", nextNode: "" },
  },
];

const nodeTypes = {
  startnode: StartNode,
  delaynode: DelayNode,
  actionnode: ActionNode,
  decisionnode: DecisionNode,
};
const edgeTypes = {
  normaledge: NormalEdge,
  decisionedge: DecisionEdge,
};

function App() {
  const [startMessage, setStartMessage] = useState("");
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  function handleNodeDelete(id) {
    setNodes((nodes) => nodes.filter((node) => node.id != id));
  }
  function handleMouseMove(event) {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }
  function updateJSON() {
    const startNodeResult = JSONModule.getStartNodeDets(nodes);
    const actionNodesResult = JSONModule.getActionNodesDets(nodes);
    toSendJSON.ids = startNodeResult.emailIds;
    toSendJSON.actions["start"]["ids"] = startNodeResult.emailIds;
    toSendJSON.actions["start"]["action_id"] = startNodeResult.action_id;
    toSendJSON.actions["start"]["delay"] = "0M ";
    toSendJSON.actions["start"]["responses"] = startNodeResult.responses;
    toSendJSON.actions["actions"] = actionNodesResult;
    console.log(toSendJSON);
  }
  async function handleServerCall() {
    try {
      const response = await fetch(`${BASE_URL}/createFlow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSendJSON),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  function addNewNode(type) {
    const curCount = nodeId;
    nodeId += 1;
    const x = 100;
    const y = 100;
    const newNode = {
      id: curCount.toString(),
      type: type,
      position: { x, y },
      data: {
        onDelete: handleNodeDelete.bind(null, curCount.toString()),
        prevNode: "",
        nextNode: "",
      },
    };
    if (type == "decisionnode") {
      newNode.data = {
        ...newNode.data,
        trueLabel: "True",
        falseLabel: "False",
        trueNextNode: "",
        falseNextNode: "",
      };
    }
    if (type == "actionnode") {
      newNode.data = {
        ...newNode.data,
        content: "",
      };
    }
    if (type == "delaynode") {
      newNode.data = {
        ...newNode.data,
        time: "",
      };
    }
    console.log(newNode);
    setNodes((nodes) => [...nodes, newNode]);
  }
  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        updateJSON();
        return applyNodeChanges(changes, nds);
      }),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        updateJSON();
        return applyEdgeChanges(changes, eds);
      }),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => {
      console.log(connection);
      let edgeType = "normaledge";
      let labelName = "";
      const srcObj = nodes.find((obj) => obj.id === connection.source);
      const destObj = nodes.find((obj) => obj.id === connection.target);
      destObj.data.nextNode = srcObj.id;
      srcObj.data.prevNode = destObj.id;
      console.log(destObj, nodes);
      if (
        connection.targetHandle == "left" ||
        connection.targetHandle == "right"
      ) {
        edgeType = "decisionedge";
        if (connection.targetHandle == "left") {
          labelName = destObj.data.trueLabel;
          destObj.data.trueNextNode = srcObj.id;
        }
        if (connection.targetHandle == "right") {
          labelName = destObj.data.falseLabel;
          destObj.data.falseNextNode = srcObj.id;
        }
      }
      const data = { labelName: labelName };
      const edge = { ...connection, type: edgeType, data };
      updateJSON();
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges, nodes]
  );
  //

  //
  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      onMouseMove={handleMouseMove}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={rfStyle}
      >
        <Controls />
        <Panel position="top-left">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "2px lightgray solid",
              borderRadius: "10px",
              backgroundColor: "lightgray",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  border: "2px lightgray solid",
                  borderRadius: "10px",
                  textAlign: "center",
                  backgroundColor: "black",
                  width: "100%",
                }}
              >
                Action Node
              </div>
              <div
                style={{
                  border: "2px lightgray solid",
                  borderRadius: "10px",
                  textAlign: "center",
                  backgroundColor: "black",
                }}
              >
                Delay Node
              </div>
              <div
                style={{
                  border: "2px lightgray solid",
                  borderRadius: "10px",
                  textAlign: "center",
                  backgroundColor: "black",
                }}
              >
                Decision Node
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <button
                style={{
                  height: "52px",
                  border: "2px lightgray solid",
                }}
                onClick={addNewNode.bind(null, "actionnode")}
              >
                +
              </button>
              <button
                style={{
                  height: "52px",
                  border: "2px lightgray solid",
                }}
                onClick={addNewNode.bind(null, "delaynode")}
              >
                +
              </button>
              <button
                style={{
                  height: "52px",
                  border: "2px lightgray solid",
                }}
                onClick={addNewNode.bind(null, "decisionnode")}
              >
                +
              </button>
            </div>
          </div>
        </Panel>
        <Panel position="top-right">
          <div>
            <button type={"button"} onClick={handleServerCall}>
              Submit And Initiate Sequence
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
