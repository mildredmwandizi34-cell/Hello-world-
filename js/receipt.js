/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   SHIPMENT RECEIPT SYSTEM
   MATCHED TO receipt.html + receipt.css
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       FIND ELEMENT
       ===================================================== */

    function el(id) {
        return document.getElementById(id);
    }

    function put(id, value) {
        const element = el(id);

        if (element) {
            element.textContent =
                value === undefined ||
                value === null ||
                String(value).trim() === ""
                    ? "—"
                    : String(value);
        }
    }

    function getValue(object, names, fallback = "—") {

        for (let i = 0; i < names.length; i++) {

            const name = names[i];

            if (
                object &&
                object[name] !== undefined &&
                object[name] !== null &&
                String(object[name]).trim() !== ""
            ) {
                return object[name];
            }
        }

        return fallback;
    }

    function money(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "—";
        }

        const number = Number(
            String(value).replace(/[^0-9.-]/g, "")
        );

        if (isNaN(number)) {
            return String(value);
        }

        return number.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function dateText(value) {

        if (!value) {
            return new Date().toLocaleDateString();
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString();
    }


    /* =====================================================
       LOAD SHIPMENT
       ===================================================== */

    const params =
        new URLSearchParams(window.location.search);

    const requestedTracking =
        params.get("tracking");

    let shipment = null;


    try {

        const shipments =
            JSON.parse(
                localStorage.getItem("shipments") || "[]"
            );

        if (
            requestedTracking &&
            Array.isArray(shipments)
        ) {

            shipment = shipments.find(function (item) {

                if (!item) {
                    return false;
                }

                return (
                    String(item.trackingNumber || "")
                        .trim() ===
                    String(requestedTracking).trim()
                    ||
                    String(item.tracking || "")
                        .trim() ===
                    String(requestedTracking).trim()
                );

            });

        }

        /* Fallback to single shipment */
        if (!shipment) {

            const savedShipment =
                JSON.parse(
                    localStorage.getItem("shipment") || "null"
                );

            if (savedShipment) {

                if (!requestedTracking) {

                    shipment = savedShipment;

                } else {

                    const savedTracking =
                        String(
                            savedShipment.trackingNumber ||
                            savedShipment.tracking ||
                            ""
                        ).trim();

                    if (
                        savedTracking ===
                        String(requestedTracking).trim()
                    ) {
                        shipment = savedShipment;
                    }
                }
            }
        }

    } catch (error) {

        console.error(
            "AGL shipment loading error:",
            error
        );
    }


    /* =====================================================
       IF SHIPMENT DOES NOT EXIST
       ===================================================== */

    if (!shipment) {

        alert("Shipment not found.");

        window.location.href =
            "create-shipment.html";

        return;
    }


    /* =====================================================
       IMPORTANT IDENTIFIERS
       ===================================================== */

    const trackingNumber =
        getValue(
            shipment,
            ["trackingNumber", "tracking"],
            requestedTracking || "AGL000000"
        );

    const receiptNumber =
        getValue(
            shipment,
            ["receiptNumber"],
            "RCP-" + Date.now()
        );

    const documentNumber =
        getValue(
            shipment,
            ["documentNo", "documentNumber"],
            "DOC-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            )
        );

    const verificationCode =
        getValue(
            shipment,
            ["verificationCode"],
            "VER-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            )
        );

    const issueDate =
        getValue(
            shipment,
            ["createdTime", "issueDate", "dateCreated"],
            new Date().toISOString()
        );


    /* =====================================================
       SAVE GENERATED IDENTIFIERS BACK TO SHIPMENT
       ===================================================== */

    if (!shipment.receiptNumber) {
        shipment.receiptNumber = receiptNumber;
    }

    if (!shipment.documentNo) {
        shipment.documentNo = documentNumber;
    }

    if (!shipment.verificationCode) {
        shipment.verificationCode = verificationCode;
    }

    try {

        localStorage.setItem(
            "shipment",
            JSON.stringify(shipment)
        );

    } catch (error) {
        console.warn(
            "Could not update saved shipment.",
            error
        );
    }


    /* =====================================================
       SENDER
       ===================================================== */

    put(
        "senderName",
        getValue(shipment, ["senderName"])
    );

    put(
        "senderCompany",
        getValue(shipment, ["senderCompany"])
    );

    put(
        "senderAddress",
        getValue(shipment, ["senderAddress"])
    );

    put(
        "senderCity",
        getValue(shipment, ["senderCity"])
    );

    put(
        "senderCountry",
        getValue(shipment, ["senderCountry"])
    );

    put(
        "senderPhone",
        getValue(shipment, ["senderPhone"])
    );

    put(
        "senderEmail",
        getValue(shipment, ["senderEmail"])
    );


    /* =====================================================
       RECEIVER
       ===================================================== */

    put(
        "receiverName",
        getValue(shipment, ["receiverName"])
    );

    put(
        "receiverCompany",
        getValue(shipment, ["receiverCompany"])
    );

    put(
        "receiverAddress",
        getValue(shipment, ["receiverAddress"])
    );

    put(
        "receiverCity",
        getValue(shipment, ["receiverCity"])
    );

    put(
        "receiverCountry",
        getValue(shipment, ["receiverCountry"])
    );

    put(
        "receiverPhone",
        getValue(shipment, ["receiverPhone"])
    );

    put(
        "receiverEmail",
        getValue(shipment, ["receiverEmail"])
    );


    /* =====================================================
       SHIPMENT DETAILS
       ===================================================== */

    put(
        "referenceNumber",
        getValue(shipment, ["referenceNumber"])
    );

    put(
        "customerReference",
        getValue(shipment, ["customerReference"])
    );

    put(
        "package",
        getValue(shipment, ["package"])
    );

    put(
        "packageType",
        getValue(shipment, ["packageType"])
    );

    put(
        "pieces",
        getValue(shipment, ["pieces"])
    );

    put(
        "weight",
        getValue(shipment, ["weight"])
    );

    put(
        "dimensions",
        getValue(shipment, ["dimensions"])
    );

    put(
        "declaredValue",
        getValue(shipment, ["declaredValue"])
    );

    put(
        "service",
        getValue(shipment, ["service"])
    );

    put(
        "insurance",
        getValue(shipment, ["insurance"])
    );

    const paymentStatus =
        getValue(
            shipment,
            ["paymentStatus"],
            "Paid"
        );

    put(
        "paymentStatus",
        paymentStatus
    );

    put(
        "delivery",
        getValue(
            shipment,
            ["deliveryDate", "delivery"]
        )
    );

    put(
        "instructions",
        getValue(shipment, ["instructions"])
    );


    /* =====================================================
       ROUTE
       ===================================================== */

    const origin =
        getValue(
            shipment,
            ["origin"],
            "Origin"
        );

    const destination =
        getValue(
            shipment,
            ["destination"],
            "Destination"
        );

    put("origin", origin);
    put("destination", destination);


    /* =====================================================
       HEADER
       ===================================================== */

    put(
        "receiptNumber",
        receiptNumber
    );

    put(
        "receiptDate",
        dateText(issueDate)
    );

    put(
        "documentNo",
        documentNumber
    );


    /* =====================================================
       SUMMARY
       ===================================================== */

    const service =
        getValue(
            shipment,
            ["service"],
            "—"
        );

    const shippingCost =
        getValue(
            shipment,
            ["shippingCost"],
            "0"
        );

    put(
        "summaryService",
        service
    );

    put(
        "summaryTransport",
        service
    );

    put(
        "summaryShipping",
        money(shippingCost)
    );

    put(
        "summaryPackage",
        getValue(
            shipment,
            ["package", "packageType"]
        )
    );

    put(
        "summaryWeight",
        getValue(
            shipment,
            ["weight"]
        )
    );

    put(
        "summaryRoute",
        origin + " → " + destination
    );

    put(
        "summaryPayment",
        paymentStatus
    );

    put(
        "summaryVerify",
        "Verified"
    );


    /* =====================================================
       CHARGES
       ===================================================== */

    put(
        "shippingCost",
        money(
            getValue(
                shipment,
                ["shippingCost"],
                0
            )
        )
    );

    put(
        "tax",
        money(
            getValue(
                shipment,
                ["tax"],
                0
            )
        )
    );

    put(
        "discount",
        money(
            getValue(
                shipment,
                ["discount"],
                0
            )
        )
    );

    put(
        "totalAmount",
        money(
            getValue(
                shipment,
                ["totalAmount"],
                0
            )
        )
    );

    put(
        "paymentStatusBottom",
        paymentStatus
    );


    /* =====================================================
       DIGITAL VERIFICATION
       ===================================================== */

    put(
        "verificationStatus",
        "✓ VERIFIED"
    );

    put(
        "verificationReceiptNumber",
        receiptNumber
    );

    put(
        "verificationTrackingNumber",
        trackingNumber
    );

    put(
        "verificationDocumentNo",
        documentNumber
    );

    put(
        "verificationCodeDisplay",
        verificationCode
    );


    /* =====================================================
       FOOTER
       ===================================================== */

    put(
        "footerDocumentNo",
        documentNumber
    );

    put(
        "footerIssueDate",
        dateText(issueDate)
    );

    put(
        "receiptNumberBottom",
        receiptNumber
    );

    put(
        "trackingNumberBottom",
        trackingNumber
    );


    /* =====================================================
       BARCODE
       ===================================================== */

    try {

        if (
            typeof JsBarcode !== "undefined" &&
            el("barcodeLarge")
        ) {

            JsBarcode(
                "#barcodeLarge",
                String(trackingNumber),
                {
                    format: "CODE128",
                    width: 1.6,
                    height: 38,
                    displayValue: true,
                    fontSize: 9,
                    margin: 2
                }
            );
        }

    } catch (error) {

        console.warn(
            "AGL barcode error:",
            error
        );
    }


    /* =====================================================
       QR CODE
       ===================================================== */

    try {

        const qr =
            el("qrcode");

        if (
            qr &&
            typeof QRCode !== "undefined"
        ) {

            qr.innerHTML = "";

            const trackingURL =
                "https://mildredmwandizi34-cell.github.io/Hello-world-/track.html?tracking=" +
                encodeURIComponent(
                    trackingNumber
                );

            new QRCode(
                qr,
                {
                    text: trackingURL,
                    width: 51,
                    height: 51,
                    correctLevel:
                        QRCode.CorrectLevel.M
                }
            );
        }

    } catch (error) {

        console.warn(
            "AGL QR code error:",
            error
        );
    }


    /* =====================================================
       MAP COORDINATES
       ===================================================== */

    const locations = {

        /* Cities */
        "nairobi": [-1.286389, 36.817223],
        "mombasa": [-4.0435, 39.6682],

        "london": [51.5074, -0.1278],
        "edinburgh": [55.9533, -3.1883],
        "glasgow": [55.8642, -4.2518],

        "new york": [40.7128, -74.0060],
        "los angeles": [34.0522, -118.2437],
        "miami": [25.7617, -80.1918],
        "chicago": [41.8781, -87.6298],

        "toronto": [43.6532, -79.3832],
        "vancouver": [49.2827, -123.1207],

        "paris": [48.8566, 2.3522],
        "berlin": [52.5200, 13.4050],
        "rome": [41.9028, 12.4964],
        "madrid": [40.4168, -3.7038],

        "beijing": [39.9042, 116.4074],
        "shanghai": [31.2304, 121.4737],
        "tokyo": [35.6762, 139.6503],

        "sydney": [-33.8688, 151.2093],
        "melbourne": [-37.8136, 144.9631],

        "delhi": [28.6139, 77.2090],
        "mumbai": [19.0760, 72.8777],

        "cape town": [-33.9249, 18.4241],
        "johannesburg": [-26.2041, 28.0473],

        /* Countries */
        "kenya": [-0.0236, 37.9062],
        "usa": [39.8283, -98.5795],
        "united states": [39.8283, -98.5795],
        "america": [39.8283, -98.5795],

        "uk": [55.3781, -3.4360],
        "united kingdom": [55.3781, -3.4360],
        "scotland": [56.4907, -4.2026],

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

        "costa rica": [9.7489, -83.7534]
    };


    function findCoordinates(place) {

        if (!place) {
            return null;
        }

        const text =
            String(place)
                .toLowerCase()
                .trim();

        /* Exact */
        if (locations[text]) {
            return locations[text];
        }

        /* Partial */
        for (const key in locations) {

            if (
                text.includes(key)
            ) {
                return locations[key];
            }
        }

        return null;
    }


    /* =====================================================
       MAP
       ===================================================== */

    try {

        const mapElement =
            el("receiptMap");

        if (
            mapElement &&
            typeof L !== "undefined"
        ) {

            const originCoordinates =
                findCoordinates(origin) ||
                [0, 0];

            const destinationCoordinates =
                findCoordinates(destination) ||
                [20, 20];


            const map =
                L.map(
                    mapElement,
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


            /* Map tiles */

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution: ""
                }
            ).addTo(map);


            /* Origin */

            L.circleMarker(
                originCoordinates,
                {
                    radius: 6,
                    color: "#083b80",
                    fillColor: "#0b4ea2",
                    fillOpacity: 1,
                    weight: 2
                }
            ).addTo(map);


            /* Destination */

            L.circleMarker(
                destinationCoordinates,
                {
                    radius: 6,
                    color: "#d87800",
                    fillColor: "#ff9800",
                    fillOpacity: 1,
                    weight: 2
                }
            ).addTo(map);


            /* Route */

            const route =
                L.polyline(
                    [
                        originCoordinates,
                        destinationCoordinates
                    ],
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
                    padding: [15, 15]
                }
            );


      /* =================================================
   STATIONARY AIRPLANE
   ================================================= */

const airplane =
    document.querySelector(".agl-airplane");

if (airplane) {
    airplane.style.animation = "none";
    airplane.style.transform = "translate(-50%, -50%)";
}


    /* =====================================================
       PRINT
       ===================================================== */

    const printButton =
        el("printReceipt");

    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {
                window.print();
            }
        );
    }


    /* =====================================================
       TRACK SHIPMENT
       ===================================================== */

    const trackButton =
        el("trackShipment");

    if (trackButton) {

        trackButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "track.html?tracking=" +
                    encodeURIComponent(
                        trackingNumber
                    );
            }
        );
    }


    /* =====================================================
       NEW SHIPMENT
       ===================================================== */

    const newShipmentButton =
        el("newShipment");

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
      
