//jQuery.sap.registerModulePath("demo.suresh.reusecomp", "/home/user/projects/reusecomp/webapp");
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("demo.suresh.compconsumer.controller.View1", {
            onInit: function () {
                var oViewModel = new JSONModel({
                    CustomerID: ""
                });
                this.getView().setModel(oViewModel, "local");
            },

            initComponent: function (sCustomerID) {
                if (!this._customerDetailComponent) {
                    var oCustomerDetailComponent = this.getOwnerComponent().createComponent({
                        usage: "customerDetailComponent",
                        settings: {
                            customerID: sCustomerID
                        }
                    });
                    oCustomerDetailComponent.then(
                        function (oCustomerDetail) {
                            oCustomerDetail.setCustomerID(sCustomerID);
                            this.byId("customerDetailContainer").setComponent(oCustomerDetail);
                            this._customerDetailComponent = oCustomerDetail;
                        }.bind(this)
                    );
                } else {
                    this._customerDetailComponent.setCustomerID(sCustomerID);
                }
            },

            onGo: function (oControlEvent) {
                // let sCustomerID = this.getView().getModel("local").getProperty("/CustomerID");
                let sCustomerID = "ALVIN";
                sCustomerID && this.initComponent(sCustomerID);
            }
        });
    });
