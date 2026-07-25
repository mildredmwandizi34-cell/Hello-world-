// ======================================================
// American Global Logistics
// Admin Dashboard v2.0
// ======================================================

alert("American Global Logistics Admin Dashboard Loaded");

// ------------------------------
// Local Storage
// ------------------------------

let shipments =
JSON.parse(localStorage.getItem("shipments")) || [];

let currentShipmentIndex = -1;

// ------------------------------
// Dashboard Map Variables
// ------------------------------

let adminMap;
let routeLine = null;
let originMarker = null;
let destinationMarker = null;
let movingVehicle = null;

let selectingOrigin = true;

// ------------------------------
// Dashboard Icons
// ------------------------------

const airportIcon = L.AwesomeMarkers.icon({
    icon: "plane",
    prefix: "fa",
    markerColor: "blue"
});

const warehouseIcon = L.AwesomeMarkers.icon({
    icon: "warehouse",
    prefix: "fa",
    markerColor: "green"
});

const seaportIcon = L.AwesomeMarkers.icon({
    icon: "ship",
    prefix: "fa",
    markerColor: "cadetblue"
});

const truckIcon = L.AwesomeMarkers.icon({
    icon: "truck",
    prefix: "fa",
    markerColor: "orange"
});

const destinationIcon = L.AwesomeMarkers.icon({
    icon: "location-dot",
    prefix: "fa",
    markerColor: "red"
});

const vehicleIcon = L.AwesomeMarkers.icon({
    icon: "plane",
    prefix: "fa",
    markerColor: "blue"
});
// ======================================================
// WORLD LOGISTICS HUBS
// ======================================================

const cities = {

    // ===== NORTH AMERICA =====
    "New York":[40.7128,-74.0060],
    "Los Angeles":[34.0522,-118.2437],
    "Chicago":[41.8781,-87.6298],
    "Miami":[25.7617,-80.1918],
    "Houston":[29.7604,-95.3698],
    "Atlanta":[33.7490,-84.3880],
    "Seattle":[47.6062,-122.3321],
    "Toronto":[43.6532,-79.3832],
    "Vancouver":[49.2827,-123.1207],
    "Montreal":[45.5019,-73.5674],
    "Mexico City":[19.4326,-99.1332],
    "Panama City":[8.9824,-79.5199],

    // ===== SOUTH AMERICA =====
    "Bogota":[4.7110,-74.0721],
    "Lima":[-12.0464,-77.0428],
    "Sao Paulo":[-23.5505,-46.6333],
    "Rio de Janeiro":[-22.9068,-43.1729],
    "Buenos Aires":[-34.6037,-58.3816],
    "Santiago":[-33.4489,-70.6693],

    // ===== EUROPE =====
    "London":[51.5074,-0.1278],
    "Manchester":[53.4808,-2.2426],
    "Paris":[48.8566,2.3522],
    "Amsterdam":[52.3676,4.9041],
    "Rotterdam":[51.9244,4.4777],
    "Frankfurt":[50.1109,8.6821],
    "Hamburg":[53.5511,9.9937],
    "Madrid":[40.4168,-3.7038],
    "Barcelona":[41.3874,2.1686],
    "Rome":[41.9028,12.4964],
    "Warsaw":[52.2297,21.0122],

    // ===== AFRICA =====
    "Nairobi":[-1.2864,36.8172],
    "Mombasa":[-4.0435,39.6682],
    "Johannesburg":[-26.2041,28.0473],
    "Cape Town":[-33.9249,18.4241],
    "Lagos":[6.5244,3.3792],
    "Cairo":[30.0444,31.2357],
    "Casablanca":[33.5731,-7.5898],
    "Addis Ababa":[8.9806,38.7578],

    // ===== MIDDLE EAST =====
    "Dubai":[25.2048,55.2708],
    "Abu Dhabi":[24.4539,54.3773],
    "Doha":[25.2854,51.5310],
    "Riyadh":[24.7136,46.6753],
    "Jeddah":[21.4858,39.1925],

    // ===== ASIA =====
    "Singapore":[1.3521,103.8198],
    "Hong Kong":[22.3193,114.1694],
    "Tokyo":[35.6762,139.6503],
    "Osaka":[34.6937,135.5023],
    "Seoul":[37.5665,126.9780],
    "Beijing":[39.9042,116.4074],
    "Shanghai":[31.2304,121.4737],
    "Shenzhen":[22.5431,114.0579],
    "Guangzhou":[23.1291,113.2644],
    "Bangkok":[13.7563,100.5018],
    "Mumbai":[19.0760,72.8777],
    "Delhi":[28.6139,77.2090],
    "Chennai":[13.0827,80.2707],
    "Kuala Lumpur":[3.1390,101.6869],

    // ===== OCEANIA =====
    "Sydney":[-33.8688,151.2093],
    "Melbourne":[-37.8136,144.9631],
    "Perth":[-31.9505,115.8605],
    "Auckland":[-36.8509,174.7645]

};
// ======================================================
// INITIALIZE ADMIN MAP
// ======================================================

function initializeMap() {

    adminMap = L.map("adminMap").setView([20, 0], 2);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 18
        }
    ).addTo(adminMap);

    // Add all logistics hubs
    Object.keys(cities).forEach(function(city){

        let marker = L.marker(cities[city], {
            icon: warehouseIcon
        }).addTo(adminMap);

        marker.bindPopup("<strong>" + city + "</strong>");

        marker.on("click", function(){

            // ---------- Select Origin ----------
            if(selectingOrigin){

                document.getElementById("originUpdate").value = city;

                if(originMarker){
                    adminMap.removeLayer(originMarker);
                }

                originMarker = L.marker(cities[city], {
                    icon: warehouseIcon
                }).addTo(adminMap);

                selectingOrigin = false;

                alert("Origin selected: " + city);

            }

            // ---------- Select Destination ----------
            else{

                document.getElementById("destinationUpdate").value = city;

                if(destinationMarker){
                    adminMap.removeLayer(destinationMarker);
                }

                destinationMarker = L.marker(cities[city], {
                    icon: destinationIcon
                }).addTo(adminMap);

                document.getElementById("routeUpdate").value =
                    document.getElementById("originUpdate").value +
                    " → " +
                    city;

                selectingOrigin = true;

                alert("Destination selected: " + city);

            }

        });

    });

    }
// ======================================================
// SAVE SHIPMENTS
// ======================================================

function saveShipments() {
    localStorage.setItem("shipments", JSON.stringify(shipments));
}

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateDashboard() {

    document.getElementById("totalShipments").textContent = shipments.length;

    let inTransit = shipments.filter(s => s.status === "In Transit").length;
    let delivered = shipments.filter(s => s.status === "Delivered").length;
    let awaiting = shipments.filter(s => s.status === "Awaiting Pickup").length;

    document.getElementById("inTransit").textContent = inTransit;
    document.getElementById("delivered").textContent = delivered;
    document.getElementById("awaiting").textContent = awaiting;

}

// ======================================================
// LOAD SHIPMENT TABLE
// ======================================================

function loadShipments() {

    let table = document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    shipments.forEach(function(shipment){

        table.innerHTML += `
        <tr>

            <td>${shipment.tracking}</td>

            <td>${shipment.sender}</td>

            <td>${shipment.receiver}</td>

            <td>${shipment.status}</td>

            <td>${shipment.progress}%</td>

        </tr>
        `;

    });

    updateDashboard();

}
// ======================================================
// LOAD SHIPMENT
// ======================================================

function loadShipment() {

    let tracking = document.getElementById("trackingSearch")
        .value
        .trim()
        .toUpperCase();

    if (tracking === "") {
        alert("Please enter a tracking number.");
        return;
    }

    currentShipmentIndex = shipments.findIndex(function(shipment) {
        return shipment.tracking.toUpperCase() === tracking;
    });

    if (currentShipmentIndex === -1) {
        alert("Shipment not found.");
        return;
    }

    let shipment = shipments[currentShipmentIndex];

    document.getElementById("statusUpdate").value =
        shipment.status || "";

    document.getElementById("locationUpdate").value =
        shipment.location || "";

    document.getElementById("deliveryUpdate").value =
        shipment.delivery || "";

    document.getElementById("routeUpdate").value =
        shipment.route || "";

    document.getElementById("progressUpdate").value =
        shipment.progress || 0;

    document.getElementById("senderUpdate").value =
        shipment.sender || "";

    document.getElementById("receiverUpdate").value =
        shipment.receiver || "";

    document.getElementById("originUpdate").value =
        shipment.origin || "";

    document.getElementById("destinationUpdate").value =
        shipment.destination || "";

    document.getElementById("packageUpdate").value =
        shipment.package || "";

    document.getElementById("weightUpdate").value =
        shipment.weight || "";

    document.getElementById("serviceUpdate").value =
        shipment.service || "Air Freight";

    document.getElementById("historyUpdate").value =
        shipment.history || "";

    alert("Shipment loaded successfully.");

}
// ======================================================
// UPDATE SHIPMENT
// ======================================================

function updateShipment() {

    if (currentShipmentIndex === -1) {
        alert("Please load a shipment first.");
        return;
    }

    let shipment = shipments[currentShipmentIndex];

    // ----------------------------
    // Read form values
    // ----------------------------

    shipment.status = document.getElementById("statusUpdate").value;
    shipment.location = document.getElementById("locationUpdate").value;
    shipment.delivery = document.getElementById("deliveryUpdate").value;

    shipment.sender = document.getElementById("senderUpdate").value;
    shipment.receiver = document.getElementById("receiverUpdate").value;

    shipment.origin = document.getElementById("originUpdate").value;
    shipment.destination = document.getElementById("destinationUpdate").value;

    shipment.package = document.getElementById("packageUpdate").value;
    shipment.weight = document.getElementById("weightUpdate").value;

    shipment.service = document.getElementById("serviceUpdate").value;

    // ----------------------------
    // Generate Route
    // ----------------------------

    shipment.route = shipment.origin + " → " + shipment.destination;

    document.getElementById("routeUpdate").value =
        shipment.route;

    // ----------------------------
    // Automatic Progress
    // ----------------------------

    switch (shipment.status) {

        case "Shipment Created":
            shipment.progress = 5;
            break;

        case "Awaiting Pickup":
            shipment.progress = 10;
            break;

        case "Picked Up":
            shipment.progress = 25;
            break;

        case "In Transit":
            shipment.progress = 50;
            break;

        case "Customs Cleared":
            shipment.progress = 70;
            break;

        case "Arrived at Destination Hub":
            shipment.progress = 85;
            break;

        case "Out for Delivery":
            shipment.progress = 95;
            break;

        case "Delivered":
            shipment.progress = 100;
            break;

        default:
            shipment.progress = 0;

    }

    document.getElementById("progressUpdate").value =
        shipment.progress;

    // ----------------------------
    // Shipment History
    // ----------------------------

    if (!shipment.history) {
        shipment.history = "";
    }

    let time = new Date().toLocaleString();

    shipment.history +=
        "• " +
        shipment.status +
        " - " +
        shipment.location +
        " (" +
        time +
        ")\n";

    document.getElementById("historyUpdate").value =
        shipment.history;

    // ----------------------------
    // Save Changes
    // ----------------------------

    shipments[currentShipmentIndex] = shipment;

    saveShipments();

    loadShipments();

    updateDashboard();

    alert("Shipment updated successfully.");

        }
// ======================================================
// DELETE CURRENT SHIPMENT
// ======================================================

function deleteCurrentShipment() {

    if (currentShipmentIndex === -1) {
        alert("Please load a shipment first.");
        return;
    }

    let confirmDelete = confirm(
        "Are you sure you want to delete this shipment?"
    );

    if (!confirmDelete) {
        return;
    }

    shipments.splice(currentShipmentIndex, 1);

    saveShipments();

    currentShipmentIndex = -1;

    loadShipments();

    updateDashboard();

    // Clear the form

    document.getElementById("trackingSearch").value = "";

    document.getElementById("statusUpdate").value = "Shipment Created";
    document.getElementById("locationUpdate").value = "";
    document.getElementById("deliveryUpdate").value = "";
    document.getElementById("routeUpdate").value = "";
    document.getElementById("progressUpdate").value = 0;

    document.getElementById("senderUpdate").value = "";
    document.getElementById("receiverUpdate").value = "";
    document.getElementById("originUpdate").value = "";
    document.getElementById("destinationUpdate").value = "";

    document.getElementById("packageUpdate").value = "";
    document.getElementById("weightUpdate").value = "";
    document.getElementById("serviceUpdate").value = "Air Freight";
    document.getElementById("historyUpdate").value = "";

    alert("Shipment deleted successfully.");

}
// ======================================================
// DRAW SHIPMENT ROUTE
// ======================================================

function drawRoute(origin, destination) {

    if (!cities[origin] || !cities[destination]) {
        return;
    }

    // Remove old route
    if (routeLine) {
        adminMap.removeLayer(routeLine);
    }

    if (originMarker) {
        adminMap.removeLayer(originMarker);
    }

    if (destinationMarker) {
        adminMap.removeLayer(destinationMarker);
    }

    if (movingVehicle) {
        adminMap.removeLayer(movingVehicle);
    }

    let start = cities[origin];
    let end = cities[destination];

    // Origin marker
    originMarker = L.marker(start, {
        icon: warehouseIcon
    }).addTo(adminMap);

    // Destination marker
    destinationMarker = L.marker(end, {
        icon: destinationIcon
    }).addTo(adminMap);

    // Route line
    routeLine = L.polyline(
        [start, end],
        {
            color: "#0b4ea2",
            weight: 5
        }
    ).addTo(adminMap);

    adminMap.fitBounds(routeLine.getBounds());

    // Vehicle starts at origin
    movingVehicle = L.marker(start, {
        icon: vehicleIcon
    }).addTo(adminMap);

        }
