/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"demosuresh/compconsumer/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
