/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   RECEIPT SYSTEM
   SUPABASE + LOCALSTORAGE
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";


let supabaseClient = null;

try {

    if (window.supabase) {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

    }

} catch (error) {

    console.error(
        "Supabase initialization error:",
        error
    );

}


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadReceipt
);


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function clean(value) {

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {

        return "—";

    }

    return String(value).trim();

}


/* =========================================================
   GET VALUE
   Supports:
   - normal fields
   - alternate field names
   - nested sender / receiver objects
   ========================================================= */

function getValue(
    object,
    keys,
    fallback = "—"
) {

    if (!object) {
        return fallback;
    }


    for (const key of keys) {

        /*
           Direct value
        */

        if (
            object[key] !== undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {

            return object[key];

        }


        /*
           Nested object support
           Example:

           sender: {
               name: "George Lucas",
               phone: "..."
           }
        */

        const parts =
            key.split(".");


        let current =
            object;

        let exists = true;


        for (const part of parts) {

            if (
                current &&
                current[part] !== undefined &&
                current[part] !== null
            ) {

                current =
                    current[part];

            } else {

                exists = false;
                break;

            }

        }


        if (
            exists &&
            current !== undefined &&
            current !== null &&
            String(current).trim() !== ""
        ) {

            return current;

        }

    }


    return fallback;

}


/* =========================================================
   TRACKING NUMBER FROM URL
   ========================================================= */

function getTrackingFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("tracking") ||
        params.get("trackingNumber") ||
        ""
    ).trim();

}


/* =========================================================
   SUPABASE LOOKUP
   ========================================================= */

async function getShipmentFromSupabase(
    tracking
) {

    if (
        !supabaseClient ||
        !tracking
    ) {

        return null;

    }


    const columnNames = [
        "tracking_number",
        "trackingNumber",
        "tracking"
    ];


    for (
        const column of columnNames
    ) {

        try {

            const result =
                await supabaseClient
                    .from("shipments")
                    .select("*")
                    .eq(column, tracking)
                    .limit(1);


            if (
                !result.error &&
                result.data &&
                result.data.length > 0
            ) {

                return result.data[0];

            }

        } catch (error) {

            console.warn(
                "Supabase lookup failed:",
                column,
                error
            );

        }

    }


    return null;

}


/* =========================================================
   LOCAL STORAGE LOOKUP
   ========================================================= */

function getShipmentFromLocalStorage(
    tracking
) {

    try {

        const shipments =
            JSON.parse(
                localStorage.getItem(
                    "shipments"
                ) || "[]"
            );


        if (
            Array.isArray(shipments)
        ) {

            const found =
                shipments.find(
                    shipment => {

                        const shipmentTracking =
                            getValue(
                                shipment,
                                [
                                    "trackingNumber",
                                    "tracking_number",
                                    "tracking"
                                ],
                                ""
                            );


                        return (
                            String(
                                shipmentTracking
                            ).trim() ===
                            tracking
                        );

                    }
                );


            if (found) {

                return found;

            }

        }


        /*
           Single shipment fallback
        */

        const single =
            JSON.parse(
                localStorage.getItem(
                    "shipment"
                ) || "null"
            );


        if (single) {

            const singleTracking =
                getValue(
                    single,
                    [
                        "trackingNumber",
                        "tracking_number",
                        "tracking"
                    ],
                    ""
                );


            if (
                String(
                    singleTracking
                ).trim() === tracking
            ) {

                return single;

            }

        }

    } catch (error) {

        console.error(
            "Local shipment lookup error:",
            error
        );

    }


    return null;

}


/* =========================================================
   MERGE SHIPMENT DATA
   =========================================================

   IMPORTANT:

   Supabase may contain only part of a shipment.

   LocalStorage may contain the complete shipment.

   Therefore:

   1. LocalStorage is loaded.
   2. Supabase is loaded.
   3. Supabase values override LOCAL values
      only when they actually contain data.
   4. Empty Supabase fields do NOT erase
      useful LocalStorage information.
   ========================================================= */

function mergeShipmentData(
    localShipment,
    supabaseShipment
) {

    const local =
        localShipment || {};

    const remote =
        supabaseShipment || {};


    const merged = {
        ...local
    };


    Object.keys(remote).forEach(
        key => {

            const value =
                remote[key];


            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {

                merged[key] = value;

            }

        }
    );


    /*
       Preserve nested sender object
    */

    if (
        local.sender &&
        typeof local.sender === "object"
    ) {

        merged.sender = {
            ...local.sender,
            ...(remote.sender || {})
        };

    }


    /*
       Preserve nested receiver object
    */

    if (
        local.receiver &&
        typeof local.receiver === "object"
    ) {

        merged.receiver = {
            ...local.receiver,
            ...(remote.receiver || {})
        };

    }


    return merged;

}


/* =========================================================
   LOAD RECEIPT
   ========================================================= */

async function loadReceipt() {

    const tracking =
        getTrackingFromURL();


    if (!tracking) {

        showReceiptError(
            "No tracking number was provided."
        );

        return;

    }


    /*
       IMPORTANT:
       Get BOTH sources.

       We no longer stop at Supabase.
    */

    let localShipment = null;
    let supabaseShipment = null;


    /*
       LOCAL STORAGE
    */

    localShipment =
        getShipmentFromLocalStorage(
            tracking
        );


    /*
       SUPABASE
    */

    supabaseShipment =
        await getShipmentFromSupabase(
            tracking
        );


    /*
       MERGE BOTH SOURCES
    */

    const shipment =
        mergeShipmentData(
            localShipment,
            supabaseShipment
        );


    /*
       Make sure something was actually found.
    */

    if (
        !localShipment &&
        !supabaseShipment
    ) {

        showReceiptError(
            "Shipment not found."
        );

        return;

    }


    console.log(
        "AGL receipt shipment:",
        shipment
    );


    populateReceipt(
        shipment
    );

}


/* =========================================================
   POPULATE RECEIPT
   ========================================================= */

function populateReceipt(
    shipment
) {


    /* =====================================================
       BASIC INFORMATION
       ===================================================== */

    const tracking =
        clean(
            getValue(
                shipment,
                [
                    "trackingNumber",
                    "tracking_number",
                    "tracking"
                ],
                "—"
            )
        );


    const receiptNumber =
        getValue(
            shipment,
            [
                "receiptNumber",
                "receipt_number"
            ],
            "RCP-" +
            Date.now()
        );


    const documentNo =
        getValue(
            shipment,
            [
                "documentNo",
                "document_no",
                "documentNumber"
            ],
            "DOC-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            )
        );


    const verificationCode =
        getValue(
            shipment,
            [
                "verificationCode",
                "verification_code"
            ],
            generateVerificationCode()
        );


    const service =
        getValue(
            shipment,
            [
                "service",
                "serviceType",
                "service_type"
            ]
        );


    const deliveryDate =
        getValue(
            shipment,
            [
                "deliveryDate",
                "delivery_date",
                "estimatedDelivery",
                "estimated_delivery"
            ]
        );


    /* =====================================================
   PAYMENT STATUS
   ===================================================== */

let paymentStatus =
    getValue(
        shipment,
        [
            "paymentStatus",
            "payment_status",
            "payment",
            "payment_status_text"
        ],
        "Pending"
    );


/*
   Normalize payment status so the receipt
   always displays a clean value.
*/

const paymentText =
    String(paymentStatus)
        .trim()
        .toLowerCase();


if (
    paymentText === "paid" ||
    paymentText === "complete" ||
    paymentText === "completed"
) {

    paymentStatus = "Paid";

} else if (
    paymentText === "cash on delivery" ||
    paymentText === "cod"
) {

    paymentStatus = "Cash on Delivery";

} else {

    paymentStatus = "Pending";

}


    const packageName =
        getValue(
            shipment,
            [
                "package",
                "packageType",
                "package_type"
            ]
        );


    const weight =
        getValue(
            shipment,
            [
                "weight"
            ]
        );


    const origin =
        getValue(
            shipment,
            [
                "origin",
                "originLocation",
                "origin_location"
            ]
        );


    const destination =
        getValue(
            shipment,
            [
                "destination",
                "destinationLocation",
                "destination_location"
            ]
        );


    /* =====================================================
       HEADER
       ===================================================== */

    put(
        "receiptNumber",
        receiptNumber
    );


    put(
        "documentNo",
        documentNo
    );


    const createdDate =
        getValue(
            shipment,
            [
                "createdTime",
                "created_at",
                "createdAt",
                "createdDate"
            ],
            new Date()
        );


    put(
        "issueDate",
        formatDate(
            createdDate
        )
    );


    /* =====================================================
       SUMMARY
       ===================================================== */

    put(
        "receiptServiceType",
        service
    );


    put(
        "trackingNumber",
        tracking
    );


    put(
        "receiptDelivery",
        deliveryDate
    );


    put(
        "receiptPaymentStatus",
        paymentStatus
    );


    put(
        "receiptPackage",
        packageName
    );


    put(
        "receiptWeight",
        weight
    );


    put(
        "receiptRoute",
        clean(origin) +
        " → " +
        clean(destination)
    );


    put(
        "verificationCodeDisplay",
        verificationCode
    );


    /* =====================================================
       SENDER
       =====================================================

       Supports both:

       senderName

       AND

       sender: {
           name: ...
       }
    */

    put(
        "senderName",
        getValue(
            shipment,
            [
                "senderName",
                "sender_name",
                "sender.name",
                "sender.fullName",
                "sender.full_name"
            ]
        )
    );


    put(
        "senderCompany",
        getValue(
            shipment,
            [
                "senderCompany",
                "sender_company",
                "sender.company"
            ]
        )
    );


    put(
        "senderAddress",
        getValue(
            shipment,
            [
                "senderAddress",
                "sender_address",
                "sender.address"
            ]
        )
    );


    put(
        "senderCity",
        getValue(
            shipment,
            [
                "senderCity",
                "sender_city",
                "sender.city"
            ]
        )
    );


    put(
        "senderCountry",
        getValue(
            shipment,
            [
                "senderCountry",
                "sender_country",
                "sender.country"
            ]
        )
    );


    put(
        "senderPhone",
        getValue(
            shipment,
            [
                "senderPhone",
                "sender_phone",
                "sender.phone"
            ]
        )
    );


    put(
        "senderEmail",
        getValue(
            shipment,
            [
                "senderEmail",
                "sender_email",
                "sender.email"
            ]
        )
    );


    /* =====================================================
       RECEIVER
       ===================================================== */

    put(
        "receiverName",
        getValue(
            shipment,
            [
                "receiverName",
                "receiver_name",
                "receiver.name",
                "receiver.fullName",
                "receiver.full_name"
            ]
        )
    );


    put(
        "receiverCompany",
        getValue(
            shipment,
            [
                "receiverCompany",
                "receiver_company",
                "receiver.company"
            ]
        )
    );


    put(
        "receiverAddress",
        getValue(
            shipment,
            [
                "receiverAddress",
                "receiver_address",
                "receiver.address"
            ]
        )
    );


    put(
        "receiverCity",
        getValue(
            shipment,
            [
                "receiverCity",
                "receiver_city",
                "receiver.city"
            ]
        )
    );


    put(
        "receiverCountry",
        getValue(
            shipment,
            [
                "receiverCountry",
                "receiver_country",
                "receiver.country"
            ]
        )
    );


    put(
        "receiverPhone",
        getValue(
            shipment,
            [
                "receiverPhone",
                "receiver_phone",
                "receiver.phone"
            ]
        )
    );


    put(
        "receiverEmail",
        getValue(
            shipment,
            [
                "receiverEmail",
                "receiver_email",
                "receiver.email"
            ]
        )
    );


    /* =====================================================
       SHIPMENT DETAILS
       ===================================================== */

    put(
        "packageType",
        getValue(
            shipment,
            [
                "packageType",
                "package_type"
            ],
            packageName
        )
    );


    put(
        "pieces",
        getValue(
            shipment,
            [
                "pieces"
            ]
        )
    );


    put(
        "dimensionsWeight",
        weight
    );


    put(
        "dimensions",
        getValue(
            shipment,
            [
                "dimensions"
            ]
        )
    );


    put(
        "declaredValue",
        getValue(
            shipment,
            [
                "declaredValue",
                "declared_value"
            ]
        )
    );


    put(
        "insurance",
        getValue(
            shipment,
            [
                "insurance"
            ]
        )
    );


    put(
        "referenceNumber",
        getValue(
            shipment,
            [
                "referenceNumber",
                "reference_number",
                "customerReference",
                "customer_reference"
            ]
        )
    );


    put(
        "trackingBarcode",
        getValue(
            shipment,
            [
                "trackingBarcode",
                "tracking_barcode",
                "barcodeNumber",
                "barcode_number"
            ],
            tracking
        )
    );


    /* =====================================================
       ROUTE
       ===================================================== */

    put(
        "originLocation",
        origin
    );


    put(
        "destinationLocation",
        destination
    );


    /* =====================================================
       CHARGES
       ===================================================== */

    putMoney(
        "shippingCost",
        getValue(
            shipment,
            [
                "shippingCost",
                "shipping_cost"
            ],
            0
        )
    );


    putMoney(
        "tax",
        getValue(
            shipment,
            [
                "tax"
            ],
            0
        )
    );


    putMoney(
        "discount",
        getValue(
            shipment,
            [
                "discount"
            ],
            0
        )
    );


    putMoney(
        "insuranceCharge",
        getValue(
            shipment,
            [
                               "insuranceCost",
                "insurance_cost"
            ],
            0
        )
    );


    putMoney(
        "totalAmount",
        getValue(
            shipment,
            [
                "totalAmount",
                "total_amount"
            ],
            0
        )
    );


    /* =====================================================
       VERIFICATION
       ===================================================== */

    put(
        "verificationTracking",
        tracking
    );


    put(
        "verificationReceipt",
        receiptNumber
    );


    put(
        "verificationDocument",
        documentNo
    );


    put(
        "verificationCode",
        verificationCode
    );


    /* =====================================================
       FOOTER
       ===================================================== */

    put(
        "footerDocumentNo",
        documentNo
    );


    put(
        "footerIssueDate",
        formatDate(
            createdDate
        )
    );


    put(
        "receiptNumberBottom",
        receiptNumber
    );


    /* =====================================================
       TRACK BUTTON
       ===================================================== */

    const trackButton =
        document.getElementById(
            "trackButton"
        );


    if (trackButton) {

        trackButton.href =
            "track.html?tracking=" +
            encodeURIComponent(
                tracking
            );

    }


    /* =====================================================
       BARCODE
       ===================================================== */

    createBarcode(
        tracking
    );


    /* =========================================================
   QR CODE
   ========================================================= */

function createQRCode(
    tracking
) {

    const qr =
        document.getElementById(
            "qrcode"
        );


    if (!qr) {
        return;
    }


    /*
       Clear previous QR
    */

    qr.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.error(
            "QRCode library was not loaded."
        );

        return;

    }


    /*
       Build the REAL tracking page URL.

       Example:

       https://mildredmwandizi34-cell.github.io/
       Hello-world-/track.html?tracking=AGL123456
    */

    const trackPath =
        window.location.pathname.replace(
            /receipt\.html$/i,
            "track.html"
        );


    const trackURL =
        window.location.origin +
        trackPath +
        "?tracking=" +
        encodeURIComponent(
            tracking
        );


    console.log(
        "AGL QR tracking URL:",
        trackURL
    );


    try {

        new QRCode(
            qr,
            {
                text: trackURL,

                width: 90,

                height: 90,

                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );


    } catch (error) {

        console.error(
            "QR code generation error:",
            error
        );

    }

}


    /* =====================================================
       MAP
       ===================================================== */

    createRouteMap(
        origin,
        destination
    );

}


/* =========================================================
   PUT TEXT INTO ELEMENT
   ========================================================= */

function put(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            clean(value);

    }

}


/* =========================================================
   MONEY
   ========================================================= */

function putMoney(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    const number =
        Number(
            String(value)
                .replace(
                    /[^0-9.-]/g,
                    ""
                )
        );


    if (
        Number.isNaN(number)
    ) {

        element.textContent =
            clean(value);

        return;

    }


    element.textContent =
        "USD " +
        number.toFixed(2);

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

/* =========================================================
   VERIFICATION CODE
   ========================================================= */

function generateVerificationCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let result = "";


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        result +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];

    }


    return result;

}


/* =========================================================
   BARCODE
   ========================================================= */

function createBarcode(
    tracking
) {

    const barcode =
        document.getElementById(
            "barcodeLarge"
        );


    if (!barcode) {
        return;
    }


    if (
        typeof JsBarcode ===
        "undefined"
    ) {

        console.error(
            "JsBarcode library was not loaded."
        );

        return;

    }


    try {

        JsBarcode(
            barcode,
            String(tracking),
            {
                format: "CODE128",
                width: 1.5,
                height: 38,
                displayValue: true,
                fontSize: 9,
                margin: 2
            }
        );

    } catch (error) {

        console.error(
            "Barcode generation error:",
            error
        );

    }

}


/* =========================================================
   QR CODE
   ========================================================= */

function createQRCode(
    tracking
) {

    const qr =
        document.getElementById(
            "qrcode"
        );


    if (!qr) {
        return;
    }


    qr.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.error(
            "QRCode library was not loaded."
        );

        return;

    }


    const currentPath =
        window.location.pathname;


    const trackPath =
        currentPath.replace(
            /receipt\.html$/i,
            "track.html"
        );


    const trackURL =
        window.location.origin +
        trackPath +
        "?tracking=" +
        encodeURIComponent(
            tracking
        );


    try {

        new QRCode(
            qr,
            {
                text: trackURL,
                width: 55,
                height: 55,
                correctLevel:
                    QRCode.CorrectLevel.M
            }
        );

    } catch (error) {

        console.error(
            "QR code generation error:",
            error
        );

    }

}


/* =========================================================
   ROUTE MAP
   ========================================================= */

function createRouteMap(
    origin,
    destination
) {

    if (
        typeof L ===
        "undefined"
    ) {

        console.error(
            "Leaflet library was not loaded."
        );

        return;

    }


    const mapElement =
        document.getElementById(
            "receiptMap"
        );


    if (!mapElement) {
        return;
    }


    /*
       Prevent duplicate Leaflet maps.
    */

    if (
        mapElement._leaflet_id
    ) {

        return;

    }


    const originPoint =
        findCoordinates(
            origin
        );


    const destinationPoint =
        findCoordinates(
            destination
        );


    const map =
        L.map(
            mapElement,
            {
                zoomControl: false,

                dragging: false,

                scrollWheelZoom: false,

                doubleClickZoom: false,

                boxZoom: false,

                keyboard: false,

                touchZoom: false,

                attributionControl: false
            }
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: ""
        }
    ).addTo(map);


    /* =====================================================
       ROUTE LINE
       ===================================================== */

    const routeLine =
        L.polyline(
            [
                originPoint,
                destinationPoint
            ],
            {
                color: "#0b4ea2",
                weight: 3,
                opacity: 0.9,
                dashArray: "7 5"
            }
        ).addTo(map);


    /* =====================================================
       ORIGIN MARKER
       ===================================================== */

    L.circleMarker(
        originPoint,
        {
            radius: 6,

            color: "#ff9800",

            fillColor: "#ffffff",

            fillOpacity: 1,

            weight: 3
        }
    ).addTo(map);


    /* =====================================================
       DESTINATION MARKER
       ===================================================== */

    L.circleMarker(
        destinationPoint,
        {
            radius: 6,

            color: "#0b4ea2",

            fillColor: "#ffffff",

            fillOpacity: 1,

            weight: 3
        }
    ).addTo(map);


    /* =====================================================
       STATIONARY AIRPLANE
       =====================================================

       IMPORTANT:

       The airplane is created ONCE.

       There is:
       - NO animation
       - NO setInterval
       - NO setTimeout movement
       - NO transition
       - NO changing coordinates

       Therefore the airplane remains stationary.
    */

    const middleLat =
        (
            originPoint[0] +
            destinationPoint[0]
        ) / 2;


    const middleLng =
        (
            originPoint[1] +
            destinationPoint[1]
        ) / 2;


    const airplaneIcon =
        L.divIcon(
            {
                className:
                    "agl-airplane-marker",

                html:
                    '<i class="fa-solid fa-plane agl-airplane"></i>',

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
                airplaneIcon,

            interactive:
                false,

            keyboard:
                false
        }
    ).addTo(map);


    /* =====================================================
       FIT ROUTE
       ===================================================== */

    map.fitBounds(
        routeLine.getBounds(),
        {
            padding: [
                20,
                20
            ]
        }
    );


    /*
       Refresh Leaflet after layout.
       This does NOT move the airplane.
    */

    setTimeout(
        function () {

            map.invalidateSize();

        },
        150
    );

}


/* =========================================================
   FIND MAP COORDINATES
   ========================================================= */

function findCoordinates(
    location
) {

    const text =
        String(
            location || ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            ""
        );


    const locations = {

        /* AFRICA */

        kenya: [
            -1.286389,
            36.817223
        ],

        nairobi: [
            -1.286389,
            36.817223
        ],

        uganda: [
            1.373333,
            32.290275
        ],

        kampala: [
            0.347596,
            32.582520
        ],

        tanzania: [
            -6.369028,
            34.888822
        ],

        dar: [
            -6.792354,
            39.208328
        ],

        rwanda: [
            -1.940278,
            29.873888
        ],

        nigeria: [
            9.082000,
            8.675277
        ],

        lagos: [
            6.524379,
            3.379206
        ],

        ghana: [
            7.946527,
            -1.023194
        ],

        accra: [
            5.603717,
            -0.186964
        ],

        southafrica: [
            -30.559482,
            22.937506
        ],

        ethiopia: [
            9.145000,
            40.489673
        ],

        addisababa: [
            9.030000,
            38.740000
        ],


        /* NORTH AMERICA */

        usa: [
            39.828300,
            -98.579500
        ],

        unitedstates: [
            39.828300,
            -98.579500
        ],

        america: [
            39.828300,
            -98.579500
        ],

        newyork: [
            40.712800,
            -74.006000
        ],

        losangeles: [
            34.052200,
            -118.243700
        ],

        miami: [
            25.761700,
            -80.191800
        ],

        canada: [
            56.130400,
            -106.346800
        ],

        toronto: [
            43.653200,
            -79.383200
        ],


        /* EUROPE */

        uk: [
            55.378100,
            -3.436000
        ],

        unitedkingdom: [
            55.378100,
            -3.436000
        ],

        britain: [
            55.378100,
            -3.436000
        ],

        england: [
            52.355500,
            -1.174300
        ],

        london: [
            51.507400,
            -0.127800
        ],

        scotland: [
            56.490700,
            -4.202600
        ],

        germany: [
            51.165700,
            10.451500
        ],

        france: [
            46.227600,
            2.213700
        ],

        paris: [
            48.856600,
            2.352200
        ],

        italy: [
            41.871900,
            12.567400
        ],

        rome: [
            41.902800,
            12.496400
        ],

        spain: [
            40.463700,
            -3.749200
        ],

        madrid: [
            40.416800,
            -3.703800
        ],


        /* ASIA */

        china: [
            35.861700,
            104.195400
        ],

        beijing: [
            39.904200,
            116.407400
        ],

        japan: [
            36.204800,
            138.252900
        ],

        tokyo: [
            35.676200,
            139.650300
        ],

        india: [
            20.593700,
            78.962900
        ],

        delhi: [
            28.613900,
            77.209000
        ],


        /* AUSTRALIA */

        australia: [
            -25.274400,
            133.775100
        ],

        sydney: [
            -33.868800,
            151.209300
        ],


        /* SOUTH AMERICA */

        brazil: [
            -14.235000,
            -51.925300
        ],


        /* CENTRAL AMERICA */

        costa: [
            9.748900,
            -83.753400
        ],

        costarica: [
            9.748900,
            -83.753400
        ]

    };


    /*
       Search known locations.
    */

    for (
        const key of Object.keys(
            locations
        )
    ) {

        if (
            text.includes(key)
        ) {

            return locations[key];

        }

    }


    /*
       Default world position.
    */

    return [
        0,
        20
    ];

           }

/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showReceiptError(
    message
) {

    const page =
        document.querySelector(
            ".receipt-page"
        );


    if (!page) {
        return;
    }


    page.innerHTML = `

        <div style="
            min-height:190mm;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            text-align:center;
            font-family:Arial,sans-serif;
        ">

            <img
                src="image/agl-logo.png"
                style="
                    width:80px;
                    height:80px;
                    object-fit:contain;
                "
                alt="AGL"
            >

            <h2 style="
                color:#0b4ea2;
                margin:12px 0 6px;
            ">
                Shipment Receipt
            </h2>

            <p style="
                color:#64798a;
                font-size:12px;
            ">
                ${message}
            </p>

            <a
                href="create-shipment.html"
                style="
                    margin-top:15px;
                    padding:10px 18px;
                    background:#0b4ea2;
                    color:white;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
                "
            >
                Create Shipment
            </a>

        </div>

    `;

       }
