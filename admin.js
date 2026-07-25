
// ===============================
// American Global Logistics
// Admin Dashboard JavaScript
// ===============================
alert("admin.js loaded");
// Load shipments
let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

// Currently selected shipment
let currentShipmentIndex = -1;
let adminMap;
let routeLine;
let originMarker;
let destinationMarker;
let cities = {
    "New York": [40.7128, -74.0060],
    "London": [51.5074, -0.1278],
    "Los Angeles": [34.0522, -118.2437],
    "Dubai": [25.2048, 55.2708],
    "Nairobi": [-1.2864, 36.8172],
    "Costa Rica": [9.7489, -83.7534],
    "Guatemala": [14.6349, -90.5069]
};

let selectingOrigin = true;
// Save shipments
function saveShipments() {
    localStorage.setItem("shipments", JSON.stringify(shipments));
}

// -------------------------------
// Dashboard Statistics
// -------------------------------

function updateDashboard() {

    document.getElementById("totalShipments").innerHTML = shipments.length;

    let transit = shipments.filter(s => s.status === "In Transit").length;
    let delivered = shipments.filter(s => s.status === "Delivered").length;
    let awaiting = shipments.filter(s => s.status === "Awaiting Pickup").length;

    document.getElementById("inTransit").innerHTML = transit;
    document.getElementById("delivered").innerHTML = delivered;
    document.getElementById("awaiting").innerHTML = awaiting;

}

// -------------------------------
// Display Shipments
// -------------------------------

function loadShipments() {

    let table = document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    shipments.forEach(function(s){

        table.innerHTML += `
        <tr>

        <td>${s.tracking}</td>

        <td>${s.sender}</td>

        <td>${s.receiver}</td>

        <td>${s.status}</td>

        <td>${s.progress}%</td>

        </tr>
        `;

    });

    updateDashboard();

}

// -------------------------------
// Load Shipment
// -------------------------------

function loadShipment(){

    alert("Load Shipment button clicked");

    let tracking = document.getElementById("trackingSearch").value.trim().toUpperCase();

    let shipments = JSON.parse(localStorage.getItem("shipments")) || [];
console.log(shipments);
alert(JSON.stringify(shipments));
currentShipmentIndex = shipments.findIndex(function(s){
    return s.tracking.toUpperCase() === tracking;
});

if(currentShipmentIndex === -1){
    alert("Shipment not found!");
    return;
}

let shipment = shipments[currentShipmentIndex];

if(!shipment){
alert("Shipment not found!");
return;
}


document.getElementById("statusUpdate").value = shipment.status || "";

document.getElementById("locationUpdate").value = shipment.location || "";

document.getElementById("deliveryUpdate").value = shipment.delivery || "";

document.getElementById("routeUpdate").value = shipment.route || "";

document.getElementById("progressUpdate").value = shipment.progress || 0;

document.getElementById("senderUpdate").value = shipment.sender || "";

document.getElementById("receiverUpdate").value = shipment.receiver || "";
document.getElementById("originUpdate").value =
    shipment.origin || "";

document.getElementById("destinationUpdate").value =
    shipment.destination || "";
document.getElementById("packageUpdate").value = shipment.package || "";

document.getElementById("weightUpdate").value = shipment.weight || "";

document.getElementById("historyUpdate").value = shipment.history || "";

}

// -------------------------------
// Update Shipment
// -------------------------------

function updateShipment() {

    let tracking = document.getElementById("trackingSearch").value.trim().toUpperCase();

    currentShipmentIndex = shipments.findIndex(function(s) {
        return String(s.tracking).trim().toUpperCase() === tracking;
    });

    if (currentShipmentIndex === -1) {
        alert("Shipment not found!");
        return;
    }

    let shipment = shipments[currentShipmentIndex];

    if (!shipment) {
        alert("Shipment not found!");
        return;
    }

    // Get selected status
    let status = document.getElementById("statusUpdate").value;

    shipment.status = status;
    shipment.location = document.getElementById("locationUpdate").value;
shipment.delivery = document.getElementById("deliveryUpdate").value;
shipment.route = document.getElementById("routeUpdate").value;
    // Automatically set progress
    switch (status) {

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

    // Show the automatic progress in the dashboard
    document.getElementById("progressUpdate").value = shipment.progress;

    // Add a new history entry with the correct icon
let time = new Date().toLocaleString();

if (!shipment.history) {
    shipment.history = "";
}

let icon = "";

switch (shipment.status) {

    case "Shipment Created":
        icon = "📦";
        break;

    case "Awaiting Pickup":
        icon = "📍";
        break;

    case "Picked Up":
        icon = "🚚";
        break;

    case "In Transit":
        icon = "✈️";
        break;

    case "Customs Cleared":
        icon = "🛃";
        break;

    case "Arrived at Destination Hub":
        icon = "🏢";
        break;

    case "Out for Delivery":
        icon = "🚛";
        break;

    case "Delivered":
        icon = "✅";
        break;

    default:
        icon = "📌";
}

shipment.sender = document.getElementById("senderUpdate").value;
shipment.receiver = document.getElementById("receiverUpdate").value;
shipment.origin =
    document.getElementById("originUpdate").value;

shipment.destination =
    document.getElementById("destinationUpdate").value; 
    shipment.origin = document.getElementById("originUpdate").value;
shipment.destination = document.getElementById("destinationUpdate").value;

shipment.route = shipment.origin + " → " + shipment.destination;

document.getElementById("routeUpdate").value = shipment.route;
shipment.package = document.getElementById("packageUpdate").value;
shipment.weight = document.getElementById("weightUpdate").value;
let serviceInput = document.getElementById("serviceUpdate");

if (serviceInput) {
    shipment.service = serviceInput.value;
}

shipment.history += `
<div class="timeline-item">

    <div class="timeline-icon">
        ${icon}
    </div>

    <div class="timeline-title">
        ${shipment.status}
    </div>

    <div class="timeline-location">
        📍 ${shipment.location}
    </div>

    <div class="timeline-time">
        🕒 ${time}
    </div>

</div>
`;
saveShipments();

loadShipments();

alert("Shipment updated successfully!");

}
// -------------------------------
// Delete Shipment
// -------------------------------

function deleteCurrentShipment(){

    if(currentShipmentIndex === -1){

        alert("Load a shipment first.");

        return;

    }

    if(confirm("Delete this shipment?")){

        shipments.splice(currentShipmentIndex,1);

        saveShipments();

        loadShipments();

        currentShipmentIndex = -1;

        document.getElementById("trackingSearch").value = "";

        alert("Shipment deleted.");

    }

}

// -------------------------------
// Page Load
// -------------------------------

document.addEventListener("DOMContentLoaded", function () {

    loadShipments();

    // Create the map
    adminMap = L.map("adminMap").setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(adminMap);
Object.keys(cities).forEach(function(city){

    let marker = L.marker(cities[city]).addTo(adminMap);

    marker.bindPopup(city);

    marker.on("click", function(){

        if(selectingOrigin){

            document.getElementById("originUpdate").value = city;

            if(originMarker){
                adminMap.removeLayer(originMarker);
            }

            originMarker = L.marker(cities[city]).addTo(adminMap);

            selectingOrigin = false;

            alert("Origin selected: " + city);

        }else{

            document.getElementById("destinationUpdate").value = city;

            if(destinationMarker){
                adminMap.removeLayer(destinationMarker);
            }

            destinationMarker = L.marker(cities[city]).addTo(adminMap);

            if(routeLine){
                adminMap.removeLayer(routeLine);
            }

            routeLine = L.polyline([
                cities[
                    document.getElementById("originUpdate").value
                ],
                cities[city]
            ],{
                color:"#0b4ea2",
                weight:5
            }).addTo(adminMap);

            document.getElementById("routeUpdate").value =
                document.getElementById("originUpdate").value +
                " → " + city;

            selectingOrigin = true;

            alert("Destination selected: " + city);

        }

    });

});
});
