import * as nodered from "node-red";

export const LowerCaseNodeInitializer = function (RED: nodered.NodeAPI) {

	function LowerCaseNode(this: nodered.Node, config: nodered.NodeDef) {
		RED.nodes.createNode(this, config);
		const node = this;
		node.on("input", function (msg) {
			if (msg.payload && typeof msg.payload === "string") {
				msg.payload = msg.payload.toLowerCase();
			}
			node.send(msg);
		});

	}
	RED.nodes.registerType("lower-case", LowerCaseNode);
};

export default LowerCaseNodeInitializer;
