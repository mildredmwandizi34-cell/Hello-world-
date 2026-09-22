/* =========================================
   AMERICAN GLOBAL LOGISTICS
   RECEIPT.JS — CLEAN REPLACEMENT
   ========================================= */

"use strict";

/* =========================================
   BASIC HELPERS
   ========================================= */

function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;

    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";
}

function getValue(primary, fallback) {
    if (
        primary !== undefined &&
        primary !== null &&
        primary !== ""
    ) {
        return primary;
    }

    return fallback;
}

/* =========================================
   LOAD SHIPMENT
   ========================================= */

const params = new URLSearchParams(window.location.search);
const trackingFromURL = params.get("tracking");

let shipments = [];

try {
    shipments = JSON.parse(
        localStorage.getItem("shipments") || "[]"
    );
} catch (error) {
    shipments = [];
}

let shipment = null;

/* Find shipment from URL first */
if (trackingFromURL) {
    shipment = shipments.find(function (item) {
        return (
            item.trackingNumber === trackingFromURL ||
            item.tracking === trackingFromURL
        );
    });
}

/* Fallback to most recently saved shipment */
if (!shipment) {
    try {
        shipment = JSON.parse(
            localStorage.getItem("shipment") || "null"
        );
    } catch (error) {
        shipment = null;
    }
}

/* Stop if shipment cannot be found */
if (!shipment) {
    alert("Shipment not found.");
    window.location.href = "create-shipment.html";
    throw new Error("Shipment not found.");
}

/* =========================================
   CREATE MISSING DOCUMENT VALUES
   ========================================= */

shipment.trackingNumber =
    shipment.trackingNumber ||
    shipment.tracking ||
    "-";

shipment.receiptNumber =
    shipment.receiptNumber ||
    "RCP-" + Date.now();

shipment.receiptDate =
    shipment.receiptDate ||
    new Date().toLocaleDateString();

shipment.issueDate =
    shipment.issueDate ||
    shipment.receiptDate;

shipment.documentNo =
    shipment.documentNo ||
    "DOC-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );

shipment.verificationCode =
    shipment.verificationCode ||
    Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

/* =========================================
   SAVE UPDATED SHIPMENT
   ========================================= */

localStorage.setItem(
    "shipment",
    JSON.stringify(shipment)
);

const shipmentIndex = shipments.findIndex(
    function (item) {
        return (
            item.trackingNumber ===
                shipment.trackingNumber ||
            item.tracking ===
                shipment.trackingNumber
        );
    }
);

if (shipmentIndex >= 0) {
    shipments[shipmentIndex] = shipment;

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );
}

/* =========================================
   PAYMENT STATUS
   ========================================= */

const paymentStatus = getValue(
    shipment.paymentStatus,
    shipment.payment
);

/* =========================================
   HEADER INFORMATION
   ========================================= */

setText(
    "receiptNumber",
    shipment.receiptNumber
);

setText(
    "receiptDate",
    shipment.receiptDate
);

setText(
    "documentNo",
    shipment.documentNo
);

setText(
    "trackingNumber",
    shipment.trackingNumber
);

setText(
    "receiptDelivery",
    shipment.delivery
);

setText(
    "receiptPaymentStatus",
    paymentStatus
);

setText(
    "verificationCode",
    shipment.verificationCode
);

/* =========================================
   FOOTER
   ========================================= */

setText(
    "footerDocumentNo",
    shipment.documentNo
);

setText(
    "footerIssueDate",
    shipment.issueDate
);

setText(
    "receiptNumberBottom",
    shipment.receiptNumber
);

setText(
    "trackingNumberBottom",
    shipment.trackingNumber
);

setText(
    "verificationCodeBottom",
    shipment.verificationCode
);

/* =========================================
   SENDER
   ========================================= */

setText(
    "senderName",
    shipment.senderName
);

setText(
    "senderCompany",
    shipment.senderCompany
);

setText(
    "senderAddress",
    shipment.senderAddress
);

setText(
    "senderCity",
    shipment.senderCity
);

setText(
    "senderCountry",
    shipment.senderCountry
);

setText(
    "senderPhone",
    shipment.senderPhone
);

setText(
    "senderEmail",
    shipment.senderEmail
);

/* =========================================
   RECEIVER
   ========================================= */

setText(
    "receiverName",
    shipment.receiverName
);

setText(
    "receiverCompany",
    shipment.receiverCompany
);

setText(
    "receiverAddress",
    shipment.receiverAddress
);

setText(
    "receiverCity",
    shipment.receiverCity
);

setText(
    "receiverCountry",
    shipment.receiverCountry
);

setText(
    "receiverPhone",
    shipment.receiverPhone
);

setText(
    "receiverEmail",
    shipment.receiverEmail
);

/* =========================================
   SHIPMENT DETAILS
   ========================================= */

setText(
    "referenceNumber",
    getValue(
        shipment.referenceNumber,
        shipment.reference
    )
);

setText(
    "customerReference",
    shipment.customerReference
);

setText(
    "package",
    shipment.package
);

setText(
    "packageType",
    getValue(
        shipment.packageType,
        shipment.descriptionType
    )
);

setText(
    "pieces",
    shipment.pieces
);

setText(
    "weight",
    shipment.weight
);

setText(
    "dimensions",
    shipment.dimensions
);

/* =========================================
   DECLARED VALUE
   ========================================= */

let declaredValue = getValue(
    shipment.declaredValue,
    shipment.value
);

if (
    declaredValue !== undefined &&
    declaredValue !== null &&
    declaredValue !== ""
) {
    setText(
        "declaredValue",
        "$" + declaredValue
    );
} else {
    setText(
        "declaredValue",
        "-"
    );
}

/* =========================================
   SERVICE INFORMATION
   ========================================= */

setText(
    "service",
    shipment.service
);

setText(
    "insurance",
    shipment.insurance
);

setText(
    "paymentStatus",
    paymentStatus
);

setText(
    "delivery",
    shipment.delivery
);

setText(
    "instructions",
    shipment.instructions
);

/* =========================================
   SERVICE ICON
   ========================================= */

const service =
    String(shipment.service || "")
        .trim()
        .toLowerCase();

let serviceIcon = "✈";

if (service.includes("ocean")) {
    serviceIcon = "🚢";
} else if (service.includes("road")) {
    serviceIcon = "🚚";
} else if (service.includes("express")) {
    serviceIcon = "⚡";
} else if (service.includes("air")) {
    serviceIcon = "✈";
}

setText(
    "serviceIcon",
    serviceIcon
);

setText(
    "serviceText",
    shipment.service
);

/* =========================================
   SHIPPING ROUTE
   ========================================= */

setText(
    "origin",
    shipment.origin
);

setText(
    "currentLocation",
    getValue(
        shipment.location,
        getValue(
            shipment.currentLocation,
            shipment.origin
        )
    )
);

setText(
    "destination",
    shipment.destination
);

/* =========================================
   MONEY
   ========================================= */

function formatMoney(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "-";
    }

    return "$" + value;
}

let shippingCost = shipment.shippingCost;
let tax = shipment.tax;
let discount = shipment.discount;
let totalAmount = shipment.totalAmount;

/* Calculate total if it wasn't supplied */
if (
    totalAmount === undefined ||
    totalAmount === null ||
    totalAmount === ""
) {
    const shippingNumber =
        parseFloat(shippingCost) || 0;

    const taxNumber =
        parseFloat(tax) || 0;

    const discountNumber =
        parseFloat(discount) || 0;

    totalAmount =
        shippingNumber +
        taxNumber -
        discountNumber;
}

setText(
    "shippingCost",
    formatMoney(shippingCost)
);

setText(
    "tax",
    formatMoney(tax)
);

setText(
    "discount",
    formatMoney(discount)
);

setText(
    "totalAmount",
    formatMoney(totalAmount)
);

/*
   Your current HTML uses paymentStatusBottom
   for the TOTAL AMOUNT area.
   Support that existing ID too.
*/
setText(
    "paymentStatusBottom",
    formatMoney(totalAmount)
);

/* =========================================
   PAYMENT GREEN STATUS
   ========================================= */

function applyPaymentStyle() {
    const ids = [
        "receiptPaymentStatus",
        "paymentStatus"
    ];

    ids.forEach(function (id) {
        const element =
            document.getElementById(id);

        if (!element) return;

        const value =
            String(paymentStatus || "")
                .trim()
                .toLowerCase();

        const isPaid =
            value.includes("paid") ||
            value.includes("completed");

        element.classList.toggle(
            "payment-paid",
            isPaid
        );
    });
}

applyPaymentStyle();

/* =========================================
   DIGITAL VERIFICATION
   ========================================= */

setText(
    "verificationReceiptNumber",
    shipment.receiptNumber
);

setText(
    "verificationTrackingNumber",
    shipment.trackingNumber
);

setText(
    "verificationDocumentNo",
    shipment.documentNo
);

setText(
    "verificationCodeDisplay",
    shipment.verificationCode
);

setText(
    "verificationStatus",
    "VERIFIED & APPROVED"
);

setText(
    "verificationIssuer",
    "AMERICAN GLOBAL LOGISTICS"
);

setText(
    "authorizedStatus",
    "AUTHORIZED"
);

setText(
    "verificationType",
    "AGL DIGITAL VERIFICATION SYSTEM"
);

/* =========================================
   BARCODE
   ========================================= */

if (
    typeof JsBarcode !== "undefined" &&
    document.getElementById("barcodeLarge")
) {
    try {
        JsBarcode(
            "#barcodeLarge",
            shipment.trackingNumber,
            {
                format: "CODE128",
                width: 2,
                height: 48,
                displayValue: true,
                fontSize: 11,
                margin: 4
            }
        );
    } catch (error) {
        console.error(
            "Barcode generation failed:",
            error
        );
    }
}

/* =========================================
   QR CODE
   ========================================= */

const qrContainer =
    document.getElementById("qrcode");

if (
    qrContainer &&
    typeof QRCode !== "undefined"
) {
    qrContainer.innerHTML = "";

    const trackingURL =
        "https://mildredmwandizi34-cell.github.io/Hello-world-/track.html?tracking=" +
        encodeURIComponent(
            shipment.trackingNumber
        );

    try {
        new QRCode(
            qrContainer,
            {
                text: trackingURL,
                width: 90,
                height: 90,
                correctLevel:
                    QRCode.CorrectLevel.M
            }
        );
    } catch (error) {
        console.error(
            "QR code generation failed:",
            error
        );
    }
}

/* =========================================
   SHIPPING ROUTE MAP
   ========================================= */

const mapContainer =
    document.getElementById("receiptMap");

if (
    mapContainer &&
    typeof L !== "undefined"
) {
    const map = L.map(
        "receiptMap",
        {
            zoomControl: false,
            attributionControl: false
        }
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution: ""
        }
    ).addTo(map);

    /* =====================================
       LOCATION DATABASE
       ===================================== */

    const coordinates = {

        "nairobi": [
            -1.2864,
            36.8172
        ],

        "kenya": [
            -0.0236,
            37.9062
        ],

        "london": [
            51.5074,
            -0.1278
        ],

        "united kingdom": [
            55.3781,
            -3.4360
        ],

        "uk": [
            55.3781,
            -3.4360
        ],

        "new york": [
            40.7128,
            -74.0060
        ],

        "united states": [
            39.8283,
            -98.5795
        ],

        "usa": [
            39.8283,
            -98.5795
        ],

        "los angeles": [
            34.0522,
            -118.2437
        ],

        "dubai": [
            25.2048,
            55.2708
        ],

        "uae": [
            23.4241,
            53.8478
        ],

        "costa rica": [
            9.7489,
            -83.7534
        ],

        "guatemala": [
            15.7835,
            -90.2308
        ],

        "canada": [
            56.1304,
            -106.3468
        ],

        "germany": [
            51.1657,
            10.4515
        ],

        "france": [
            46.2276,
            2.2137
        ],

        "italy": [
            41.8719,
            12.5674
        ],

        "spain": [
            40.4637,
            -3.7492
        ],

        "china": [
            35.8617,
            104.1954
        ],

        "japan": [
            36.2048,
            138.2529
        ],

        "australia": [
            -25.2744,
            133.7751
        ],

        "india": [
            20.5937,
            78.9629
        ],

        "south africa": [
            -30.5595,
            22.9375
        ],

        "scotland": [
            56.4907,
            -4.2026
        ]
    };

    /* =====================================
       FIND LOCATION
       ===================================== */

    function findLocation(value) {

        if (!value) {
            return null;
        }

        const key =
            String(value)
                .trim()
                .toLowerCase();

        if (coordinates[key]) {
            return coordinates[key];
        }

        for (
            const name in coordinates
        ) {
            if (
                key.includes(name) ||
                name.includes(key)
            ) {
                return coordinates[name];
            }
        }

        return null;
    }

    const origin =
        findLocation(
            shipment.origin
        );

    const destination =
        findLocation(
            shipment.destination
        );

    /* =====================================
       DRAW ROUTE
       ===================================== */

    if (
        origin &&
        destination
    ) {

        const routePoints = [
            origin,
            destination
        ];

        /* ORIGIN MARKER */

        L.circleMarker(
            origin,
            {
                radius: 7,
                color: "#ffffff",
                weight: 3,
                fillColor: "#0b4ea2",
                fillOpacity: 1
            }
        )
        .addTo(map)
        .bindTooltip(
            "ORIGIN: " +
                shipment.origin,
            {
                permanent: true,
                direction: "top",
                offset: [
                    0,
                    -8
                ]
            }
        );

        /* DESTINATION MARKER */

        L.circleMarker(
            destination,
            {
                radius: 7,
                color: "#ffffff",
                weight: 3,
                fillColor: "#ff9800",
                fillOpacity: 1
            }
        )
        .addTo(map)
        .bindTooltip(
            "DESTINATION: " +
                shipment.destination,
            {
                permanent: true,
                direction: "top",
                offset: [
                    0,
                    -8
                ]
            }
        );

        /* ROUTE LINE */

        L.polyline(
            routePoints,
            {
                color: "#0b4ea2",
                weight: 3,
                opacity: 0.9,
                dashArray: "6, 8",
                lineCap: "round"
            }
        ).addTo(map);

        /* =================================
           AIRPLANE POSITION
           ================================= */

        const midpoint = [
            (
                origin[0] +
                destination[0]
            ) / 2,

            (
                origin[1] +
                destination[1]
            ) / 2
        ];

        const airplane =
            L.divIcon({
                className:
                    "agl-airplane-icon",

                html:
                    '<div class="agl-airplane">✈</div>',

                iconSize: [
                    36,
                    36
                ],

                iconAnchor: [
                    18,
                    18
                ]
            });

        L.marker(
            midpoint,
            {
                icon: airplane,
                interactive: false,
                zIndexOffset: 1000
            }
        ).addTo(map);

        /* =================================
           FIT MAP TO ROUTE
           ================================= */

        map.fitBounds(
            routePoints,
            {
                padding: [
                    25,
                    25
                ]
            }
        );

        /* Fix Leaflet sizing after layout */
        setTimeout(
            function () {
                map.invalidateSize();
            },
            300
        );

    } else {

        map.setView(
            [0, 20],
            2
        );
    }
}

/* =========================================
   FINAL CONSOLE MESSAGE
   ========================================= */

console.log(
    "AGL Receipt loaded successfully:",
    shipment.trackingNumber
);
