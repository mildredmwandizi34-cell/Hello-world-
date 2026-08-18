// ======================================================
// American Global Logistics
// Admin Dashboard v3.0
// ======================================================

alert("American Global Logistics Admin Dashboard Loaded");

// ======================================================
// GLOBAL VARIABLES
// ======================================================

let shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

let currentShipmentIndex = -1;

// ======================================================
// MAP VARIABLES
// ======================================================

let adminMap = null;
let routeLine = null;
let originMarker = null;
let destinationMarker = null;
let movingVehicle = null;

let selectingOrigin = true;

// ======================================================
// SAVE TO LOCAL STORAGE
// ======================================================

function saveShipments(){

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

}

// ======================================================
// GENERATE UNIQUE TRACKING NUMBER
// ======================================================

function generateTrackingNumber(){

    let tracking;

    do{

        tracking =
            "AGL-" +
            Date.now().toString().slice(-8);

    }while(
        shipments.some(function(shipment){
            return shipment.tracking === tracking;
        })
    );

    return tracking;

}
