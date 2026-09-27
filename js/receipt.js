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

/* =========================================================
   MERGE SHIPMENT DATA
   ========================================================= */

function mergeShipmentData(
    localShipment,
    supabaseShipment
) {

    const local =
        localShipment || {};

    const remote =
        supabaseShipment || {};

    /*
       Start with local data.
    */

    const merged = {
        ...local
    };


    /*
       Supabase values replace local values
       only when Supabase actually has data.
    */

    Object.keys(remote).forEach(
        key => {

            const value =
                remote[key];

            if (
                value !== undefined &&
                value !== null &&
                (
                    typeof value === "object" ||
                    String(value).trim() !== ""
                )
            ) {

                merged[key] = value;

            }

        }
    );


    /*
       IMPORTANT:
       Always merge nested sender objects.
    */

    if (
        (
            local.sender &&
            typeof local.sender === "object"
        ) ||
        (
            remote.sender &&
            typeof remote.sender === "object"
        )
    ) {

        merged.sender = {

            ...(local.sender || {}),

            ...(remote.sender || {})

        };

    }


    /*
       IMPORTANT:
       Always merge nested receiver objects.
    */

    if (
        (
            local.receiver &&
            typeof local.receiver === "object"
        ) ||
        (
            remote.receiver &&
            typeof remote.receiver === "object"
        )
    ) {

        merged.receiver = {

            ...(local.receiver || {}),

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

   
/* =========================================================
   SENDER / RECEIVER DATA
   Supports flat fields + nested sender/receiver objects
   ========================================================= */

function firstAvailable(...values) {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== "" &&
            String(value).trim() !== "—"
        ) {
            return String(value).trim();
        }
    }

    return "—";
}


      // =========================================================
// SENDER DETAILS
// =========================================================

const senderName =
    getValue(shipment, [
        "sender_name",
        "senderName",
        "sender.name",
        "sender.fullName",
        "sender.full_name"
    ]);

const senderCompany =
    getValue(shipment, [
        "sender_company",
        "senderCompany",
        "sender.company"
    ]);

const senderAddress =
    getValue(shipment, [
        "sender_address",
        "senderAddress",
        "sender.address"
    ]);

const senderCity =
    getValue(shipment, [
        "sender_city",
        "senderCity",
        "sender.city"
    ]);

const senderCountry =
    getValue(shipment, [
        "sender_country",
        "senderCountry",
        "sender.country"
    ]);

const senderPhone =
    getValue(shipment, [
        "sender_phone",
        "senderPhone",
        "sender.phone"
    ]);

const senderEmail =
    getValue(shipment, [
        "sender_email",
        "senderEmail",
        "sender.email"
    ]);


// =========================================================
// DISPLAY SENDER
// =========================================================

put(
    "senderName",
    senderName
);

put(
    "senderCompany",
    senderCompany
);

put(
    "senderAddress",
    senderAddress
);

put(
    "senderCity",
    senderCity
);

put(
    "senderCountry",
    senderCountry
);

put(
    "senderPhone",
    senderPhone
);

put(
    "senderEmail",
    senderEmail
);


// =========================================================
// RECEIVER DETAILS
// =========================================================

const receiverName =
    getValue(shipment, [
        "receiver_name",
        "receiverName",
        "receiver.name",
        "receiver.fullName",
        "receiver.full_name"
    ]);

const receiverCompany =
    getValue(shipment, [
        "receiver_company",
        "receiverCompany",
        "receiver.company"
    ]);

const receiverAddress =
    getValue(shipment, [
        "receiver_address",
        "receiverAddress",
        "receiver.address"
    ]);

const receiverCity =
    getValue(shipment, [
        "receiver_city",
        "receiverCity",
        "receiver.city"
    ]);

const receiverCountry =
    getValue(shipment, [
        "receiver_country",
        "receiverCountry",
        "receiver.country"
    ]);

const receiverPhone =
    getValue(shipment, [
        "receiver_phone",
        "receiverPhone",
        "receiver.phone"
    ]);

const receiverEmail =
    getValue(shipment, [
        "receiver_email",
        "receiverEmail",
        "receiver.email"
    ]);


// =========================================================
// DISPLAY RECEIVER
// =========================================================

put(
    "receiverName",
    receiverName
);

put(
    "receiverCompany",
    receiverCompany
);

put(
    "receiverAddress",
    receiverAddress
);

put(
    "receiverCity",
    receiverCity
);

put(
    "receiverCountry",
    receiverCountry
);

put(
    "receiverPhone",
    receiverPhone
);

put(
    "receiverEmail",
    receiverEmail
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


/* =====================================================
   QR CODE
   ===================================================== */

createQRCode(
    tracking
);

    
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

        console.error(
            "Barcode element #barcodeLarge was not found."
        );

        return;

    }


    tracking =
        String(
            tracking || ""
        ).trim();


    if (!tracking) {

        console.error(
            "Barcode value is empty."
        );

        return;

    }


    /*
       Clear previous barcode.
    */

    barcode.innerHTML = "";


    /*
       If JsBarcode is already loaded,
       generate immediately.
    */

    if (
        typeof JsBarcode !==
        "undefined"
    ) {

        renderBarcode(
            barcode,
            tracking
        );

        return;

    }


    /*
       JsBarcode is not loaded.
       Load it automatically.
    */

    const existingScript =
        document.querySelector(
            'script[data-agl-jsbarcode="true"]'
        );


    if (existingScript) {

        existingScript.addEventListener(
            "load",
            function () {

                renderBarcode(
                    barcode,
                    tracking
                );

            }
        );

        return;

    }


    const script =
        document.createElement(
            "script"
        );


    script.src =
        "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";


    script.async = true;


    script.dataset.aglJsbarcode =
        "true";


    script.onload =
        function () {

            renderBarcode(
                barcode,
                tracking
            );

        };


    script.onerror =
        function () {

            console.error(
                "Unable to load JsBarcode."
            );

        };


    document.head.appendChild(
        script
    );

}


/* =========================================================
   RENDER BARCODE
   ========================================================= */

function renderBarcode(
    barcode,
    tracking
) {

    if (
        typeof JsBarcode ===
        "undefined"
    ) {

        console.error(
            "JsBarcode is still unavailable."
        );

        return;

    }


    try {

        JsBarcode(
            barcode,
            tracking,
            {

                format:
                    "CODE128",

                width:
                    2,

                height:
                    45,

                displayValue:
                    true,

                text:
                    tracking,

                fontSize:
                    10,

                font:
                    "Arial",

                fontOptions:
                    "bold",

                textMargin:
                    3,

                margin:
                    4,

                background:
                    "#ffffff",

                lineColor:
                    "#000000"

            }
        );


        /*
           Make sure the SVG is visible.
        */

        barcode.style.display =
            "block";

        barcode.style.visibility =
            "visible";

        barcode.style.opacity =
            "1";


        console.log(
            "AGL barcode generated:",
            tracking
        );


    } catch (error) {

        console.error(
            "Barcode generation error:",
            error
        );

    }

           }

/* =========================================================
   AGL QR CODE
   SELF-CONTAINED QR GENERATOR
   ========================================================= */

           function createQRCode(tracking) {

    const qrContainer = document.getElementById("qrcode");

    if (!qrContainer) {
        console.error("QR container not found.");
        return;
    }

    tracking = String(tracking || "").trim();

    if (!tracking) {
        console.error("Tracking number is missing.");
        return;
    }

    qrContainer.innerHTML = "";

    const trackURL =
        "https://mildredmwandizi34-cell.github.io/Hello-world-/track.html?tracking="
        + encodeURIComponent(tracking);

    console.log("AGL QR URL:", trackURL);

    try {

        if (typeof QRCode === "undefined") {
            console.error("QRCode library is not loaded.");
            return;
        }

        new QRCode(qrContainer, {
            text: trackURL,
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        });

        console.log("AGL QR generated successfully.");

    } catch (error) {
        console.error("QR generation failed:", error);
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


    // ===========================================
// FIX LEAFLET MAP WIDTH
// ===========================================

setTimeout(function () {

    if (receiptMap) {
        receiptMap.invalidateSize(true);
    }

}, 300);


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
