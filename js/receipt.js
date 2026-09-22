/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   NEW RECEIPT SYSTEM
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
   HELPERS
   ========================================================= */

function clean(value) {

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {

        return "—";

    }

    return String(value);

}


function getValue(
    object,
    keys,
    fallback = "—"
) {

    if (!object) {
        return fallback;
    }

    for (const key of keys) {

        if (
            object[key] !== undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {

            return object[key];

        }

    }

    return fallback;
}


/* =========================================================
   URL TRACKING NUMBER
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


    /*
       Different Supabase table designs can use
       different column names.

       We try the common versions.
    */

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
                "Supabase lookup failed for:",
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

                        return (
                            String(
                                getValue(
                                    shipment,
                                    [
                                        "trackingNumber",
                                        "tracking_number",
                                        "tracking"
                                    ],
                                    ""
                                )
                            ).trim() ===
                            tracking
                        );

                    }
                );


            if (found) {

                return found;

            }

        }


        const single =
            JSON.parse(
                localStorage.getItem(
                    "shipment"
                ) || "null"
            );


        if (single) {

            const singleTracking =
                String(
                    getValue(
                        single,
                        [
                            "trackingNumber",
                            "tracking_number",
                            "tracking"
                        ],
                        ""
                    )
                ).trim();


            if (
                singleTracking === tracking
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


    let shipment = null;


    /*
       1. TRY SUPABASE FIRST
    */

    shipment =
        await getShipmentFromSupabase(
            tracking
        );


    /*
       2. LOCAL STORAGE FALLBACK
    */

    if (!shipment) {

        shipment =
            getShipmentFromLocalStorage(
                tracking
            );

    }


    if (!shipment) {

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
                "estimatedDelivery"
            ]
        );


    const paymentStatus =
        getValue(
            shipment,
            [
                "paymentStatus",
                "payment_status"
            ],
            "Pending"
        );


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
                "origin"
            ]
        );


    const destination =
        getValue(
            shipment,
            [
                "destination"
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

    put(
        "issueDate",
        formatDate(
            getValue(
                shipment,
                [
                    "createdTime",
                    "created_at",
                    "createdAt"
                ],
                new Date()
            )
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
       ===================================================== */

    put(
        "senderName",
        getValue(
            shipment,
            [
                "senderName",
                "sender_name"
            ]
        )
    );

    put(
        "senderCompany",
        getValue(
            shipment,
            [
                "senderCompany",
                "sender_company"
            ]
        )
    );

    put(
        "senderAddress",
        getValue(
            shipment,
            [
                "senderAddress",
                "sender_address"
            ]
        )
    );

    put(
        "senderCity",
        getValue(
            shipment,
            [
                "senderCity",
                "sender_city"
            ]
        )
    );

    put(
        "senderCountry",
        getValue(
            shipment,
            [
                "senderCountry",
                "sender_country"
            ]
        )
    );

    put(
        "senderPhone",
        getValue(
            shipment,
            [
                "senderPhone",
                "sender_phone"
            ]
        )
    );

    put(
        "senderEmail",
        getValue(
            shipment,
            [
                "senderEmail",
                "sender_email"
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
                "receiver_name"
            ]
        )
    );

    put(
        "receiverCompany",
        getValue(
            shipment,
            [
                "receiverCompany",
                "receiver_company"
            ]
        )
    );

    put(
        "receiverAddress",
        getValue(
            shipment,
            [
                "receiverAddress",
                "receiver_address"
            ]
        )
    );

    put(
        "receiverCity",
        getValue(
            shipment,
            [
                "receiverCity",
                "receiver_city"
            ]
        )
    );

    put(
        "receiverCountry",
        getValue(
            shipment,
            [
                "receiverCountry",
                "receiver_country"
            ]
        )
    );

    put(
        "receiverPhone",
        getValue(
            shipment,
            [
                "receiverPhone",
                "receiver_phone"
            ]
        )
    );

    put(
        "receiverEmail",
        getValue(
            shipment,
            [
                "receiverEmail",
                "receiver_email"
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
            getValue(
                shipment,
                [
                    "createdTime",
                    "created_at",
                    "createdAt"
                ],
                new Date()
            )
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
       QR
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
   PUT TEXT
   ========================================================= */

function put(
    id,
    value
) {

    const element =
        document.getElementById(id);

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
        document.getElementById(id);

    if (!element) {
        return;
    }


    const number =
        Number(
            String(value)
                .replace(/[^0-9.-]/g, "")
        );


    if (Number.isNaN(number)) {

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


    if (Number.isNaN(
        date.getTime()
    )) {

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

    if (
        typeof JsBarcode ===
        "undefined"
    ) {

        return;

    }


    const barcode =
        document.getElementById(
            "barcodeLarge"
        );


    if (!barcode) {
        return;
    }


    try {

        JsBarcode(
            barcode,
            tracking,
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
            "Barcode error:",
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

        return;

    }


    const trackURL =
        window.location.origin +
        window.location.pathname
            .replace(
                /receipt\.html$/i,
                "track.html"
            ) +
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
            "QR error:",
            error
        );

    }

}

/* =========================================================
   MAP
   ========================================================= */

function createRouteMap(
    origin,
    destination
) {

    if (
        typeof L ===
        "undefined"
    ) {

        return;

    }


    const mapElement =
        document.getElementById(
            "receiptMap"
        );


    if (!mapElement) {
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
                touchZoom: false
            }
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: ""
        }
    ).addTo(map);


    const points = [
        originPoint,
        destinationPoint
    ];


    const line =
        L.polyline(
            points,
            {
                color: "#0b4ea2",
                weight: 3,
                opacity: 0.9,
                dashArray: "7 5"
            }
        ).addTo(map);


    L.circleMarker(
        originPoint,
        {
            radius: 6,
            color: "#0b4ea2",
            fillColor: "#ffffff",
            fillOpacity: 1,
            weight: 3
        }
    )
    .addTo(map);


    L.circleMarker(
        destinationPoint,
        {
            radius: 6,
            color: "#ff9800",
            fillColor: "#ffffff",
            fillOpacity: 1,
            weight: 3
        }
    )
    .addTo(map);


    /*
       Stationary airplane in the middle
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


    const airplane =
        L.marker(
            [
                middleLat,
                middleLng
            ],
            {
                interactive: false,
                icon:
                    L.divIcon(
                        {
                            className:
                                "agl-airplane-marker",
                            html:
                                '<i class="fa-solid fa-plane agl-airplane"></i>',
                            iconSize:
                                [30, 30],
                            iconAnchor:
                                [15, 15]
                        }
                    )
            }
        );


    airplane.addTo(map);


    map.fitBounds(
        line.getBounds(),
        {
            padding: [20, 20]
        }
    );

}


/* =========================================================
   COORDINATES
   ========================================================= */

function findCoordinates(
    location
) {

    const text =
        String(
            location || ""
        ).toLowerCase();


    const locations = {

        kenya:
            [-1.286389, 36.817223],

        nairobi:
            [-1.286389, 36.817223],

        uganda:
            [1.373333, 32.290275],

        tanzania:
            [-6.369028, 34.888822],

        rwanda:
            [-1.940278, 29.873888],

        nigeria:
            [9.082, 8.6753],

        ghana:
            [7.9465, -1.0232],

        southafrica:
            [-30.5595, 22.9375],

        ethiopia:
            [9.145, 40.4897],

        usa:
            [39.8283, -98.5795],

        america:
            [39.8283, -98.5795],

        newyork:
            [40.7128, -74.0060],

        losangeles:
            [34.0522, -118.2437],

        canada:
            [56.1304, -106.3468],

        uk:
            [55.3781, -3.4360],

        london:
            [51.5074, -0.1278],

        scotland:
            [56.4907, -4.2026],

        germany:
            [51.1657, 10.4515],

        france:
            [46.2276, 2.2137],

        italy:
            [41.8719, 12.5674],

        spain:
            [40.4637, -3.7492],

        china:
            [35.8617, 104.1954],

        japan:
            [36.2048, 138.2529],

        india:
            [20.5937, 78.9629],

        australia:
            [-25.2744, 133.7751],

        brazil:
            [-14.2350, -51.9253],

        costa:
            [9.7489, -83.7534]

    };


    for (
        const key of Object.keys(
            locations
        )
    ) {

        if (
            text.replace(
                /[^a-z]/g,
                ""
            ).includes(key)
        ) {

            return locations[key];

        }

    }


    /*
       Default world route
    */

    return [
        0,
        20
    ];

}


/* =========================================================
   ERROR
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
                alt="AGL">

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
                ">
                Create Shipment
            </a>

        </div>

    `;

           }
