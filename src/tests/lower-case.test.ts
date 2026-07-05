import {
	afterEach,
	beforeEach,
	describe,
	it,
} from "vitest";

// Side effects beyond the imported `should` reference, e.g. n1.should.have...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import should from "should";
import helper from "node-red-node-test-helper";

import { resolve } from "./resolve.js";
import { LowerCaseNodeInitializer } from "../lower-case.js";

helper.init(resolve("node-red"));

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
				n1.should.have.property("name", "lower-case");
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}));

	it("should make payload lower case", () => new Promise<void>((resolve, reject) => {
		const flow = [
			{
				id: "n1",
				type: "lower-case",
				name: "lower-case",
				wires: [["n2"]],
			},
			{ id: "n2", type: "helper" },
		];
		helper.load(LowerCaseNodeInitializer, flow, () => {
			const n2 = helper.getNode("n2");
			const n1 = helper.getNode("n1");
			n2.on("input", (msg) => {
				try {
					msg.should.have.property(
						"payload",
						"uppercase",
					);
					resolve();
				} catch (err) {
					reject(err);
				}
			});
			n1.receive({ payload: "UpperCase" });
		});
	}));
});
