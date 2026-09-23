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
    "PASTE_YOUR_EXISTING_SUPABASE_KEY_HERE";


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
