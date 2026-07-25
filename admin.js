
// ===============================
// American Global Logistics
// Admin Dashboard JavaScript
// ===============================
alert("admin.js loaded");
// Load shipments
let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

// Currently selected shipment
let currentShipmentIndex = -1;
const airportMarker = L.AwesomeMarkers.icon({
    icon: "plane",
    prefix: "fa",
    markerColor: "blue"
});

const warehouseMarker = L.AwesomeMarkers.icon({
    icon: "warehouse",
    prefix: "fa",
    markerColor: "green"
});

const seaportMarker = L.AwesomeMarkers.icon({
    icon: "ship",
    prefix: "fa",
    markerColor: "cadetblue"
});

const truckMarker = L.AwesomeMarkers.icon({
    icon: "truck",
    prefix: "fa",
    markerColor: "orange"
});
let progress = 0;

let animation = setInterval(function () {

    progress += 0.01;

    if (progress >= 1) {

        clearInterval(animation);

        movingVehicle.setLatLng(end);

        return;

    }

    let lat = start[0] + (end[0] - start[0]) * progress;

    let lng = start[1] + (end[1] - start[1]) * progress;

    movingVehicle.setLatLng([lat, lng]);

}, 100);
const destinationMarker = L.AwesomeMarkers.icon({
    icon: "location-dot",
    prefix: "fa",
    markerColor: "red"
});
let adminMap;
let routeLine;
let originMarker;
let destinationMarker;
let movingVehicle = null;
const vehicleMarker = L.AwesomeMarkers.icon({
    icon: "plane",
    prefix: "fa",
    markerColor: "blue"
});

let cities = {

    // North America
    "New York": [40.7128, -74.0060],
    "Los Angeles": [34.0522, -118.2437],
    "Chicago": [41.8781, -87.6298],
    "Miami": [25.7617, -80.1918],
    "Toronto": [43.6532, -79.3832],
    "Vancouver": [49.2827, -123.1207],
    "Mexico City": [19.4326, -99.1332],

    // Central America & Caribbean
    "Guatemala": [14.6349, -90.5069],
    "Costa Rica": [9.7489, -83.7534],
    "Panama City": [8.9824, -79.5199],
    "Kingston": [17.9712, -76.7936],

    // South America
    "Bogota": [4.7110, -74.0721],
    "Lima": [-12.0464, -77.0428],
    "Sao Paulo": [-23.5505, -46.6333],
    "Rio de Janeiro": [-22.9068, -43.1729],
    "Buenos Aires": [-34.6037, -58.3816],
    "Santiago": [-33.4489, -70.6693],

    // Europe
    "London": [51.5074, -0.1278],
    "Paris": [48.8566, 2.3522],
    "Amsterdam": [52.3676, 4.9041],
    "Frankfurt": [50.1109, 8.6821],
    "Madrid": [40.4168, -3.7038],
    "Rome": [41.9028, 12.4964],
    "Warsaw": [52.2297, 21.0122],
    "Moscow": [55.7558, 37.6173],

    // Africa
    "Nairobi": [-1.2864, 36.8172],
    "Johannesburg": [-26.2041, 28.0473],
    "Cape Town": [-33.9249, 18.4241],
    "Lagos": [6.5244, 3.3792],
    "Cairo": [30.0444, 31.2357],
    "Casablanca": [33.5731, -7.5898],
    "Addis Ababa": [8.9806, 38.7578],

    // Middle East
    "Dubai": [25.2048, 55.2708],
    "Abu Dhabi": [24.4539, 54.3773],
    "Doha": [25.2854, 51.5310],
    "Riyadh": [24.7136, 46.6753],
    "Istanbul": [41.0082, 28.9784],

    // Asia
    "Singapore": [1.3521, 103.8198],
    "Hong Kong": [22.3193, 114.1694],
    "Tokyo": [35.6762, 139.6503],
    "Seoul": [37.5665, 126.9780],
    "Beijing": [39.9042, 116.4074],
    "Shanghai": [31.2304, 121.4737],
    "Bangkok": [13.7563, 100.5018],
    "Mumbai": [19.0760, 72.8777],
    "Delhi": [28.6139, 77.2090],
    "Kuala Lumpur": [3.1390, 101.6869],

    // Oceania
    "Sydney": [-33.8688, 151.2093],
    "Melbourne": [-37.8136, 144.9631],
    "Auckland": [-36.8509, 174.7645]
};
const warehouseIcon = L.icon({
    iconUrl: "image/warehouse.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});

const airportIcon = L.icon({
    iconUrl: "image/airport.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});

const seaportIcon = L.icon({
    iconUrl: "image/seaport.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});

const truckIcon = L.icon({
    iconUrl: "image/truck-terminal.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});
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

    let icon = airportIcon;

if (
    city === "Dubai" ||
    city === "Singapore" ||
    city === "London" ||
    city === "New York" ||
    city === "Tokyo"
){
    icon = airportIcon;
}
else if(
    city === "Los Angeles" ||
    city === "Rotterdam" ||
    city === "Panama City"
){
    icon = seaportIcon;
}
else if(
    city === "Nairobi" ||
    city === "Johannesburg"
){
    icon = truckIcon;
}
else{
    icon = warehouseIcon;
}

let marker = L.marker(cities[city], {
    icon: icon
}).addTo(adminMap);

    marker.bindPopup("<strong>" + city + "</strong>");

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
                cities[document.getElementById("originUpdate").value],
                cities[city]
            ],{
                color:"#0b4ea2",
                weight:5
            }).addTo(adminMap);
let start = cities[document.getElementById("originUpdate").value];
let end = cities[city];

if (movingVehicle) {
    adminMap.removeLayer(movingVehicle);
}

movingVehicle = L.marker(start, {
    icon: vehicleMarker
}).addTo(adminMap);
            document.getElementById("routeUpdate").value =
                document.getElementById("originUpdate").value +
                " → " + city;

            selectingOrigin = true;

            alert("Destination selected: " + city);

        }

    });

});
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
