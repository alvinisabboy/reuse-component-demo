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
                // this.getView().bindElement(this.getOwnerComponent().getBindingPath(),{model:"northwind"});
                this.getOwnerComponent().setView(this.getView());
            },


            onClickDisplay: function (oEvent) {
                const oi18nModel = sap.ui.getCore().i18nModel;


                const userLocale = navigator.language || navigator.userLanguage;
                const iso639LanguageCode = userLocale.split('-')[0];
                if (oi18nModel == undefined) {
                    const i18nModel = new sap.ui.model.resource.ResourceModel({
                        bundleUrl: "i18n/i18n.properties"
                    });
                    sap.ui.getCore().i18nModel = i18nModel;
                }
                const oResourceBundle = sap.ui.getCore().i18nModel.getResourceBundle();
                const oTable = sap.ui.getCore().byId("freightorders::FreightOrdersList--fe::table::FreightOrders::LineItem");
                const oSelected = oTable.getSelectedContexts();
                if (oSelected.length > 1) {
                    MessageToast.show(oResourceBundle.getText("selectOnlyOneFODisplay"));
                } else {

                    const oLineItem = oSelected[0].getObject();
                    console.log(oLineItem);
                    const sOrderNo = oLineItem.orderNumber;
                    if (sOrderNo == null) {
                        MessageToast.show(oResourceBundle.getText("DraftFODisplay"));

                        return;
                    }
                    const sTransport = oLineItem.vehicleResource.name;
                    const sUser = oLineItem.createdBy;
                    const dateString = oLineItem.createdAt;
                    const dateVal = new Date(dateString);

                    const sDate = dateVal.toDateString();
                    if (!this._busyDialog) {
                        this._busyDialog = new BusyDialog({
                            title: "Please wait",
                            text: "Loading data...",
                            showCancelButton: false,
                            close: function () {
                                // Handle the close event if needed
                            },
                        });
                    }
                    if (!this._PDFViewer) {
                        this._PDFViewer = new sap.m.PDFViewer({
                            width: "auto",
                            showDownloadButton: false

                        });
                    }
                    sap.ui.getCore().pdfViewer = this._PDFViewer;
                    sap.ui.getCore().busyDialog = this._busyDialog;
                    this._busyDialog.open();

                    //Make odata call



                    const oModel = this._view.getModel("adobe");
                    const oOperation = oModel.bindContext("/getRenderedDocument(...)");
                    oOperation.setParameter("FreightOrderNo", sOrderNo);
                    oOperation.setParameter("MeansOfTransport", sTransport);
                    oOperation.setParameter("CreatedBy", sUser);
                    oOperation.setParameter("CreatedOn", sDate);
                    oOperation.setParameter("Locale", iso639LanguageCode);

                    oOperation.execute().then(function () {
                        const oResult = oOperation.getBoundContext().getObject();
                        const base64data = oResult.value;
                        const decodedPdfContent = atob(base64data);
                        const byteArray = new Uint8Array(decodedPdfContent.length)
                        for (let i = 0; i < decodedPdfContent.length; i++) {
                            byteArray[i] = decodedPdfContent.charCodeAt(i);
                        }
                        const blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
                        const pdfurl = URL.createObjectURL(blob);
                        sap.ui.getCore().pdfViewer.setSource(pdfurl);
                        jQuery.sap.addUrlWhitelist("blob");

                        sap.ui.getCore().pdfViewer.downloadPDF = function () {
                            File.save(
                                byteArray.buffer,
                                "Hello_UI5",
                                "pdf",
                                "application/pdf"
                            );
                        };
                        sap.ui.getCore().pdfViewer.open();
                        sap.ui.getCore().busyDialog.close();
                    });
                }

            },
            onClickSendToPrinter: function () {
                const userLocale = navigator.language || navigator.userLanguage;
                const iso639LanguageCode = userLocale.split('-')[0];
                const oi18nModel = sap.ui.getCore().i18nModel;
                if (oi18nModel == undefined) {
                    const i18nModel = new sap.ui.model.resource.ResourceModel({
                        bundleUrl: "i18n/i18n.properties"
                    });
                    sap.ui.getCore().i18nModel = i18nModel;
                }
                const oResourceBundle = sap.ui.getCore().i18nModel.getResourceBundle();
                const oTable = sap.ui.getCore().byId("freightorders::FreightOrdersList--fe::table::FreightOrders::LineItem");
                const oSelected = oTable.getSelectedContexts();
                if (oSelected.length > 1) {
                    MessageToast.show(oResourceBundle.getText("selectOnlyOneFOPrint"));
                } else {

                    const oLineItem = oSelected[0].getObject();
                    console.log(oLineItem);
                    const sOrderNo = oLineItem.orderNumber;
                    if (sOrderNo == null) {
                        MessageToast.show(oResourceBundle.getText("DraftFOPrint"));

                        return;
                    }
                    const sTransport = oLineItem.vehicleResource.name;
                    const sUser = oLineItem.createdBy;
                    const dateString = oLineItem.createdAt;
                    const dateVal = new Date(dateString);

                    const sDate = dateVal.toDateString();


                    if (!this._busyDialog) {
                        this._busyDialog = new BusyDialog({
                            title: oResourceBundle.getText("pleaseWait"),
                            text: oResourceBundle.getText("loadingData"),
                            showCancelButton: false,
                            close: function () {
                                // Handle the close event if needed
                            },
                        });
                    }
                    sap.ui.getCore().busyDialog = this._busyDialog;
                    this._busyDialog.open();

                    const oModel = this._view.getModel("print");
                    const oOperation = oModel.bindContext("/printDocument(...)");
                    oOperation.setParameter("FreightOrderNo", sOrderNo);
                    oOperation.setParameter("MeansOfTransport", sTransport);
                    oOperation.setParameter("CreatedBy", sUser);
                    oOperation.setParameter("CreatedOn", sDate);
                    oOperation.setParameter("Locale", iso639LanguageCode);

                    oOperation.execute().then(function () {
                        const oResult = oOperation.getBoundContext().getObject();
                        sap.ui.getCore().busyDialog.close();
                        MessageToast.show(oResourceBundle.getText("sentToPrinter", [oResult.value]));
                        // MessageToast.show("Document :"+oResult.value+" was sent to the Printer.");
                    });

                }

            }

        });
    });
