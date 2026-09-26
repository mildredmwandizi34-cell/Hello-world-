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

/* =========================================================
   MAP
   ========================================================= */

let shipmentMap = null;
let routeLine = null;
let airplaneMarker = null;
let airplaneAnimation = null;

/* =========================================================
   HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);

    if (!element) return;

    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";
}


/* =========================================================
   FIND TRACKING NUMBER
   ========================================================= */

function getTrackingNumber() {

    const params =
        new URLSearchParams(window.location.search);

    const urlTracking =
        params.get("tracking");

    if (urlTracking) {
        return urlTracking.trim().toUpperCase();
    }

    const input =
        getElement("trackingSearch");

    if (input && input.value.trim()) {
        return input.value.trim().toUpperCase();
    }

    return "";
}


/* =========================================================
   SEARCH SHIPMENT
   ========================================================= */

async function trackShipment() {

    const tracking =
        getTrackingNumber();

    if (!tracking) {

        alert("Please enter a tracking number.");

        return;
    }

    const button =
        getElement("trackButton");

    if (button) {
        button.disabled = true;
        button.textContent = "Searching...";
    }

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/shipments" +
            "?tracking_number=eq." +
            encodeURIComponent(tracking) +
            "&select=*";

        const response =
            await fetch(url, {

                method: "GET",

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        "application/json"

                }

            });


        if (!response.ok) {

            throw new Error(
                "Supabase error: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.length) {

            alert(
                "Shipment not found. Please check your tracking number."
            );

            hideTrackingResult();

            return;
        }


        const shipment =
            data[0];


        displayShipment(shipment);


    } catch (error) {

        console.error(
            "Tracking error:",
            error
        );

        alert(
            "Unable to connect to the tracking system. Please try again."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Track Shipment";

        }

    }
}


/* =========================================================
   DISPLAY SHIPMENT
   ========================================================= */

function displayShipment(shipment) {

    /* -----------------------------------------
       BASIC INFORMATION
    ----------------------------------------- */

    setText(
        "trackingNumber",
        shipment.tracking_number
    );

    setText(
        "status",
        shipment.status
    );

    setText(
        "location",
        shipment.location
    );

    setText(
        "origin",
        shipment.origin
    );

    setText(
        "destination",
        shipment.destination
    );

    setText(
        "delivery",
        shipment.delivery_date
    );

    setText(
        "service",
        shipment.service
    );

    setText(
        "package",
        shipment.package
    );

    setText(
        "weight",
        shipment.weight
    );

    setText(
        "packageType",
        shipment.package_type
    );

    setText(
        "pieces",
        shipment.pieces
    );

    setText(
        "dimensions",
        shipment.dimensions
    );

    setText(
        "payment",
        shipment.payment
    );


    /* -----------------------------------------
       SENDER / RECEIVER
    ----------------------------------------- */

    setText(
        "senderName",
        shipment.sender_name
    );

    setText(
        "receiverName",
        shipment.receiver_name
    );


    /* -----------------------------------------
       PROGRESS
    ----------------------------------------- */

    updateProgress(
        shipment.progress
    );


    /* -----------------------------------------
       SHOW RESULT
    ----------------------------------------- */

    showTrackingResult();


    /* -----------------------------------------
       SAVE ONLY AS LOCAL CACHE
       NOT THE DATABASE SOURCE
    ----------------------------------------- */

    localStorage.setItem(
        "currentShipment",
        JSON.stringify(shipment)
    );
}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress(progress) {

    let value =
        Number(progress);

    if (
        Number.isNaN(value)
    ) {
        value = 0;
    }

    value =
        Math.max(
            0,
            Math.min(
                100,
                value
            )
        );


    const progressBar =
        getElement("progressBar");

    if (progressBar) {

        progressBar.style.width =
            value + "%";

        progressBar.textContent =
            value + "%";
    }


    const progressText =
        getElement("progressText");

    if (progressText) {

        progressText.textContent =
            value + "%";
    }


    const progressValue =
        getElement("progress");

    if (progressValue) {

        progressValue.textContent =
            value + "%";
    }
}

/* -----------------------------------------
   SHIPMENT MAP
----------------------------------------- */

displayMap(
    shipment.origin,
    shipment.location,
    shipment.destination
);

/* =========================================================
   SHIPMENT MAP
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
   FIND COORDINATES
========================================================= */

function findCoordinates(place) {

    if (!place) return null;

    const name =
        String(place).trim();

    if (locationCoordinates[name]) {
        return locationCoordinates[name];
    }

    const lower =
        name.toLowerCase();

    for (const key in locationCoordinates) {

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

function displayMap(origin, current, destination) {

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
            L.map("shipmentMap", {

                zoomControl: false,

                attributionControl: false

            });


        /* -----------------------------------------
           MAP TILES
        ----------------------------------------- */

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                minZoom: 2
            }
        ).addTo(shipmentMap);

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

    L.marker(originCoords)
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Origin</strong><br>" +
            origin
        );


    /* -----------------------------------------
       DESTINATION
    ----------------------------------------- */

    L.marker(destinationCoords)
        .addTo(shipmentMap)
        .bindPopup(
            "<strong>Destination</strong><br>" +
            destination
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
        ).addTo(shipmentMap);


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

            iconSize: [42, 42],

            iconAnchor: [21, 21]

        });


    airplaneMarker =
        L.marker(
            originCoords,
            {
                icon: airplaneIcon,

                zIndexOffset: 1000,

                interactive: false
            }
        ).addTo(shipmentMap);


    /* -----------------------------------------
       FIT MAP
    ----------------------------------------- */

    shipmentMap.fitBounds(

        L.latLngBounds(
            originCoords,
            destinationCoords
        ),

        {
            padding: [40, 40]
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
   AIRPLANE ANIMATION
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


    let startTime = null;


    function moveAirplane(timestamp) {

        if (!startTime) {
            startTime = timestamp;
        }


        const elapsed =
            timestamp - startTime;


        let progress =
            elapsed / duration;


        progress =
            Math.min(
                progress,
                1
            );


        const latitude =
            startLat +
            (
                endLat - startLat
            ) * progress;


        const longitude =
            startLng +
            (
                endLng - startLng
            ) * progress;


        airplaneMarker.setLatLng(
            [
                latitude,
                longitude
            ]
        );


        if (progress < 1) {

            airplaneAnimation =
                requestAnimationFrame(
                    moveAirplane
                );

        } else {

            startTime = null;

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
   SHOW / HIDE
   ========================================================= */

function showTrackingResult() {

    const result =
        getElement("trackingResult");

    if (result) {

        result.style.display =
            "block";
    }
}


function hideTrackingResult() {

    const result =
        getElement("trackingResult");

    if (result) {

        result.style.display =
            "none";
    }
}


/* =========================================================
   AUTO SEARCH FROM URL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const tracking =
            params.get("tracking");


        const input =
            getElement("trackingSearch");


        if (
            tracking &&
            input
        ) {

            input.value =
                tracking;

            trackShipment();
        }


        const button =
            getElement("trackButton");


        if (button) {

            button.addEventListener(
                "click",
                trackShipment
            );
        }


        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        trackShipment();
                    }

                }
            );
        }

    }
);
