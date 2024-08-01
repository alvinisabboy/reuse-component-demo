
this.sap = this.sap || {};

(function () {
    "use strict";
    /*global jQuery, sap, window */
    sap.ushell = sap.ushell || {};

    function mergeConfig(oConfig, oConfigToMerge) {
        //just use jQuery.extend to merge configs
        jQuery.extend(true, oConfig, oConfigToMerge);
    }

    /**
       * @param {object} oConfig ushell configuration JSON object to be adjusted
       * @returns {object} Returns the merged oConfig object.
       * @private
       *
       */
    function adjustApplicationConfiguration(oConfig) {
        // apply config - groups and applications
        applyJsonApplicationConfig("extensions/config/launchpageconfig.json", oConfig);
        return oConfig;
    }

    /**
       * Read a new JSON application config defined by its URL and merge into oConfig.
       * @param sUrl {string} URL of JSON file to be merged into the configuration
       * @param oConfig {object} URL of JSON file to be merged into the configuration
       */
    function applyJsonApplicationConfig(sUrl, oConfig) {
        var log = sap.ui.require("sap/base/Log");
        var oXHRResponse;
        oXHRResponse = jQuery.sap.sjax({
            url: sUrl,
            dataType: "json",
            cache: false
        });
        if (oXHRResponse.success) {
            log.debug("Evaluating fiori launchpad sandbox config JSON: " + JSON.stringify(oXHRResponse.data));
            mergeConfig(oConfig, oXHRResponse.data, true);
        } else {
            if (oXHRResponse.statusCode !== 404) {
                log.error("Failed to load Fiori Launchpad Sandbox configuration from " + sUrl + ": status: " + oXHRResponse.status +
                    "; error: " + oXHRResponse.error);
            }
        }
    }

    sap.ushell.__sandbox__ = sap.ushell.__sandbox__ || {};
    sap.ushell.__sandbox__._mergeConfig = mergeConfig;
    sap.ushell.__sandbox__._adjustApplicationConfiguration = adjustApplicationConfiguration;

}());