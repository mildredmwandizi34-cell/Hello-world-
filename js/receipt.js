/* =====================================================
   American Global Logistics
   Receipt.js Pro
   Clean Receipt + Airplane Route
===================================================== */

"use strict";


/* =====================================================
   HELPER FUNCTIONS
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
   LOAD SHIPMENT FROM URL
===================================================== */

const params = new URLSearchParams(window.location.search);
const tracking = params.get("tracking");

const shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

let shipment =
    shipments.find(item =>
        item.trackingNumber === tracking ||
        item.tracking === tracking
    );


/* Fallback */

if (!shipment) {

    shipment =
        JSON.parse(
            localStorage.getItem("shipment")
        );
}


/* Shipment not found */

if (!shipment) {

    alert("Shipment not found.");

    window.location.href =
        "create-shipment.html";

    throw new Error("Shipment not found.");
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
   SAVE UPDATED SHIPMENT
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

set(
    "trackingNumber",
    shipment.trackingNumber
);

set(
    "receiptNumber",
    shipment.receiptNumber
);

set(
    "receiptNumberBottom",
    shipment.receiptNumber
);

set(
    "receiptDate",
    shipment.receiptDate
);

set(
    "receiptPaymentStatus",
    shipment.payment
);

set(
    "receiptShipmentStatus",
    shipment.status
);

set(
    "receiptServiceType",
    shipment.service
);

set(
    "receiptDelivery",
    shipment.delivery
);


/* =====================================================
   SUMMARY
===================================================== */

set(
    "summaryTracking",
    shipment.trackingNumber
);

set(
    "summaryStatus",
    shipment.status
);

set(
    "summaryLocation",
    shipment.location
);

set(
    "summaryDelivery",
    shipment.delivery
);


/* =====================================================
   OPTIONAL STATUS FIELDS
===================================================== */

set(
    "status",
    shipment.status
);

set(
    "location",
    shipment.location
);


/* =====================================================
   SENDER
===================================================== */

set(
    "senderName",
    shipment.senderName
);

set(
    "senderCompany",
    shipment.senderCompany
);

set(
    "senderAddress",
    shipment.senderAddress
);

set(
    "senderCity",
    shipment.senderCity
);

set(
    "senderCountry",
    shipment.senderCountry
);

set(
    "senderPhone",
    shipment.senderPhone
);

set(
    "senderEmail",
    shipment.senderEmail
);


/* =====================================================
   RECEIVER
===================================================== */

set(
    "receiverName",
    shipment.receiverName
);

set(
    "receiverCompany",
    shipment.receiverCompany
);

set(
    "receiverAddress",
    shipment.receiverAddress
);

set(
    "receiverCity",
    shipment.receiverCity
);

set(
    "receiverCountry",
    shipment.receiverCountry
);

set(
    "receiverPhone",
    shipment.receiverPhone
);

set(
    "receiverEmail",
    shipment.receiverEmail
);


/* =====================================================
   SHIPMENT DETAILS
===================================================== */

set(
    "referenceNumber",
    shipment.reference
);

set(
    "customerReference",
    shipment.customerReference
);

set(
    "package",
    shipment.package
);

set(
    "packageType",
    shipment.descriptionType
);

set(
    "pieces",
    shipment.pieces
);

set(
    "weight",
    shipment.weight
);

set(
    "dimensions",
    shipment.dimensions
);

set(
    "declaredValue",
    shipment.value
        ? "$" + shipment.value
        : "-"
);

set(
    "service",
    shipment.service
);

set(
    "insurance",
    shipment.insurance
);

set(
    "paymentStatus",
    shipment.payment
);


/* =====================================================
   ROUTE INFORMATION
===================================================== */

set(
    "origin",
    shipment.origin
);

set(
    "destination",
    shipment.destination
);

set(
    "delivery",
    shipment.delivery
);

set(
    "route",
    shipment.route
);

set(
    "instructions",
    shipment.instructions
);


/* =====================================================
   REFERENCES
===================================================== */

set(
    "shipmentId",
    shipment.shipmentId
);

set(
    "customerReferenceExtra",
    shipment.customerReference
);

set(
    "reference",
    shipment.reference
);

set(
    "barcodeNumber",
    shipment.barcodeNumber
);

set(
    "createdTime",
    shipment.createdTime
);

set(
    "instructionsReference",
    shipment.instructions
);

set(
    "instructionsText",
    shipment.instructions
);


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

set(
    "verificationCode",
    shipment.verificationCode
);

set(
    "verificationCodeLarge",
    shipment.verificationCode
);


/* =====================================================
   SIGNATURES
===================================================== */

set(
    "senderSignature",
    shipment.senderSignature
);

set(
    "authorizedOfficer",
    shipment.authorizedOfficer
);


/* =====================================================
   FOOTER
===================================================== */

set(
    "documentNo",
    shipment.documentNo
);

set(
    "issueDate",
    shipment.issueDate
);


console.log(
    "Receipt fields populated."
);


/* =====================================================
   PAYMENT STAMP
===================================================== */

const payment =
    (shipment.payment || "").toLowerCase();

const paymentStamp =
    $("paymentStamp");

const paymentStampLarge =
    $("paymentStampLarge");


if (paymentStamp) {

    paymentStamp.className =
        "stamp";

    switch (payment) {

        case "paid":

            paymentStamp.classList.add(
                "paid"
            );

            paymentStamp.textContent =
                "PAID";

            break;


        case "pending":

            paymentStamp.classList.add(
                "pending"
            );

            paymentStamp.textContent =
                "PENDING";

            break;


        case "received":

            paymentStamp.classList.add(
                "received"
            );

            paymentStamp.textContent =
                "RECEIVED";

            break;


        default:

            paymentStamp.classList.add(
                "unpaid"
            );

            paymentStamp.textContent =
                "UNPAID";
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
        trackingURL,
        {
            width: 140
        },
        function(err, canvas) {

            if (!err) {

                const qr =
                    $("qrcode");

                qr.innerHTML = "";

                qr.appendChild(canvas);
            }
        }
    );
}


/* =====================================================
   TIMELINE
   Optional — harmless if timeline is removed
===================================================== */

function complete(id) {

    const step = $(id);

    if (step) {

        step.classList.add(
            "complete"
        );
    }
}


switch (
    (shipment.status || "").toLowerCase()
) {

    case "shipment created":

        complete("stepCreated");

        break;


    case "picked up":

        complete("stepCreated");
        complete("stepPicked");

        break;


    case "in transit":

        complete("stepCreated");
        complete("stepPicked");
        complete("stepTransit");

        break;


    case "delivered":

        complete("stepCreated");
        complete("stepPicked");
        complete("stepTransit");
        complete("stepDelivered");

        break;
}


/* =====================================================
   SHIPPING ROUTE MAP
   SINGLE MAP INITIALIZATION
===================================================== */

if (
    typeof L !== "undefined" &&
    $("receiptMap")
) {

    const map =
        L.map(
            "receiptMap",
            {
                zoomControl: false,
                attributionControl: false
            }
        );


    /* ================================================
       Coordinates
    ================================================= */

    const originLat =
        Number(shipment.originLat);

    const originLng =
        Number(shipment.originLng);

    const destinationLat =
        Number(shipment.destinationLat);

    const destinationLng =
        Number(shipment.destinationLng);


    const validCoordinates =
        Number.isFinite(originLat) &&
        Number.isFinite(originLng) &&
        Number.isFinite(destinationLat) &&
        Number.isFinite(destinationLng);


    /* ================================================
       Map Background
       No attribution displayed
    ================================================= */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution: ""
        }
    ).addTo(map);


    /* ================================================
       ROUTE WITH AIRPLANE
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


        /* ============================================
           Origin Marker
        ============================================ */

        const originMarker =
            L.circleMarker(
                origin,
                {
                    radius: 6,
                    color: "#083b80",
                    fillColor: "#0b4ea2",
                    fillOpacity: 1,
                    weight: 2
                }
            )
            .addTo(map)
            .bindPopup(
                "<b>Origin</b><br>" +
                (shipment.origin || "")
            );


        /* ============================================
           Destination Marker
        ============================================ */

        const destinationMarker =
            L.circleMarker(
                destination,
                {
                    radius: 6,
                    color: "#b45309",
                    fillColor: "#ff9800",
                    fillOpacity: 1,
                    weight: 2
                }
            )
            .addTo(map)
            .bindPopup(
                "<b>Destination</b><br>" +
                (shipment.destination || "")
            );


        /* ============================================
           BLUE SHIPPING ROUTE LINE
        ============================================ */

        const route =
            L.polyline(
                [
                    origin,
                    destination
                ],
                {
                    color: "#0b4ea2",
                    weight: 4,
                    opacity: 0.9,
                    dashArray: "8,6"
                }
            )
            .addTo(map);


        /* ============================================
           AIRPLANE ICON
        ============================================ */

        const airplaneIcon =
            L.divIcon({

                className:
                    "agl-airplane-icon",

                html:
                    '<div class="agl-airplane">✈</div>',

                iconSize: [
                    30,
                    30
                ],

                iconAnchor: [
                    15,
                    15
                ]
            });


        /* ============================================
           PLACE AIRPLANE AT MIDDLE OF ROUTE
        ============================================ */

        const midLat =
            (originLat +
                destinationLat) / 2;

        const midLng =
            (originLng +
                destinationLng) / 2;


        L.marker(
            [
                midLat,
                midLng
            ],
            {
                icon:
                    airplaneIcon,
                interactive: false
            }
        ).addTo(map);


        /* ============================================
           FIT ROUTE TO MAP
        ============================================ */

        map.fitBounds(
            route.getBounds(),
            {
                padding: [
                    25,
                    25
                ]
            }
        );

    } else {

        /* ============================================
           No Coordinates
        ============================================ */

        map.setView(
            [20, 0],
            2
        );
    }


    /* ================================================
       Fix Leaflet Rendering
    ================================================= */

    setTimeout(
        () => {

            map.invalidateSize();

        },
        300
    );
}


console.log(
    "Receipt loaded successfully."
);
