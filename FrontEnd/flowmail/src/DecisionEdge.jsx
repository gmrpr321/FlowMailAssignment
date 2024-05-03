import {
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
  getBezierPath,
} from "reactflow";

export default function DecisionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  sourceHandleId,
  targetHandleId,
}) {
  //edge that will be used to connect a decision Node and other nodes
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  console.log(data);
  let labelXCor = -100;
  let labelYcor = -30;
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
          {data.labelName}
          <br /> X
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
