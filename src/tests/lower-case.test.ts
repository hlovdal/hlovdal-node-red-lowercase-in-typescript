import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
} from "vitest";
import {
	default as helper,
	TestFlowsItem,
} from "node-red-node-test-helper";

import { resolve } from "./resolve.js";
import { LowerCaseNodeInitializer } from "../lower-case.js";

helper.init(resolve("node-red"));

// Introducing these types so that it will be a compile-time error to misspell the node ids.
type TestNodeId = "lowerCaseNode" | "helperNode";
// Replace `id: string` which allows everything with a narrowed id that only accepts TestNodeId values.
type TestFlowsItemWithTypedId = Omit<TestFlowsItem, "id"> & { id: TestNodeId };

function createTestFlow(): TestFlowsItemWithTypedId[] {
	const flow: TestFlowsItemWithTypedId[] = [
		{
			id: "lowerCaseNode",
			type: "lower-case",
			name: "lower-case",
			wires: [["helperNode"]],
		},
		{ id: "helperNode", type: "helper" },
	];
	return flow;
}

function getNodeById(h: typeof helper, id: TestNodeId): ReturnType<typeof helper.getNode> {
	return h.getNode(id);
}

describe("lower-case Node", () => {
	beforeEach(() => new Promise<void>(resolve => {
		helper.startServer(resolve);
	}));

	afterEach(() => new Promise<void>(resolve => {
		helper.unload();
		helper.stopServer(resolve);
	}));

	it("should be loaded", () => new Promise<void>((resolve, reject) => {
		const flow = [
			{ id: "n1", type: "lower-case", name: "lower-case" },
		];
		helper.load(LowerCaseNodeInitializer, flow, () => {
			const n1 = helper.getNode("n1");
			try {
				expect(n1.name).to.equal("lower-case");
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}));

	it("should make payload lower case", () => new Promise<void>((resolve, reject) => {
		const flow = createTestFlow();
		helper.load(LowerCaseNodeInitializer, flow, () => {
			const helperNode = getNodeById(helper, "helperNode");
			const lowerCaseNode = getNodeById(helper, "lowerCaseNode");
			helperNode.on("input", (msg) => {
				try {
					expect(msg.payload).to.equal("uppercase");
					resolve();
				} catch (err) {
					reject(err);
				}
			});
			lowerCaseNode.receive({ payload: "UpperCase" });
		});
	}));

	const testData = [
		{ msg: { payload: 3.14 }, expected: 3.14 },
		{ msg: { payload: null }, expected: null },
		{ msg: { payload: { a: "A" } }, expected: { a: "A" } },
	];
	testData.forEach((data) => {
		it(`should pass through messages unchanged when payload is not a string but ${JSON.stringify(data.msg.payload)}`, () => new Promise<void>((resolve, reject) => {
			const flow = createTestFlow();
			helper.load(LowerCaseNodeInitializer, flow, () => {
				const helperNode = getNodeById(helper, "helperNode");
				const lowerCaseNode = getNodeById(helper, "lowerCaseNode");
				helperNode.on("input", (msg) => {
					try {
						expect(msg.payload).to.toEqual(data.expected);
						resolve();
					} catch (err) {
						reject(err);
					}
				});
				lowerCaseNode.receive(data.msg);
			});

		}));
	});

	it("should pass through messages unchanged when it has no payload member", () => new Promise<void>((resolve, reject) => {
		const flow = createTestFlow();
		helper.load(LowerCaseNodeInitializer, flow, function () {
			const helperNode = getNodeById(helper, "helperNode");
			const lowerCaseNode = getNodeById(helper, "lowerCaseNode");
			helperNode.on("input", (msg) => {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const {_msgid, ...msgWithoutId } = msg;
					expect(msgWithoutId).not.to.have.property("payload");
					expect(msgWithoutId).toEqual({ foo: "bar" });
					resolve();
				} catch (err) {
					reject(err);
				}
			});
			lowerCaseNode.receive({ foo: "bar" });
		});
	}));
});
