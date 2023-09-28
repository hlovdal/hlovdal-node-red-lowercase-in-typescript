import should from "should";
import helper from "node-red-node-test-helper";

import { resolve } from "./resolve.js";
import { LowerCaseNodeInitializer } from "../lower-case.js";

helper.init(resolve("node-red"));

describe("lower-case Node", function () {
	beforeEach(function (done) {
		helper.startServer(done);
	});

	afterEach(function (done) {
		helper.unload();
		helper.stopServer(done);
	});

	it("should be loaded", function (done) {
		var flow = [
			{ id: "n1", type: "lower-case", name: "lower-case" },
		];
		helper.load(LowerCaseNodeInitializer, flow, function () {
			var n1 = helper.getNode("n1");
			try {
				n1.should.have.property("name", "lower-case");
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	it("should make payload lower case", function (done) {
		var flow = [
			{
				id: "n1",
				type: "lower-case",
				name: "lower-case",
				wires: [["n2"]],
			},
			{ id: "n2", type: "helper" },
		];
		helper.load(LowerCaseNodeInitializer, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			n2.on("input", function (msg) {
				try {
					msg.should.have.property(
						"payload",
						"uppercase"
					);
					done();
				} catch (err) {
					done(err);
				}
			});
			n1.receive({ payload: "UpperCase" });
		});
	});
});
