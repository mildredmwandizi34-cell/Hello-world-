/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   SHIPMENT RECEIPT SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HELPERS
       ===================================================== */

    function setText(id, value) {
        const el = document.getElementById(id);

        if (el) {
            el.textContent =
                value === undefined ||
                value === null ||
                value === ""
                    ? "-"
                    : String(value);
        }
    }


    function getValue(obj, keys, fallback = "") {

        for (const key of keys) {

            if (
                obj &&
                obj[key] !== undefined &&
                obj[key] !== null &&
                obj[key] !== ""
            ) {
                return obj[key];
            }
        }

        return fallback;
    }


    function money(value) {

        const number = Number(value);

        if (isNaN(number)) {
            return "0.00";
        }

        return number.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    function cleanText(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "-";
        }

        return String(value);
    }


    /* =====================================================
       FIND TRACKING NUMBER
       ===================================================== */

    const params = new URLSearchParams(window.location.search);

    const trackingFromURL =
        params.get("tracking");


    /* =====================================================
       LOAD SHIPMENT
       ===================================================== */

    let shipments = [];

    try {
        shipments =
            JSON.parse(
                localStorage.getItem("shipments") || "[]"
            );
    } catch (error) {
        shipments = [];
    }


    let shipment = null;


    if (trackingFromURL) {

        shipment =
            shipments.find(function (item) {

                return (
                    String(item.trackingNumber || "")
                        .toUpperCase() ===
                    String(trackingFromURL)
                        .toUpperCase()
                    ||
                    String(item.tracking || "")
                        .toUpperCase() ===
                    String(trackingFromURL)
                        .toUpperCase()
                );

            });
    }


    /* =====================================================
       FALLBACK TO SINGLE SHIPMENT
       ===================================================== */

    if (!shipment) {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem("shipment") || "null"
                );

            if (saved) {
                shipment = saved;
            }

        } catch (error) {
            shipment = null;
        }
    }


    /* =====================================================
       IF NOTHING FOUND
       ===================================================== */

    if (!shipment) {

        document.body.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                font-family:Arial,sans-serif;
                background:#f2f5f8;
            ">
                <div style="
                    background:#fff;
                    border:2px solid #0b4ea2;
                    padding:35px;
                    text-align:center;
                    max-width:420px;
                ">
                    <h2 style="color:#0b4ea2;">
                        Shipment Not Found
                    </h2>

                    <p>
                        The requested shipment could not be found.
                    </p>

                    <a href="create-shipment.html"
                       style="
                           display:inline-block;
                           padding:10px 18px;
                           background:#0b4ea2;
                           color:#fff;
                           text-decoration:none;
                           font-weight:bold;
                       ">
                        Create Shipment
                    </a>
                </div>
            </div>
        `;

        return;
    }


    /* =====================================================
       CORE VALUES
       ===================================================== */

    const tracking =
        getValue(
            shipment,
            ["trackingNumber", "tracking"],
            trackingFromURL || "-"
        );


    const receiptNumber =
        getValue(
            shipment,
            ["receiptNumber"],
            "RCP-" + Date.now()
        );


    const documentNo =
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
            "AGL-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()
        );


    const issueDate =
        getValue(
            shipment,
            ["createdTime", "issueDate", "createdAt"],
            new Date().toISOString()
        );


    const formattedDate =
        new Date(issueDate).toLocaleDateString(
            "en-GB"
        );


    /* =====================================================
       HEADER
       ===================================================== */

    setText(
        "receiptNumber",
        receiptNumber
    );

    setText(
        "receiptDate",
        formattedDate
    );

    setText(
        "documentNo",
        documentNo
    );


    /* =====================================================
       SENDER
       ===================================================== */

    setText(
        "senderName",
        getValue(
            shipment,
            ["senderName", "sender"]
        )
    );

    setText(
        "senderCompany",
        getValue(
            shipment,
            ["senderCompany"]
        )
    );

    setText(
        "senderAddress",
        getValue(
            shipment,
            ["senderAddress"]
        )
    );

    setText(
        "senderCity",
        getValue(
            shipment,
            ["senderCity"]
        )
    );

    setText(
        "senderCountry",
        getValue(
            shipment,
            ["senderCountry"]
        )
    );

    setText(
        "senderPhone",
        getValue(
            shipment,
            ["senderPhone"]
        )
    );

    setText(
        "senderEmail",
        getValue(
            shipment,
            ["senderEmail"]
        )
    );


    /* =====================================================
       RECEIVER
       ===================================================== */

    setText(
        "receiverName",
        getValue(
            shipment,
            ["receiverName", "receiver"]
        )
    );

    setText(
        "receiverCompany",
        getValue(
            shipment,
            ["receiverCompany"]
        )
    );

    setText(
        "receiverAddress",
        getValue(
            shipment,
            ["receiverAddress"]
        )
    );

    setText(
        "receiverCity",
        getValue(
            shipment,
            ["receiverCity"]
        )
    );

    setText(
        "receiverCountry",
        getValue(
            shipment,
            ["receiverCountry"]
        )
    );

    setText(
        "receiverPhone",
        getValue(
            shipment,
            ["receiverPhone"]
        )
    );

    setText(
        "receiverEmail",
        getValue(
            shipment,
            ["receiverEmail"]
        )
    );


    /* =====================================================
       SHIPMENT DETAILS
       ===================================================== */

    const reference =
        getValue(
            shipment,
            ["referenceNumber", "reference"]
        );

    const customerReference =
        getValue(
            shipment,
            ["customerReference"]
        );

    const packageName =
        getValue(
            shipment,
            ["package"]
        );

    const packageType =
        getValue(
            shipment,
            ["packageType"]
        );

    const pieces =
        getValue(
            shipment,
            ["pieces"],
            "1"
        );

    const weight =
        getValue(
            shipment,
            ["weight"]
        );

    const dimensions =
        getValue(
            shipment,
            ["dimensions"]
        );

    const declaredValue =
        getValue(
            shipment,
            ["declaredValue"],
            "0"
        );

    const service =
        getValue(
            shipment,
            ["service"],
            "Air Freight"
        );

    const insurance =
        getValue(
            shipment,
            ["insurance"],
            "No"
        );

    const paymentStatus =
        getValue(
            shipment,
            ["paymentStatus", "payment"],
            "Pending"
        );

    const delivery =
        getValue(
            shipment,
            ["deliveryDate", "delivery"]
        );

    const instructions =
        getValue(
            shipment,
            ["instructions"],
            "None"
        );


    setText("referenceNumber", reference);
    setText("customerReference", customerReference);
    setText("package", packageName);
    setText("packageType", packageType);
    setText("pieces", pieces);
    setText("weight", weight);
    setText("dimensions", dimensions);

    setText(
        "declaredValue",
        declaredValue
            ? money(declaredValue)
            : "-"
    );

    setText("service", service);
    setText("insurance", insurance);
    setText("paymentStatus", paymentStatus);
    setText("delivery", delivery);
    setText("instructions", instructions);


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

    const currentLocation =
        getValue(
            shipment,
            ["currentLocation", "location"],
            origin
        );


    setText("origin", origin);
    setText("currentLocation", currentLocation);
    setText("destination", destination);


    /* =====================================================
       SUMMARY BAR
       ===================================================== */

    let transport = service;

    if (
        String(service)
            .toLowerCase()
            .includes("air")
    ) {
        transport = "AIR";
    } else if (
        String(service)
            .toLowerCase()
            .includes("ocean")
    ) {
        transport = "OCEAN";
    } else if (
        String(service)
            .toLowerCase()
            .includes("road")
    ) {
        transport = "ROAD";
    } else if (
        String(service)
            .toLowerCase()
            .includes("express")
    ) {
        transport = "EXPRESS";
    }


    setText(
        "summaryService",
        service
    );

    setText(
        "summaryTransport",
        transport
    );


    /* =====================================================
       CHARGES
       ===================================================== */

    const shippingCost =
        Number(
            getValue(
                shipment,
                ["shippingCost"],
                0
            )
        ) || 0;


    const tax =
        Number(
            getValue(
                shipment,
                ["tax"],
                0
            )
        ) || 0;


    const discount =
        Number(
            getValue(
                shipment,
                ["discount"],
                0
            )
        ) || 0;


    let totalAmount =
        Number(
            getValue(
                shipment,
                ["totalAmount"],
                0
            )
        ) || 0;


    if (totalAmount === 0) {

        totalAmount =
            shippingCost +
            tax -
            discount;

    }


    setText(
        "shippingCost",
        money(shippingCost)
    );

    setText(
        "tax",
        money(tax)
    );

    setText(
        "discount",
        money(discount)
    );

    setText(
        "totalAmount",
        money(totalAmount)
    );


    setText(
        "paymentStatusBottom",
        paymentStatus
    );


    setText(
        "summaryShipping",
        money(shippingCost)
    );

    setText(
        "summaryPackage",
        packageType || packageName
    );

    setText(
        "summaryWeight",
        weight
    );

    setText(
        "summaryRoute",
        origin + " → " + destination
    );

    setText(
        "summaryPayment",
        paymentStatus
    );

    setText(
        "summaryVerify",
        verificationCode
    );


    /* =====================================================
       PAYMENT COLORS
       ===================================================== */

    const paymentElements = [
        document.getElementById("paymentStatus"),
        document.getElementById("paymentStatusBottom"),
        document.getElementById("summaryPayment")
    ];

    paymentElements.forEach(function (element) {

        if (!element) {
            return;
        }

        const value =
            element.textContent
                .toLowerCase();

        if (
            value.includes("paid") ||
            value.includes("completed")
        ) {
            element.style.color =
                "#16803c";
        }

    });


    /* =====================================================
       VERIFICATION
       ===================================================== */

    setText(
        "verificationStatus",
        "VERIFIED & APPROVED"
    );

    setText(
        "verificationReceiptNumber",
        receiptNumber
    );

    setText(
        "verificationTrackingNumber",
        tracking
    );

    setText(
        "verificationDocumentNo",
        documentNo
    );

    setText(
        "verificationCodeDisplay",
        verificationCode
    );


    /* =====================================================
       FOOTER
       ===================================================== */

    setText(
        "footerDocumentNo",
        documentNo
    );

    setText(
        "footerIssueDate",
        formattedDate
    );

    setText(
        "receiptNumberBottom",
        receiptNumber
    );

    setText(
        "trackingNumberBottom",
        tracking
    );


    /* =====================================================
       BARCODE
       ===================================================== */

    if (
        typeof JsBarcode !== "undefined"
    ) {

        try {

            JsBarcode(
                "#barcodeLarge",
                tracking,
                {
                    format: "CODE128",
                    width: 1.4,
                    height: 55,
                    displayValue: true,
                    fontSize: 10,
                    margin: 2
                }
            );

        } catch (error) {

            console.error(
                "Barcode error:",
                error
            );

        }

    }


    /* =====================================================
       QR CODE
       ===================================================== */

    const qrElement =
        document.getElementById("qrcode");


    if (
        qrElement &&
        typeof QRCode !== "undefined"
    ) {

        qrElement.innerHTML = "";

        try {

            const trackingURL =
                "https://mildredmwandizi34-cell.github.io/Hello-world-/track.html?tracking=" +
                encodeURIComponent(tracking);


            new QRCode(
                qrElement,
                {
                    text: trackingURL,
                    width: 100,
                    height: 100,
                    correctLevel:
                        QRCode.CorrectLevel.M
                }
            );

        } catch (error) {

            console.error(
                "QR code error:",
                error
            );

        }

    }


    /* =====================================================
       MAP
       ===================================================== */

    initializeMap(
        origin,
        destination,
        currentLocation
    );


    /* =====================================================
       MAP FUNCTION
       ===================================================== */

    function initializeMap(
        originText,
        destinationText,
        currentText
    ) {

        const mapElement =
            document.getElementById(
                "receiptMap"
            );

        if (
            !mapElement ||
            typeof L === "undefined"
        ) {
            return;
        }


        const locations = {

            "kenya": [-1.286389, 36.817223],

            "nairobi": [-1.286389, 36.817223],

            "usa": [39.8283, -98.5795],

            "united states": [39.8283, -98.5795],

            "new york": [40.7128, -74.0060],

            "uk": [55.3781, -3.4360],

            "united kingdom": [55.3781, -3.4360],

            "london": [51.5074, -0.1278],

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


        function findCoordinates(text) {

            const value =
                String(text || "")
                    .toLowerCase()
                    .trim();


            for (const key in locations) {

                if (
                    value.includes(key)
                ) {
                    return locations[key];
                }

            }


            return null;
        }


        const originCoords =
            findCoordinates(
                originText
            ) ||
            locations.kenya;


        const destinationCoords =
            findCoordinates(
                destinationText
            ) ||
            locations.uk;


        const currentCoords =
            findCoordinates(
                currentText
            ) ||
            originCoords;


        const map =
            L.map(
                mapElement,
                {
                    zoomControl: false,
                    attributionControl: false
                }
            );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 18
            }
        ).addTo(map);


        L.marker(
            originCoords
        )
        .addTo(map)
        .bindTooltip(
            "Origin",
            {
                permanent: false
            }
        );


        L.marker(
            destinationCoords
        )
        .addTo(map)
        .bindTooltip(
            "Destination",
            {
                permanent: false
            }
        );


        L.marker(
            currentCoords
        )
        .addTo(map)
        .bindTooltip(
            "Current Location",
            {
                permanent: false
            }
        );


        const routeLine =
            L.polyline(
                [
                    originCoords,
                    currentCoords,
                    destinationCoords
                ],
                {
                    weight: 3,
                    dashArray: "7 5"
                }
            )
            .addTo(map);


        try {

            map.fitBounds(
                routeLine.getBounds(),
                {
                    padding: [10, 10]
                }
            );

        } catch (error) {

            map.setView(
                originCoords,
                2
            );

        }


        setTimeout(function () {

            map.invalidateSize();

        }, 300);

    }

});
