/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   CUSTOMER TRACKING
   SUPABASE LIVE VERSION
   ========================================================= */

"use strict";


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   MAP VARIABLES
   ========================================================= */

let shipmentMap = null;
let routeLine = null;
let airplaneMarker = null;
let airplaneAnimation = null;


/* =========================================================
   LOCATION COORDINATES
   ========================================================= */

const locationCoordinates = {

    Nairobi: [-1.286389, 36.817223],

    London: [51.5074, -0.1278],

    "New York": [40.7128, -74.0060],

    "Los Angeles": [34.0522, -118.2437],

    Dubai: [25.2048, 55.2708],

    Toronto: [43.6532, -79.3832],

    Vancouver: [49.2827, -123.1207],

    Paris: [48.8566, 2.3522],

    Berlin: [52.5200, 13.4050],

    Rome: [41.9028, 12.4964],

    Madrid: [40.4168, -3.7038],

    Beijing: [39.9042, 116.4074],

    Tokyo: [35.6762, 139.6503],

    Sydney: [-33.8688, 151.2093],

    Mumbai: [19.0760, 72.8777],

    Johannesburg: [-26.2041, 28.0473],

    Cairo: [30.0444, 31.2357],

    Accra: [5.6037, -0.1870],

    Lagos: [6.5244, 3.3792],

    Mombasa: [-4.0435, 39.6682]
};


/* =========================================================
   HELPER
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);
}


function setText(id, value) {

    const element =
        getElement(id);

    if (!element) return;

    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";
}


/* =========================================================
   TRACKING NUMBER
   ========================================================= */

function getTrackingNumber() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlTracking =
        params.get("tracking");


    if (urlTracking) {

        return urlTracking
            .trim()
            .toUpperCase();

    }


    const input =
        getElement("trackingNumber");


    if (
        input &&
        input.value.trim()
    ) {

        return input.value
            .trim()
            .toUpperCase();

    }


    return "";
}


/* =========================================================
   TRACK SHIPMENT
   ========================================================= */

async function trackShipment() {

    const tracking =
        getTrackingNumber();


    if (!tracking) {

        showMessage(
            "Please enter a tracking number.",
            "error"
        );

        return;
    }


    const input =
        getElement("trackingNumber");


    if (input) {

        input.value =
            tracking;

    }


    const result =
        getElement("trackingResult");


    if (result) {

        result.style.display =
            "none";

    }


    showMessage(
        "Searching for shipment...",
        "loading"
    );


    try {

        const {

            data,
            error

        } = await supabaseClient

            .from("shipments")

            .select("*")

            .eq(
                "tracking_number",
                tracking
            )

            .maybeSingle();


        if (error) {

            console.error(
                "Supabase error:",
                error
            );

            throw error;
        }


        if (!data) {

            showMessage(
                "Shipment not found. Please check your tracking number.",
                "error"
            );

            return;
        }


        console.log(
            "SHIPMENT FOUND:",
            data
        );


        displayShipment(data);


        const message =
            getElement("message");


        if (message) {

            message.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Tracking error:",
            error
        );


        showMessage(
            "Unable to connect to the tracking system. Please try again.",
            "error"
        );

    }
}


/* =========================================================
   DISPLAY SHIPMENT
   ========================================================= */

function displayShipment(shipment) {

    const tracking =
        shipment.tracking_number ||
        shipment.trackingNumber ||
        shipment.tracking ||
        "";


    const status =
        shipment.status ||
        "Shipment Created";


    const location =
        shipment.location ||
        shipment.current_location ||
        shipment.currentLocation ||
        "";


    const origin =
        shipment.origin ||
        "";


    const destination =
        shipment.destination ||
        "";


    const delivery =
        shipment.delivery_date ||
        shipment.deliveryDate ||
        shipment.estimated_delivery ||
        shipment.estimatedDelivery ||
        "";


    const service =
        shipment.service ||
        "";


    const payment =
        shipment.payment ||
        shipment.payment_status ||
        shipment.paymentStatus ||
        "";


    const packageName =
        shipment.package ||
        shipment.package_name ||
        shipment.packageName ||
        "";


    const packageType =
        shipment.package_type ||
        shipment.packageType ||
        "";


    const weight =
        shipment.weight ||
        "";


    const pieces =
        shipment.pieces ||
        "";


    const dimensions =
        shipment.dimensions ||
        "";


    /* =====================================================
       MAIN TRACKING INFORMATION
    ===================================================== */

    setText(
        "displayTracking",
        tracking
    );


    setText(
        "displayStatus",
        status
    );


    setText(
        "displayOrigin",
        origin
    );


    setText(
        "displayLocation",
        location
    );


    setText(
        "displayDestination",
        destination
    );


    setText(
        "displayDelivery",
        delivery
    );


    setText(
        "displayService",
        service
    );


    setText(
        "displayPayment",
        payment
    );


    /* =====================================================
       PACKAGE INFORMATION
    ===================================================== */

    setText(
        "packageInfo",
        packageName
    );


    setText(
        "packageType",
        packageType
    );


    setText(
        "packageWeight",
        weight
    );


    setText(
        "packagePieces",
        pieces
    );


    setText(
        "packageDimensions",
        dimensions
    );


    /* =====================================================
       ROUTE
    ===================================================== */

    setText(
        "routeOrigin",
        origin
    );


    setText(
        "routeCurrent",
        location
    );


    setText(
        "routeDestination",
        destination
    );


    /* =====================================================
       CONTROL CENTER
    ===================================================== */

    setText(
        "controlStatus",
        status
    );


    setText(
        "controlLocation",
        location
    );


    setText(
        "controlDestination",
        destination
    );


    /* =====================================================
       PROGRESS
    ===================================================== */

    let progress =
        Number(shipment.progress);


    if (
        Number.isNaN(progress)
    ) {

        progress =
            getProgress(status);

    }


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    updateProgress(
        progress
    );


    setText(
        "controlProgressText",
        progress + "%"
    );


    const controlProgress =
        getElement(
            "controlProgressFill"
        );


    if (controlProgress) {

        controlProgress.style.width =
            progress + "%";

    }


    /* =====================================================
       PAYMENT COLOR
    ===================================================== */

    const paymentElement =
        getElement(
            "displayPayment"
        );


    if (paymentElement) {

        paymentElement.classList.remove(
            "paid"
        );


        if (
            String(payment)
                .toLowerCase()
                .includes("paid")
        ) {

            paymentElement.classList.add(
                "paid"
            );

        }

    }


    /* =====================================================
       HISTORY
    ===================================================== */

    displayHistory(
        shipment.history
    );


    /* =====================================================
       MAP
    ===================================================== */

    displayMap(
        origin,
        location,
        destination
    );


    /* =====================================================
       SHOW RESULT
    ===================================================== */

    const result =
        getElement(
            "trackingResult"
        );


    if (result) {

        result.style.display =
            "block";

    }


    /* =====================================================
       LOCAL CACHE
    ===================================================== */

    localStorage.setItem(
        "currentShipment",
        JSON.stringify(shipment)
    );


    console.log(
        "Shipment displayed successfully."
    );
}


/* =========================================================
   PROGRESS
   ========================================================= */

function getProgress(status) {

    const value =
        String(status || "")
            .toLowerCase();


    if (
        value.includes("delivered")
    ) {
        return 100;
    }


    if (
        value.includes("out for delivery")
    ) {
        return 90;
    }


    if (
        value.includes("arrived")
    ) {
        return 75;
    }


    if (
        value.includes("customs")
    ) {
        return 65;
    }


    if (
        value.includes("transit")
    ) {
        return 50;
    }


    if (
        value.includes("picked up")
    ) {
        return 25;
    }


    if (
        value.includes("awaiting pickup")
    ) {
        return 15;
    }


    return 5;
}


function updateProgress(progress) {

    const progressFill =
        getElement(
            "progressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }


    const progressText =
        getElement(
            "progressText"
        );


    if (progressText) {

        progressText.textContent =
            progress + "%";

    }
}


/* =========================================================
   HISTORY
   ========================================================= */

function displayHistory(historyData) {

    const historyContainer =
        getElement(
            "shipmentHistory"
        );


    if (!historyContainer) {
        return;
    }


    if (!historyData) {

        historyContainer.innerHTML =
            "<p>No shipment history available.</p>";

        return;
    }


    let history =
        historyData;


    if (
        typeof historyData === "string"
    ) {

        try {

            history =
                JSON.parse(historyData);

        } catch (error) {

            console.error(
                "History JSON error:",
                error
            );

            history = [];

        }

    }


    if (
        !Array.isArray(history) ||
        !history.length
    ) {

        historyContainer.innerHTML =
            "<p>No shipment history available.</p>";

        return;
    }


    historyContainer.innerHTML =
        history
            .slice()
            .reverse()
            .map(function (item) {

                const status =
                    item.status ||
                    item.event ||
                    "Shipment Update";


                const location =
                    item.location ||
                    "";


                const date =
                    item.date ||
                    item.created_at ||
                    item.createdTime ||
                    "";


                return `
                    <div class="history-item">

                        <div class="history-dot">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>

                        <div class="history-content">

                            <strong>
                                ${escapeHTML(status)}
                            </strong>

                            ${
                                location
                                    ? `<span>${escapeHTML(location)}</span>`
                                    : ""
                            }

                            ${
                                date
                                    ? `<small>${escapeHTML(formatDate(date))}</small>`
                                    : ""
                            }

                        </div>

                    </div>
                `;

            })
            .join("");
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(value) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   MAP COORDINATES
   ========================================================= */

function findCoordinates(place) {

    if (!place) {
        return null;
    }


    const name =
        String(place).trim();


    if (
        locationCoordinates[name]
    ) {

        return locationCoordinates[name];

    }


    const lower =
        name.toLowerCase();


    for (
        const key in locationCoordinates
    ) {

        if (
            key.toLowerCase() === lower
        ) {

            return locationCoordinates[key];

        }

    }


    return null;
}


/* =========================================================
   DISPLAY MAP
   ========================================================= */

function displayMap(
    origin,
    current,
    destination
) {

    const originCoords =
        findCoordinates(origin);


    const destinationCoords =
        findCoordinates(destination);


    if (
        !originCoords ||
        !destinationCoords
    ) {

        console.warn(
            "Map coordinates not found:",
            origin,
            destination
        );

        return;
    }


    /* -----------------------------------------
       CREATE MAP
    ----------------------------------------- */

    if (!shipmentMap) {

        shipmentMap =
            L.map(
                "shipmentMap",
                {
                    zoomControl: false,
                    attributionControl: false
                }
            );


        /* -----------------------------------------
           MAP TILES
        ----------------------------------------- */

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                minZoom: 2
            }
        ).addTo(
            shipmentMap
        );

    } else {

        shipmentMap.invalidateSize();


        if (routeLine) {

            shipmentMap.removeLayer(
                routeLine
            );

        }


        if (airplaneMarker) {

            shipmentMap.removeLayer(
                airplaneMarker
            );

        }

    }


    /* -----------------------------------------
       ORIGIN
    ----------------------------------------- */

    L.marker(
        originCoords
    )
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Origin</strong><br>" +
            escapeHTML(origin)
        );


    /* -----------------------------------------
       DESTINATION
    ----------------------------------------- */

    L.marker(
        destinationCoords
    )
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Destination</strong><br>" +
            escapeHTML(destination)
        );


    /* -----------------------------------------
       ROUTE
    ----------------------------------------- */

    routeLine =
        L.polyline(
            [
                originCoords,
                destinationCoords
            ],
            {
                color: "#0b4ea2",
                weight: 4,
                dashArray: "10 8",
                opacity: 0.9
            }
        ).addTo(
            shipmentMap
        );


    /* -----------------------------------------
       AIRPLANE
    ----------------------------------------- */

    const airplaneIcon =
        L.divIcon({

            className:
                "animated-airplane",

            html: `
                <div class="airplane-wrapper">
                    <i class="fa-solid fa-plane"></i>
                </div>
            `,

            iconSize: [
                42,
                42
            ],

            iconAnchor: [
                21,
                21
            ]

        });


    airplaneMarker =
        L.marker(
            originCoords,
            {
                icon:
                    airplaneIcon,

                zIndexOffset:
                    1000,

                interactive:
                    false
            }
        ).addTo(
            shipmentMap
        );


    /* -----------------------------------------
       FIT MAP
    ----------------------------------------- */

    shipmentMap.fitBounds(

        L.latLngBounds(
            originCoords,
            destinationCoords
        ),

        {
            padding: [
                40,
                40
            ]
        }
    );


    /* -----------------------------------------
       START AIRPLANE
    ----------------------------------------- */

    animateAirplane(
        originCoords,
        destinationCoords
    );
}


/* =========================================================
   ANIMATE AIRPLANE
========================================================= */

function animateAirplane(
    origin,
    destination
) {

    if (!airplaneMarker) {
        return;
    }


    if (airplaneAnimation) {

        cancelAnimationFrame(
            airplaneAnimation
        );

    }


    const startLat =
        origin[0];

    const startLng =
        origin[1];

    const endLat =
        destination[0];

    const endLng =
        destination[1];


    const duration =
        12000;


    let startTime =
        null;


    function moveAirplane(timestamp) {

        if (!startTime) {

            startTime =
                timestamp;

        }


        const elapsed =
            timestamp -
            startTime;


        let progress =
            elapsed /
            duration;


        progress =
            Math.min(
                progress,
                1
            );


        const latitude =
            startLat +
            (
                endLat -
                startLat
            ) *
            progress;


        const longitude =
            startLng +
            (
                endLng -
                startLng
            ) *
            progress;


        airplaneMarker.setLatLng([
            latitude,
            longitude
        ]);


        if (progress < 1) {

            airplaneAnimation =
                requestAnimationFrame(
                    moveAirplane
                );

        } else {

            /* Restart from origin */

            startTime =
                null;

            airplaneAnimation =
                requestAnimationFrame(
                    moveAirplane
                );
        }
    }


    airplaneAnimation =
        requestAnimationFrame(
            moveAirplane
        );
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    text,
    type
) {

    const message =
        getElement("message");


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.style.display =
        "block";


    message.className =
        "message " +
        (type || "");
}


/* =========================================================
   NEW SEARCH
========================================================= */

function newSearch() {

    const input =
        getElement(
            "trackingNumber"
        );


    const result =
        getElement(
            "trackingResult"
        );


    if (input) {

        input.value = "";

        input.focus();

    }


    if (result) {

        result.style.display =
            "none";

    }


    const message =
        getElement("message");


    if (message) {

        message.style.display =
            "none";

    }


    if (airplaneAnimation) {

        cancelAnimationFrame(
            airplaneAnimation
        );

    }


    airplaneAnimation =
        null;
}


/* =========================================================
   COPY TRACKING NUMBER
========================================================= */

function copyTrackingNumber() {

    const element =
        getElement(
            "displayTracking"
        );


    if (!element) {
        return;
    }


    const text =
        element.textContent.trim();


    if (
        !text ||
        text === "-"
    ) {
        return;
    }


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(function () {

                showMessage(
                    "Tracking number copied.",
                    "success"
                );

            })
            .catch(function () {

                   fallbackCopy(text);

            });

    } else {

        fallbackCopy(text);

    }
}


/* =========================================================
   FALLBACK COPY
========================================================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showMessage(
            "Tracking number copied.",
            "success"
        );

    } catch (error) {

        showMessage(
            "Unable to copy tracking number.",
            "error"
        );

    }


    document.body.removeChild(
        textarea
    );
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            getElement(
                "trackingNumber"
            );


        /* -----------------------------------------
           ENTER KEY
        ----------------------------------------- */

        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        trackShipment();

                    }

                }
            );

        }


        /* -----------------------------------------
           TRACKING NUMBER FROM URL
        ----------------------------------------- */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const tracking =
            params.get(
                "tracking"
            );


        if (
            tracking &&
            input
        ) {

            input.value =
                tracking;


            trackShipment();

        }

    }
);
