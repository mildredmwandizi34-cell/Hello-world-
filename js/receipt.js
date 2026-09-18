/* =====================================================
   AMERICAN GLOBAL LOGISTICS
   Receipt.js
   Clean Stable Version
===================================================== */

"use strict";


/* =====================================================
   HELPERS
===================================================== */

function $(id) {
    return document.getElementById(id);
}

function set(id, value) {

    const el = $(id);

    if (!el) return;

    el.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";
}


/* =====================================================
   LOAD SHIPMENT
===================================================== */

const params =
    new URLSearchParams(window.location.search);

const tracking =
    params.get("tracking");

const shipments =
    JSON.parse(
        localStorage.getItem("shipments")
    ) || [];

let shipment =
    shipments.find(item =>
        item.trackingNumber === tracking ||
        item.tracking === tracking
    );


/* FALLBACK */

if (!shipment) {

    shipment =
        JSON.parse(
            localStorage.getItem("shipment")
        );
}


/* NO SHIPMENT */

if (!shipment) {

    alert("Shipment not found.");

    window.location.href =
        "create-shipment.html";

    throw new Error(
        "Shipment not found."
    );
}


/* =====================================================
   AUTOMATIC VALUES
===================================================== */

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

shipment.shipmentId =
    shipment.shipmentId ||
    "SHP-" + Date.now();

shipment.createdTime =
    shipment.createdTime ||
    new Date().toLocaleString();

shipment.barcodeNumber =
    shipment.barcodeNumber ||
    shipment.trackingNumber;

shipment.verificationCode =
    shipment.verificationCode ||
    Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();


/* =====================================================
   SAVE SHIPMENT
===================================================== */

localStorage.setItem(
    "shipment",
    JSON.stringify(shipment)
);

const index =
    shipments.findIndex(item =>
        item.trackingNumber ===
            shipment.trackingNumber ||
        item.tracking ===
            shipment.trackingNumber
    );

if (index >= 0) {

    shipments[index] = shipment;

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );
}


/* =====================================================
   HEADER
===================================================== */

set("trackingNumber", shipment.trackingNumber);
set("receiptNumber", shipment.receiptNumber);
set("receiptNumberBottom", shipment.receiptNumber);
set("receiptDate", shipment.receiptDate);
set("receiptPaymentStatus", shipment.payment);
set("receiptShipmentStatus", shipment.status);
set("receiptServiceType", shipment.service);
set("receiptDelivery", shipment.delivery);


/* =====================================================
   SUMMARY
===================================================== */

set("summaryTracking", shipment.trackingNumber);
set("summaryStatus", shipment.status);
set("summaryLocation", shipment.location);
set("summaryDelivery", shipment.delivery);


/* =====================================================
   SENDER
===================================================== */

set("senderName", shipment.senderName);
set("senderCompany", shipment.senderCompany);
set("senderAddress", shipment.senderAddress);
set("senderCity", shipment.senderCity);
set("senderCountry", shipment.senderCountry);
set("senderPhone", shipment.senderPhone);
set("senderEmail", shipment.senderEmail);


/* =====================================================
   RECEIVER
===================================================== */

set("receiverName", shipment.receiverName);
set("receiverCompany", shipment.receiverCompany);
set("receiverAddress", shipment.receiverAddress);
set("receiverCity", shipment.receiverCity);
set("receiverCountry", shipment.receiverCountry);
set("receiverPhone", shipment.receiverPhone);
set("receiverEmail", shipment.receiverEmail);


/* =====================================================
   SHIPMENT DETAILS
===================================================== */

set("referenceNumber", shipment.reference);
set("customerReference", shipment.customerReference);
set("package", shipment.package);
set("packageType", shipment.descriptionType);
set("pieces", shipment.pieces);
set("weight", shipment.weight);
set("dimensions", shipment.dimensions);

set(
    "declaredValue",
    shipment.value
        ? "$" + shipment.value
        : "-"
);

set("service", shipment.service);
set("insurance", shipment.insurance);
set("paymentStatus", shipment.payment);


/* =====================================================
   ROUTE
===================================================== */

set("origin", shipment.origin);
set("destination", shipment.destination);
set("delivery", shipment.delivery);
set("route", shipment.route);
set("instructions", shipment.instructions);


/* =====================================================
   REFERENCES
===================================================== */

set("shipmentId", shipment.shipmentId);
set("customerReferenceExtra", shipment.customerReference);
set("reference", shipment.reference);
set("barcodeNumber", shipment.barcodeNumber);
set("createdTime", shipment.createdTime);
set("instructionsReference", shipment.instructions);
set("instructionsText", shipment.instructions);


/* =====================================================
   CHARGES
===================================================== */

set(
    "shippingCost",
    shipment.shippingCost
        ? "$" + shipment.shippingCost
        : "-"
);

set(
    "tax",
    shipment.tax
        ? "$" + shipment.tax
        : "-"
);

set(
    "discount",
    shipment.discount
        ? "$" + shipment.discount
        : "-"
);

set(
    "totalAmount",
    shipment.totalAmount
        ? "$" + shipment.totalAmount
        : "-"
);


/* =====================================================
   VERIFICATION
===================================================== */

set("verificationCode", shipment.verificationCode);
set("verificationCodeLarge", shipment.verificationCode);


/* =====================================================
   SIGNATURES
===================================================== */

set("senderSignature", shipment.senderSignature);
set("authorizedOfficer", shipment.authorizedOfficer);


/* =====================================================
   FOOTER
===================================================== */

set("documentNo", shipment.documentNo);
set("documentNoFooter", shipment.documentNo);
set("issueDate", shipment.issueDate);


/* =====================================================
   PAYMENT STAMP
===================================================== */

const payment =
    (shipment.payment || "")
        .toLowerCase();

const paymentStamp =
    $("paymentStamp");

const paymentStampLarge =
    $("paymentStampLarge");

if (paymentStamp) {

    paymentStamp.className = "stamp";

    if (payment === "paid") {

        paymentStamp.classList.add("paid");
        paymentStamp.textContent = "PAID";

    } else if (payment === "pending") {

        paymentStamp.classList.add("pending");
        paymentStamp.textContent = "PENDING";

    } else if (payment === "received") {

        paymentStamp.classList.add("received");
        paymentStamp.textContent = "RECEIVED";

    } else {

        paymentStamp.classList.add("unpaid");
        paymentStamp.textContent = "UNPAID";
    }

    if (paymentStampLarge) {

        paymentStampLarge.className =
            paymentStamp.className;

        paymentStampLarge.textContent =
            paymentStamp.textContent;
    }
}


/* =====================================================
   BARCODE
===================================================== */

if (
    typeof JsBarcode !== "undefined"
) {

    if ($("barcode")) {

        JsBarcode(
            "#barcode",
            shipment.trackingNumber,
            {
                format: "CODE128",
                width: 2,
                height: 60,
                displayValue: true
            }
        );
    }

    if ($("barcodeLarge")) {

        JsBarcode(
            "#barcodeLarge",
            shipment.trackingNumber,
            {
                format: "CODE128",
                width: 2,
                height: 60,
                displayValue: true
            }
        );
    }
}


/* =====================================================
   QR CODE
===================================================== */

if (
    typeof QRCode !== "undefined" &&
    $("qrcode")
) {

    const trackingURL =
        "https://www.americangloballogistics.com/track.html?tracking=" +
        encodeURIComponent(
            shipment.trackingNumber
        );

    QRCode.toCanvas(
        $("qrcode"),
        trackingURL,
        {
            width: 100,
            margin: 1,
            errorCorrectionLevel: "M"
        },
        function(error) {

            if (error) {

                console.error(
                    "QR Code Error:",
                    error
                );

            } else {

                console.log(
                    "QR code generated successfully."
                );
            }
        }
    );
}


  /* =====================================================
   SHIPPING ROUTE MAP
   CLEAR ORIGIN → DESTINATION VERSION
===================================================== */

if (
    typeof L !== "undefined" &&
    $("receiptMap")
) {

    const map = L.map(
        "receiptMap",
        {
            zoomControl: false,
            attributionControl: false
        }
    );


    /* =================================================
       MAP TILES
    ================================================= */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution: ""
        }
    ).addTo(map);


    /* =================================================
       COUNTRY / LOCATION FALLBACK COORDINATES
    ================================================= */

    const locationCoordinates = {

        "scotland": [
            56.4907,
            -4.2026
        ],

        "costarica": [
            9.7489,
            -83.7534
        ],

        "costa rica": [
            9.7489,
            -83.7534
        ],

        "kenya": [
            -0.0236,
            37.9062
        ],

        "united states": [
            39.8283,
            -98.5795
        ],

        "usa": [
            39.8283,
            -98.5795
        ],

        "united kingdom": [
            55.3781,
            -3.4360
        ],

        "uk": [
            55.3781,
            -3.4360
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
        ]
    };


    /* =================================================
       READ SAVED COORDINATES
    ================================================= */

    let originLat =
        Number(shipment.originLat);

    let originLng =
        Number(shipment.originLng);

    let destinationLat =
        Number(shipment.destinationLat);

    let destinationLng =
        Number(shipment.destinationLng);


    /* =================================================
       FALLBACK FUNCTION
    ================================================= */

    function findCoordinates(value) {

        if (!value) return null;

        const key =
            String(value)
                .trim()
                .toLowerCase()
                .replace(/,/g, "")
                .replace(/\s+/g, " ");

        return locationCoordinates[key] || null;
    }


    /* =================================================
       USE LOCATION NAME IF COORDINATES ARE MISSING
    ================================================= */

    if (
        !Number.isFinite(originLat) ||
        !Number.isFinite(originLng)
    ) {

        const fallbackOrigin =
            findCoordinates(
                shipment.origin
            );

        if (fallbackOrigin) {

            originLat =
                fallbackOrigin[0];

            originLng =
                fallbackOrigin[1];
        }
    }


    if (
        !Number.isFinite(destinationLat) ||
        !Number.isFinite(destinationLng)
    ) {

        const fallbackDestination =
            findCoordinates(
                shipment.destination
            );

        if (fallbackDestination) {

            destinationLat =
                fallbackDestination[0];

            destinationLng =
                fallbackDestination[1];
        }
    }


    /* =================================================
       CHECK COORDINATES
    ================================================= */

    const validCoordinates =
        Number.isFinite(originLat) &&
        Number.isFinite(originLng) &&
        Number.isFinite(destinationLat) &&
        Number.isFinite(destinationLng);


    /* =================================================
       ROUTE AVAILABLE
    ================================================= */

    if (validCoordinates) {

        const origin = [
            originLat,
            originLng
        ];

        const destination = [
            destinationLat,
            destinationLng
        ];


        /* =================================================
           ORIGIN MARKER
        ================================================= */

        const originMarker =
            L.circleMarker(
                origin,
                {
                    radius: 7,

                    color: "#ffffff",

                    fillColor: "#0b4ea2",

                    fillOpacity: 1,

                    weight: 3
                }
            ).addTo(map);


        originMarker.bindTooltip(
            "ORIGIN: " +
            (shipment.origin || "Origin"),
            {
                permanent: true,

                direction: "top",

                offset: [
                    0,
                    -8
                ],

                className:
                    "agl-route-label"
            }
        );


        /* =================================================
           DESTINATION MARKER
        ================================================= */

        const destinationMarker =
            L.circleMarker(
                destination,
                {
                    radius: 7,

                    color: "#ffffff",

                    fillColor: "#ff9800",

                    fillOpacity: 1,

                    weight: 3
                }
            ).addTo(map);


        destinationMarker.bindTooltip(
            "DESTINATION: " +
            (shipment.destination || "Destination"),
            {
                permanent: true,

                direction: "top",

                offset: [
                    0,
                    -8
                ],

                className:
                    "agl-route-label"
            }
        );


        /* =================================================
           ROUTE LINE
        ================================================= */

        const route =
            L.polyline(
                [
                    origin,
                    destination
                ],
                {
                    color: "#0b4ea2",

                    weight: 4,

                    opacity: 1,

                    dashArray: null
                }
            ).addTo(map);


        /* =================================================
           ROUTE DIRECTION ARROW
        ================================================= */

        const middleLat =
            (
                originLat +
                destinationLat
            ) / 2;

        const middleLng =
            (
                originLng +
                destinationLng
            ) / 2;


        const directionIcon =
            L.divIcon(
                {
                    className:
                        "agl-route-direction",

                    html:
                        '<div class="agl-route-arrow">➜</div>',

                    iconSize: [
                        30,
                        30
                    ],

                    iconAnchor: [
                        15,
                        15
                    ]
                }
            );


        L.marker(
            [
                middleLat,
                middleLng
            ],
            {
                icon:
                    directionIcon,

                interactive:
                    false,

                zIndexOffset:
                    500
            }
        ).addTo(map);


        /* =================================================
           AIRPLANE
        ================================================= */

        const airplaneIcon =
            L.divIcon(
                {
                    className:
                        "agl-airplane-icon",

                    html:
                        '<div class="agl-airplane">✈</div>',

                    iconSize: [
                        38,
                        38
                    ],

                    iconAnchor: [
                        19,
                        19
                    ]
                }
            );


        const airplane =
            L.marker(
                origin,
                {
                    icon:
                        airplaneIcon,

                    interactive:
                        false,

                    zIndexOffset:
                        1000
                }
            ).addTo(map);


        /* =================================================
           AIRPLANE ANIMATION
        ================================================= */

        let progress = 0;


        function animatePlane() {

            progress += 0.0025;


            if (progress >= 1) {

                progress = 0;
            }


            const lat =
                originLat +
                (
                    destinationLat -
                    originLat
                ) * progress;


            const lng =
                originLng +
                (
                    destinationLng -
                    originLng
                ) * progress;


            airplane.setLatLng(
                [
                    lat,
                    lng
                ]
            );


            requestAnimationFrame(
                animatePlane
            );
        }


        animatePlane();


        /* =================================================
           FIT ROUTE INTO MAP
        ================================================= */

        const routeBounds =
            L.latLngBounds(
                [
                    origin,
                    destination
                ]
            );


        map.fitBounds(
            routeBounds,
            {
                paddingTopLeft: [
                    25,
                    20
                ],

                paddingBottomRight: [
                    25,
                    20
                ],

                maxZoom: 4
            }
        );


    } else {

        /* =================================================
           NO LOCATION DATA
        ================================================= */

        map.setView(
            [
                20,
                0
            ],
            2
        );
    }


    /* =================================================
       FIX MAP SIZE
    ================================================= */

    setTimeout(
        function() {

            map.invalidateSize();

        },
        500
    );
}       


console.log(
    "AGL Receipt loaded successfully."
);
