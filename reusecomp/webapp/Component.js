/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
    ],
    function (UIComponent, ReuseComponentSupport) {
        "use strict";

        return UIComponent.extend("demo.suresh.reusecomp.Component", {
            metadata: {
                manifest: "json",
                library: "demoLibrary",
                //interfaces: ["sap.ui.core.IAsyncContentCreation"],
                properties: {
                    /* Standard properties for reuse components */
                    uiMode: {
                        type: "string",
                        group: "standard"
                    },
                    semanticObject: {
                        type: "string",
                        group: "standard"
                    },
                    stIsAreaVisible: {
                        type: "boolean",
                        group: "standard"
                    },
                    /* Component specific properties */
                    customerID: {
                        type: "string",
                        group: "specific",
                        defaultValue: ""
                    }

                }
            },

            setStIsAreaVisible: function (bIsAreaVisible) {
              if (bIsAreaVisible !== this.getStIsAreaVisible()) {
                this.setProperty("stIsAreaVisible", bIsAreaVisible); 
              }  
            },

            setCustomerID: function (sCustomerID) {
                if(sCustomerID !== this.getCustomerID()){
                    this.setProperty("customerID", sCustomerID);
                    // this.getStIsAreaVisible() &&
                    // this.getModel("northwind").metadataLoaded().then(this._setViewBinding.bind(this,sCustomerID));
                }
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                //Transform this component into a reuse component for smart templates:
                ReuseComponentSupport.mixInto(this);
                //Defensive call of init of the super class:
                ( UIComponent.prototype.init || jQuery.noop ).apply(this, arguments);
            },

            setView: function (oView) {
                this._compView = oView;  
            },
            getBindingPath: function () {
                return this._bindingPath;
            },
            _setViewBinding: function (sCustomerID) {
                var oModel = this.getModel("northwind");
                this._bindingPath = oModel.createKey("/Customers", {
                    CustomerID: sCustomerID
                });
                if (this._compView) {
                    this._compView.bindElement(this._bindingPath,{model:"northwind"});
                }
            }
        });
    }
);