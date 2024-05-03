function findNextAction(currentNode, nodes) {
  const nextNodeId = currentNode.data.nextNode;
  console.log(currentNode.id);
  if (nextNodeId === "") return { yes: "EOG", no: "EOG" };
  const nextNode = nodes.find((node) => node.id == nextNodeId);
  if (!nextNode) return { yes: "EOG", no: "EOG" };
  console.log(currentNode.id, nextNodeId);
  const nextNodeType = nextNode.type;
  if (nextNodeId !== "" && nextNodeType == "actionnode")
    return { yes: nextNodeId, no: "EOG" };
  if (nextNodeId !== "" && nextNodeType == "decisionnode") {
    console.log("yesss");
    const trueNodeId = nextNode.data.trueNextNode;
    const falseNodeId = nextNode.data.falseNextNode;
    let yes = "EOG";
    let no = "EOG";
    console.log(trueNodeId, falseNodeId);
    if (trueNodeId) {
      const trueNode = nodes.find((node) => node.id == trueNodeId);
      if (trueNode.type == "actionnode") yes = trueNode.id;
      else if (trueNode.type == "delaynode")
        yes = findNextAction(trueNode, nodes).yes;
    }
    if (falseNodeId) {
      const falseNode = nodes.find((node) => node.id == falseNodeId);
      if (falseNode.type == "actionnode") no = falseNode.id;
      else if (falseNode.type == "delaynode")
        no = findNextAction(falseNode, nodes).yes;
    }
    return { yes: yes, no: no };
  }
  if (nextNodeId !== "" && nextNodeType == "delaynode")
    return findNextAction(nextNode, nodes);
}
function findPrevDelay(currentNode, nodes) {
  const prevNodeId = currentNode.data.prevNode;
  if (prevNodeId == "") return "0M";
  if (prevNodeId !== "") {
    const prevNode = nodes.find((node) => node.id == prevNodeId);
    if (prevNode.type == "delaynode") return prevNode.data.time;
  }
  return "0M";
}
const JSONModule = {
  getStartNodeDets: function (nodes) {
    console.log(nodes);
    const targetNode = nodes.find((node) => node.type === "startnode");
    const action_id = targetNode.id;
    const emailIds = targetNode.data.emailIds;
    const delay = findPrevDelay(targetNode, nodes);
    console.log(targetNode.id);
    const responses = findNextAction(targetNode, nodes);
    return { action_id, emailIds, delay, responses };
  },
  getActionNodesDets: function (nodes) {
    console.log(nodes);
    const actionNodes = nodes.filter((node) => node.type === "actionnode");
    console.log(actionNodes, Array.isArray(actionNodes));
    const actions = [];
    for (let i = 0; i < actionNodes.length; i++) {
      const currentAction = {
        action_id: actionNodes[i].id,
        delay: findPrevDelay(actionNodes[i], nodes),
        responses: findNextAction(actionNodes[i], nodes),
        content: actionNodes[i].data.content,
      };
      actions.push(currentAction);
    }
    return actions;
  },
};

export default JSONModule;
