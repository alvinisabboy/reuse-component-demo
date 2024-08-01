sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("demo.suresh.reusecomp.controller.View1", {
            onInit: function () {
                this.getView().bindElement(this.getOwnerComponent().getBindingPath(),{model:"northwind"});
                this.getOwnerComponent().setView(this.getView());
            }
        });
    });
