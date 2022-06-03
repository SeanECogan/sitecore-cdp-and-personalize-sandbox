var _boxeverq = _boxeverq || [];
var _boxever_settings = {
    client_key: "psfu6uh05hsr9c34rptlr06dn864cqrx",           // Provided from Boxever Partner Sandbox System Settings > API Access.
    pointOfSale: "sean-cogan",                                // Configured in Boxever Partner Sandbox System Settings > Points of Sale.
    cookie_domain: "",                                        // Seems to be an optional property, but must be included in the settings object.
    web_flow_target: "https://d35vb5cccm4xzp.cloudfront.net", // Unsure where this comes from or if it is required.
    target: "https://api.boxever.com/v1.2"                    // Related to Sitecore geozone
};

(function () {
    $.getScript("https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.8.min.js");
})();