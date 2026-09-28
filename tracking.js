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
   FIND COORDINATES
   ROBUST LOCATION MATCHING
========================================================= */

function findCoordinates(place) {

    if (!place) {
        return null;
    }

    const text =
        String(place)
            .trim()
            .toLowerCase();


    /* =====================================================
       AGL / KENYA
    ===================================================== */

    if (
        text.includes("american global logistics") ||
        text.includes("agl warehouse") ||
        text.includes("warehouse") ||
        text.includes("nairobi") ||
        text.includes("kenya")
    ) {
        return [-1.286389, 36.817223];
    }


    if (
        text.includes("mombasa")
    ) {
        return [-4.0435, 39.6682];
    }


    /* =====================================================
       UNITED KINGDOM
    ===================================================== */

    if (
        text.includes("london") ||
        text.includes("united kingdom") ||
        text === "uk"
    ) {
        return [51.5074, -0.1278];
    }


    /* =====================================================
       UNITED STATES
    ===================================================== */

    if (
        text.includes("new york")
    ) {
        return [40.7128, -74.0060];
    }


    if (
        text.includes("los angeles")
    ) {
        return [34.0522, -118.2437];
    }


    if (
        text.includes("united states") ||
        text === "usa" ||
        text === "us"
    ) {
        return [40.7128, -74.0060];
    }


    /* =====================================================
       UNITED ARAB EMIRATES
    ===================================================== */

    if (
        text.includes("dubai") ||
        text.includes("united arab emirates") ||
        text === "uae"
    ) {
        return [25.2048, 55.2708];
    }


    /* =====================================================
       CANADA
    ===================================================== */

    if (
        text.includes("toronto")
    ) {
        return [43.6532, -79.3832];
    }


    if (
        text.includes("vancouver")
    ) {
        return [49.2827, -123.1207];
    }


    if (
        text.includes("canada")
    ) {
        return [43.6532, -79.3832];
    }


    /* =====================================================
       EUROPE
    ===================================================== */

    if (
        text.includes("paris") ||
        text.includes("france")
    ) {
        return [48.8566, 2.3522];
    }


    if (
        text.includes("berlin") ||
        text.includes("germany")
    ) {
        return [52.5200, 13.4050];
    }


    if (
        text.includes("rome") ||
        text.includes("italy")
    ) {
        return [41.9028, 12.4964];
    }


    if (
        text.includes("madrid") ||
        text.includes("spain")
    ) {
        return [40.4168, -3.7038];
    }


    /* =====================================================
       ASIA
    ===================================================== */

    if (
        text.includes("beijing") ||
        text.includes("china")
    ) {
        return [39.9042, 116.4074];
    }


    if (
        text.includes("tokyo") ||
        text.includes("japan")
    ) {
        return [35.6762, 139.6503];
    }


    if (
        text.includes("mumbai") ||
        text.includes("india")
    ) {
        return [19.0760, 72.8777];
    }


    /* =====================================================
       AUSTRALIA
    ===================================================== */

    if (
        text.includes("sydney") ||
        text.includes("australia")
    ) {
        return [-33.8688, 151.2093];
    }


    /* =====================================================
       AFRICA
    ===================================================== */

    if (
        text.includes("johannesburg") ||
        text.includes("south africa")
    ) {
        return [-26.2041, 28.0473];
    }


    if (
        text.includes("cairo") ||
        text.includes("egypt")
    ) {
        return [30.0444, 31.2357];
    }


    if (
        text.includes("accra") ||
        text.includes("ghana")
    ) {
        return [5.6037, -0.1870];
    }


    if (
        text.includes("lagos") ||
        text.includes("nigeria")
    ) {
        return [6.5244, 3.3792];
    }


    /* =====================================================
       FALLBACK — MATCH LOCATION COORDINATES
    ===================================================== */

    for (
        const key in locationCoordinates
    ) {

        const keyText =
            key
                .toLowerCase()
                .trim();


        if (
            text === keyText ||
            text.includes(keyText) ||
            keyText.includes(text)
        ) {

            return locationCoordinates[key];

        }

    }


    console.error(
        "NO COORDINATES FOUND FOR:",
        place
    );


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

    console.log("MAP ORIGIN:", origin);
    console.log("MAP CURRENT:", current);
    console.log("MAP DESTINATION:", destination);


    const mapElement =
        document.getElementById("shipmentMap");


    if (!mapElement) {

        console.error(
            "shipmentMap element not found."
        );

        return;
    }


    /* =====================================================
       FIND COORDINATES
    ===================================================== */

    const originCoords =
        findCoordinates(origin);

    const destinationCoords =
        findCoordinates(destination);

    const currentCoords =
        findCoordinates(current);


    console.log(
        "ORIGIN COORDINATES:",
        originCoords
    );

    console.log(
        "DESTINATION COORDINATES:",
        destinationCoords
    );

    console.log(
        "CURRENT COORDINATES:",
        currentCoords
    );


    /* =====================================================
       CHECK ROUTE
    ===================================================== */

    if (
        !originCoords ||
        !destinationCoords
    ) {

        console.warn(
            "Map coordinates not found:",
            origin,
            destination
        );

        mapElement.innerHTML = `
            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                padding:20px;
                font-family:Arial,sans-serif;
            ">

                <div>

                    <i
                        class="fa-solid fa-location-dot"
                        style="
                            font-size:34px;
                            color:#0b4ea2;
                            margin-bottom:12px;
                        ">
                    </i>

                    <br>

                    <strong>
                        Shipment route map is unavailable.
                    </strong>

                </div>

            </div>
        `;

        return;
    }


    /* =====================================================
       REMOVE PREVIOUS MAP
    ===================================================== */

    if (shipmentMap) {

        shipmentMap.remove();

        shipmentMap = null;
    }


    /* =====================================================
       CREATE LEAFLET MAP
    ===================================================== */

    shipmentMap =
        L.map(
            "shipmentMap",
            {
                zoomControl: false,
                attributionControl: false
            }
        );


    /* =====================================================
       OPENSTREETMAP
    ===================================================== */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19
        }
    ).addTo(shipmentMap);


    /* =====================================================
       ORIGIN MARKER
    ===================================================== */

    L.marker(originCoords)
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Origin</strong><br>" +
            escapeHTML(
                String(origin || "")
            )
        );


    /* =====================================================
       DESTINATION MARKER
    ===================================================== */

    L.marker(destinationCoords)
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Destination</strong><br>" +
            escapeHTML(
                String(destination || "")
            )
        );


    /* =====================================================
       CURRENT LOCATION
    ===================================================== */

    if (
        currentCoords &&
        current &&
        current !== "-"
    ) {

        L.circleMarker(
            currentCoords,
            {
                radius: 8,
                weight: 3,
                fillOpacity: 1
            }
        )
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Current Location</strong><br>" +
            escapeHTML(
                String(current)
            )
        );
    }


    /* =====================================================
       DASHED ROUTE
    ===================================================== */

    routeLine =
        L.polyline(
            [
                originCoords,
                destinationCoords
            ],
            {
                color: "#0b4ea2",
                weight: 4,
                opacity: 0.9,
                dashArray: "10, 10"
            }
        ).addTo(shipmentMap);


    /* =====================================================
       STATIONARY AIRPLANE
    ===================================================== */

    const airplaneIcon =
        L.divIcon({

            className:
                "stationary-airplane",

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


    /* =====================================================
       FIT ROUTE
    ===================================================== */

    const bounds =
        L.latLngBounds(
            [
                originCoords,
                destinationCoords
            ]
        );


    shipmentMap.fitBounds(
        bounds,
        {
            padding: [
                40,
                40
            ]
        }
    );


    /* =====================================================
       PUT AIRPLANE IN CENTER
       NO ANIMATION
    ===================================================== */

    placeStationaryAirplane(
        originCoords,
        destinationCoords
    );


    /* =====================================================
       REFRESH MAP SIZE
    ===================================================== */

    requestAnimationFrame(
        function () {

            if (!shipmentMap) {
                return;
            }

            shipmentMap.invalidateSize();

            shipmentMap.fitBounds(
                bounds,
                {
                    padding: [
                        40,
                        40
                    ]
                }
            );

        }
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
