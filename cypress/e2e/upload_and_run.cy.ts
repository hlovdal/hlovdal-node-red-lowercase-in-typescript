describe("lower-case node", function () {
	beforeEach("load fixture", function () {
		cy.fixture("quote_flow.json").as("quote_flow");
		cy.fixture("quote_flow_lowercase_text.txt").as("quote_flow_lowercase_text");
		cy.fixture("upload_file_path.txt").as("upload_file_path");
	});

	it("runs imported flow after update", function () {
		cy.visit("http://localhost:1880/");

		////// Install node
		cy.get("#red-ui-header-button-sidemenu").click();
		cy.get("#menu-item-edit-palette").click();
		cy.get("a[href^=\"#install\"]").click();

		// Setting dummy height and width to be able to interact with the file input.
		// Otherwise Cypress complains that the element is not visible:
		//   Timed out retrying after 4000ms: cy.selectFile() failed because this element is not visible:
		//   <input name="tarball" type="file" accept=".tgz">
		//   This element <input> is not visible because it has an effective width and height of: 0 x 0 pixels.
		cy.get("input[type=file]").invoke(
			"attr",
			"style",
			"height: 10px; width: 10px;",
		);
		cy.get("input[type=file]").selectFile(this.upload_file_path.trim());
		cy.get("button.editor-button")
			.contains("Upload")
			.click();

		// Wait for the success notification to appear.
		cy.get("div.red-ui-notification", {
			timeout: 30 * 1000,
		}).contains("Node added to palette:lower-case");
		cy.get("#node-dialog-ok").click();

		////// Import flow
		cy.get("#red-ui-header-button-sidemenu").click();
		cy.get("#menu-item-import").click();
		cy.get("#red-ui-clipboard-dialog-import-text").type(
			JSON.stringify(this.quote_flow),
			{ parseSpecialCharSequences: false },
		);

		cy.get("#red-ui-clipboard-dialog-import-opt-current").click();

		cy.get("#red-ui-clipboard-dialog-ok").click();
		cy.get("#red-ui-workspace").click();

		////// Deploy flow
		cy.get(
			"#red-ui-header-button-deploy.red-ui-deploy-button",
		).click();
		// Wait for deploy to finish.
		cy.get(
			"#red-ui-header-button-deploy.red-ui-deploy-button.disabled",
		);

		////// Trigger inject node
		// Possibly fragile seletor here, but I fond no better way to select the inject node's button.
		// Using force because a success notification may be covering the button.
		cy.get("#red-ui-workspace-chart rect[x=\"5\"]").click({ force: true });

		cy.get("#red-ui-tab-debug-link-button").click();
		cy.get(".red-ui-debug-msg-object-handle").click();
		cy.get(".red-ui-debug-msg-object-value").contains(this.quote_flow_lowercase_text);
	});
});
