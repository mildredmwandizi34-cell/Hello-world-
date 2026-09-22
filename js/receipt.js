/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   RECEIPT SYSTEM
   Matches receipt.html + receipt.css
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. FIND SHIPMENT
       ===================================================== */

    const params = new URLSearchParams(window.location.search);
    const trackingFromURL = params.get("tracking");

    let shipment = null;

    try {
        const storedShipments =
            JSON.parse(localStorage.getItem("shipments") || "[]");

        if (trackingFromURL && Array.isArray(storedShipments)) {
            shipment = storedShipments.find(function (item) {
                return (
                    item &&
                    (
                        item.trackingNumber === trackingFromURL ||
                        item.tracking === trackingFromURL
                    )
                );
            });
        }

        /* Fallback to the single stored shipment */
        if (!shipment) {
            const singleShipment =
                JSON.parse(localStorage.getItem("shipment") || "null");

            if (
                singleShipment &&
                (
                    !trackingFromURL ||
                    singleShipment.trackingNumber === trackingFromURL ||
                    singleShipment.tracking === trackingFromURL
                )
            ) {
                shipment = singleShipment;
            }
        }

    } catch (error) {
        console.error("Shipment loading error:", error);
    }

    /* =====================================================
       2. SHIPMENT NOT FOUND
       ===================================================== */

    if (!shipment) {
        alert("Shipment not found.");
        window.location.href = "create-shipment.html";
        return;
    }

    /* Keep the selected shipment available */
    try {
        localStorage.setItem("shipment", JSON.stringify(shipment));
    } catch (error) {
        console.warn("Could not update local shipment:", error);
    }

    /* =====================================================
       3. HELPERS
       ===================================================== */

    function value(field, fallback = "—") {
        const result = shipment[field];

        if (
            result === undefined ||
            result === null ||
            String(result).trim() === ""
        ) {
            return fallback;
        }

        return String(result);
    }

    function set(id, text) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = text;
        }
    }

    function money(field) {
        const number = parseFloat(shipment[field]);

        if (isNaN(number)) {
            return "—";
        }

        return number.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return new Date().toLocaleDateString();
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleDateString();
    }

    /* =====================================================
       4. BASIC DOCUMENT INFORMATION
       ===================================================== */

    const trackingNumber =
        value(
            "trackingNumber",
            value("tracking", "AGL000000")
        );

    const receiptNumber =
        value(
            "receiptNumber",
            "RCP-" + Date.now()
        );

    const documentNo =
        value(
            "documentNo",
            "DOC-" + Math.floor(100000 + Math.random() * 900000)
        );

    const verificationCode =
        value(
            "verificationCode",
            "VER-" + Math.floor(100000 + Math.random() * 900000)
        );

    const issueDate =
        value(
            "createdTime",
            value("issueDate", new Date().toISOString())
        );

    /* =====================================================
       5. HEADER
       ===================================================== */

    set("receiptNumber", receiptNumber);
    set("receiptDate", formatDate(issueDate));
    set("documentNo", documentNo);

    /* =====================================================
       6. SUMMARY BAR
       ===================================================== */

    set("summaryService", value("service"));
    set("summaryTransport", value("service"));
    set("summaryShipping", value("shippingCost"));
    set("summaryPackage", value("package"));
    set("summaryWeight", value("weight"));

    const origin = value("origin");
    const destination = value("destination");

    set(
        "summaryRoute",
        origin + " → " + destination
    );

    set(
        "summaryPayment",
        value("paymentStatus")
    );

    set(
        "summaryVerify",
        "Verified"
    );

    /* =====================================================
       7. SENDER
       ===================================================== */

    set("senderName", value("senderName"));
    set("senderCompany", value("senderCompany"));
    set("senderAddress", value("senderAddress"));
    set("senderCity", value("senderCity"));
    set("senderCountry", value("senderCountry"));
    set("senderPhone", value("senderPhone"));
    set("senderEmail", value("senderEmail"));

    /* =====================================================
       8. RECEIVER
       ===================================================== */

    set("receiverName", value("receiverName"));
    set("receiverCompany", value("receiverCompany"));
    set("receiverAddress", value("receiverAddress"));
    set("receiverCity", value("receiverCity"));
    set("receiverCountry", value("receiverCountry"));
    set("receiverPhone", value("receiverPhone"));
    set("receiverEmail", value("receiverEmail"));

    /* =====================================================
       9. SHIPMENT DETAILS
       ===================================================== */

    set("referenceNumber", value("referenceNumber"));
    set("customerReference", value("customerReference"));
    set("package", value("package"));
    set("packageType", value("packageType"));
    set("pieces", value("pieces"));
    set("weight", value("weight"));
    set("dimensions", value("dimensions"));
    set("declaredValue", value("declaredValue"));
    set("service", value("service"));
    set("insurance", value("insurance"));
    set("paymentStatus", value("paymentStatus"));
    set("delivery", value("deliveryDate"));
    set("instructions", value("instructions"));

    /* =====================================================
       10. ROUTE
       IMPORTANT:
       ONLY ORIGIN + DESTINATION.
       NO CURRENT LOCATION.
       ===================================================== */

    set("origin", origin);
    set("destination", destination);

    /* =====================================================
       11. CHARGES
       ===================================================== */

    set("shippingCost", money("shippingCost"));
    set("tax", money("tax"));
    set("discount", money("discount"));
    set("totalAmount", money("totalAmount"));

    set(
        "paymentStatusBottom",
        value("paymentStatus")
    );

    /* =====================================================
       12. VERIFICATION
       ===================================================== */

    set("verificationStatus", "Verified");
    set("verificationReceiptNumber", receiptNumber);
    set("verificationTrackingNumber", trackingNumber);
    set("verificationDocumentNo", documentNo);
    set("verificationCodeDisplay", verificationCode);

    /* =====================================================
       13. FOOTER
       ===================================================== */

    set("footerDocumentNo", documentNo);
    set("footerIssueDate", formatDate(issueDate));
    set("receiptNumberBottom", receiptNumber);
    set("trackingNumberBottom", trackingNumber);

    /* =====================================================
       14. BARCODE
       ===================================================== */

    if (
        typeof JsBarcode !== "undefined" &&
        document.getElementById("barcodeLarge")
    ) {
        try {
            JsBarcode(
                "#barcodeLarge",
                trackingNumber,
                {
                    format: "CODE128",
                    lineColor: "#083b80",
                    width: 1.6,
                    height: 42,
                    displayValue: true,
                    fontSize: 9,
                    margin: 2
                }
            );
        } catch (error) {
            console.warn("Barcode error:", error);
        }
    }

    /* =====================================================
       15. QR CODE
       ===================================================== */

    const qrElement = document.getElementById("qrcode");

    if (
        qrElement &&
        typeof QRCode !== "undefined"
    ) {
        try {

            qrElement.innerHTML = "";

            const trackURL =
                "https://mildredmwandizi34-cell.github.io/Hello-world-/track.html?tracking=" +
                encodeURIComponent(trackingNumber);

            new QRCode(
                qrElement,
                {
                    text: trackURL,
                    width: 54,
                    height: 54,
                    correctLevel: QRCode.CorrectLevel.M
                }
            );

        } catch (error) {
            console.warn("QR code error:", error);
        }
    }

    /* =====================================================
       16. MAP COORDINATES
       ===================================================== */

    const coordinates = {

        /* Cities */
        "nairobi": [-1.286389, 36.817223],
        "london": [51.5074, -0.1278],
        "new york": [40.7128, -74.0060],
        "los angeles": [34.0522, -118.2437],
        "miami": [25.7617, -80.1918],
        "toronto": [43.6532, -79.3832],
        "vancouver": [49.2827, -123.1207],
        "paris": [48.8566, 2.3522],
        "berlin": [52.5200, 13.4050],
        "rome": [41.9028, 12.4964],
        "madrid": [40.4168, -3.7038],
        "beijing": [39.9042, 116.4074],
        "tokyo": [35.6762, 139.6503],
        "sydney": [-33.8688, 151.2093],
        "delhi": [28.6139, 77.2090],
        "cape town": [-33.9249, 18.4241],

        /* Countries / regions */
        "kenya": [-0.0236, 37.9062],
        "usa": [39.8283, -98.5795],
        "united states": [39.8283, -98.5795],
        "uk": [55.3781, -3.4360],
        "united kingdom": [55.3781, -3.4360],
        "canada": [56.1304, -106.3468],
        "germany": [51.1657, 10.4515],
        "france": [46.2276, 2.2137],
        "italy": [41.8719, 12.5674],
        "spain": [40.4637, -3.7492],
        "china": [35.8617, 104.1954],
        "japan": [36.2048, 138.2529],
        "australia": [-25.2744, 133.7751],
        "india": [20.5937, 78.9629],
        "south africa": [-30.5595, 22.9375],
        "scotland": [56.4907, -4.2026],
        "costa rica": [9.7489, -83.7534]
    };

    function getCoordinates(place) {

        if (!place) {
            return null;
        }

        const text = String(place).toLowerCase().trim();

        /* Exact match */
        if (coordinates[text]) {
            return coordinates[text];
        }

        /* Partial match */
        for (const key in coordinates) {
            if (text.includes(key)) {
                return coordinates[key];
            }
        }

        return null;
    }

    /* =====================================================
       17. MAP
       ===================================================== */

    const mapElement =
        document.getElementById("receiptMap");

    if (
        mapElement &&
        typeof L !== "undefined"
    ) {

        try {

            const originCoords =
                getCoordinates(origin);

            const destinationCoords =
                getCoordinates(destination);

            /* Default world view */
            const start =
                originCoords || [0, 0];

            const end =
                destinationCoords || [20, 20];

            const map =
                L.map(
                    "receiptMap",
                    {
                        zoomControl: false,
                        attributionControl: false,
                        dragging: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false,
                        keyboard: false,
                        touchZoom: false
                    }
                );

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution: ""
                }
            ).addTo(map);

            /* Origin marker */
            L.circleMarker(
                start,
                {
                    radius: 6,
                    color: "#083b80",
                    fillColor: "#0b4ea2",
                    fillOpacity: 1,
                    weight: 2
                }
            )
            .addTo(map)
            .bindTooltip(
                "Origin",
                {
                    permanent: false
                }
            );

            /* Destination marker */
            L.circleMarker(
                end,
                {
                    radius: 6,
                    color: "#c66d00",
                    fillColor: "#ff9800",
                    fillOpacity: 1,
                    weight: 2
                }
            )
            .addTo(map)
            .bindTooltip(
                "Destination",
                {
                    permanent: false
                }
            );

            /* Route line */
            const route =
                L.polyline(
                    [start, end],
                    {
                        color: "#0b4ea2",
                        weight: 3,
                        opacity: 0.9,
                        dashArray: "7,6"
                    }
                ).addTo(map);

            /* Fit route */
            map.fitBounds(
                route.getBounds(),
                {
                    padding: [18, 18]
                }
            );

            /* =================================================
               18. ANIMATED AIRPLANE
               ================================================= */

            const airplane =
                document.querySelector(".agl-airplane");

            if (airplane) {

                let progress = 0;

                function animatePlane() {

                    progress += 0.004;

                    if (progress > 1) {
                        progress = 0;
                    }

                    const lat =
                        start[0] +
                        (end[0] - start[0]) * progress;

                    const lng =
                        start[1] +
                        (end[1] - start[1]) * progress;

                    const point =
                        map.latLngToContainerPoint(
                            [lat, lng]
                        );

                    airplane.style.left =
                        point.x + "px";

                    airplane.style.top =
                        point.y + "px";

                    requestAnimationFrame(
                        animatePlane
                    );
                }

                animatePlane();
            }

            setTimeout(function () {
                map.invalidateSize();
            }, 300);

        } catch (error) {
            console.warn("Map error:", error);
        }

    } else {

        console.warn(
            "Leaflet is not available. Receipt will still display."
        );
    }

    /* =====================================================
       19. PRINT BUTTON
       ===================================================== */

    const printButton =
        document.getElementById("printReceipt");

    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {
                window.print();
            }
        );
    }

    /* =====================================================
       20. TRACK SHIPMENT BUTTON
       ===================================================== */

    const trackButton =
        document.getElementById("trackShipment");

    if (trackButton) {

        trackButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "track.html?tracking=" +
                    encodeURIComponent(trackingNumber);

            }
        );
    }

    /* =====================================================
       21. NEW SHIPMENT BUTTON
       ===================================================== */

    const newShipmentButton =
        document.getElementById("newShipment");

    if (newShipmentButton) {

        newShipmentButton.addEventListener(
            "click",
            function () {
                window.location.href =
                    "create-shipment.html";
            }
        );
    }

});
