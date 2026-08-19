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

    let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

document.getElementById("totalMessages").innerHTML = messages.length;

}

// ==========================================
// CUSTOMER MESSAGES
// ==========================================

let customerMessages =
    JSON.parse(localStorage.getItem("customerMessages")) || [];


function loadCustomerMessages() {

    const container =
        document.getElementById("customerMessages");

    const count =
        document.getElementById("messageCount");

    if (!container) return;

    if (count) {
        count.textContent = customerMessages.length;
    }

    if (customerMessages.length === 0) {

        container.innerHTML = `
            <div class="empty-messages">
                <div class="empty-icon">💬</div>
                <h3>No Customer Messages</h3>
                <p>Customer messages will appear here.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = customerMessages.map((message, index) => `

        <div class="message-card">

            <div class="message-header">

                <div>
                    <div class="message-name">
                        ${message.name || "Customer"}
                    </div>

                    <div class="message-email">
                        ${message.email || "No email provided"}
                    </div>
                </div>

                <div class="message-date">
                    ${message.date || ""}
                </div>

            </div>

            <div class="message-text">
                ${message.message || ""}
            </div>

            <div class="message-actions">

                <button
                    class="message-btn reply-message"
                    onclick="replyToCustomer(${index})">
                    Reply
                </button>

                <button
                    class="message-btn delete-message"
                    onclick="deleteCustomerMessage(${index})">
                    Delete
                </button>

            </div>

        </div>

    `).join("");
}


// ==========================================
// DELETE CUSTOMER MESSAGE
// ==========================================

function deleteCustomerMessage(index) {

    if (!confirm("Delete this customer message?")) {
        return;
    }

    customerMessages.splice(index, 1);

    localStorage.setItem(
        "customerMessages",
        JSON.stringify(customerMessages)
    );

    loadCustomerMessages();
}


// ==========================================
// REPLY TO CUSTOMER
// ==========================================

function replyToCustomer(index) {

    const message = customerMessages[index];

    if (!message || !message.email) {
        alert("Customer email address is not available.");
        return;
    }

    window.location.href =
        "mailto:" + message.email +
        "?subject=American Global Logistics - Customer Support";
}

// ======================================================
// DASHBOARD ACTIVITY LOG
// ======================================================

let activityLog =
    JSON.parse(localStorage.getItem("activityLog")) || [];


// ======================================================
// ADD ACTIVITY
// ======================================================

function addActivity(message, icon = "📋") {

    activityLog.unshift({

        message: message,

        icon: icon,

        time: new Date().toLocaleString()

    });

    // Keep only the latest 50 activities
    activityLog = activityLog.slice(0, 50);

    localStorage.setItem(
        "activityLog",
        JSON.stringify(activityLog)
    );

    loadActivity();
}


// ======================================================
// LOAD ACTIVITY
// ======================================================

function loadActivity() {

    const container =
        document.getElementById("activityLog");

    if (!container) return;

    if (activityLog.length === 0) {

        container.innerHTML = `
            <div class="empty-activity">
                <div class="empty-icon">📋</div>
                <h3>No Recent Activity</h3>
                <p>Dashboard activity will appear here.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = activityLog.map(activity => `

        <div class="activity-item">

            <div class="activity-icon">
                ${activity.icon || "📋"}
            </div>

            <div class="activity-content">

                <div class="activity-message">
                    ${activity.message}
                </div>

                <div class="activity-time">
                    ${activity.time}
                </div>

            </div>

        </div>

    `).join("");
}

// ======================================================
// LOAD SHIPMENT TABLE
// ======================================================

function loadShipments() {

    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    let table = document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    shipments.forEach(function (shipment, index) {

        table.innerHTML += `
        <tr>
            <td>${shipment.tracking}</td>
            <td>${shipment.senderName}</td>
            <td>${shipment.receiverName}</td>
            <td>${shipment.status}</td>
            <td>${shipment.progress}%</td>

            <td>
                <button onclick="editShipment(${index})">
                    Edit
                </button>

                <button onclick="deleteShipment(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

    updateDashboard();

}

function editShipment(index){

    currentShipmentIndex = index;

    let shipment = shipments[index];

    document.getElementById("editTracking").value =
        shipment.tracking || "";

    document.getElementById("editStatus").value =
        shipment.status || "";

    document.getElementById("editLocation").value =
        shipment.location || "";

    document.getElementById("editDelivery").value =
        shipment.delivery || "";

    document.getElementById("editInstructions").value =
        shipment.instructions || "";

    // Scroll to the edit form
    document.getElementById("editPanel")
        .scrollIntoView({
            behavior: "smooth"
        });

        }

// ======================================================
// NEW SHIPMENT
// ======================================================

function newShipment() {

    currentShipmentIndex = -1;

    const tracking =
        "AGL-" +
        new Date().getFullYear() +
        "-" +
        Math.floor(100000 + Math.random() * 900000);

    document.getElementById("trackingSearch").value = tracking;

    document.getElementById("senderUpdate").value = "";
    document.getElementById("receiverUpdate").value = "";
    document.getElementById("statusUpdate").value = "Shipment Created";
    document.getElementById("locationUpdate").value = "";
    document.getElementById("deliveryUpdate").value = "";
    document.getElementById("routeUpdate").value = "";
    document.getElementById("progressUpdate").value = 0;
    document.getElementById("originUpdate").value = "";
    document.getElementById("destinationUpdate").value = "";
    document.getElementById("packageUpdate").value = "";
    document.getElementById("weightUpdate").value = "";
    document.getElementById("serviceUpdate").value = "Air Freight";
    document.getElementById("historyUpdate").value = "";

    alert("New tracking number created:\n" + tracking);
}

// ======================================================
// UPDATE SHIPMENT
// ======================================================

function updateShipment() {

    // Create a new shipment if none is selected
if (currentShipmentIndex === -1) {

    currentShipmentIndex = shipments.length;

    shipments.push({
        tracking: document.getElementById("trackingSearch").value,
        senderName: "",
        receiverName: "",
        status: "Shipment Created",
        location: "",
        delivery: "",
        route: "",
        progress: 0,
        origin: "",
        destination: "",
        package: "",
        weight: "",
        service: "Air Freight",
        history: ""
    });

}

    shipments[currentShipmentIndex].tracking =
        document.getElementById("editTracking").value;

    shipments[currentShipmentIndex].status =
        document.getElementById("editStatus").value;

    shipments[currentShipmentIndex].location =
        document.getElementById("editLocation").value;

    shipments[currentShipmentIndex].delivery =
        document.getElementById("editDelivery").value;

    shipments[currentShipmentIndex].instructions =
        document.getElementById("editInstructions").value;

    saveShipments();
    loadShipments();

    alert("Shipment updated successfully!");
}

    // ----------------------------
    // Read form values
    // ----------------------------

    shipment.status = document.getElementById("statusUpdate").value;
    shipment.location = document.getElementById("locationUpdate").value;
    shipment.delivery = document.getElementById("deliveryUpdate").value;

    shipment.senderName =
    document.getElementById("senderUpdate").value;

    shipment.receiverName =
    document.getElementById("receiverUpdate").value;

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
    drawRoute(shipment.origin, shipment.destination);
    animateVehicle(shipment.origin, shipment.destination);

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

    const shipment = {
    tracking: document.getElementById("editTracking").value,
    status: document.getElementById("editStatus").value,
    location: document.getElementById("editLocation").value,
    delivery: document.getElementById("editDelivery").value,
    instructions: document.getElementById("editInstructions").value
};

if(currentShipmentIndex === -1){
    shipments.push(shipment);
}else{
    shipments[currentShipmentIndex] = shipment;
}

saveShipments();
loadShipments();

alert(currentShipmentIndex === -1
    ? "New shipment created successfully!"
    : "Shipment updated successfully!");

// ======================================================
// DELETE CURRENT SHIPMENT
// ======================================================

function deleteShipment(index) {

    const deletedShipment = shipments[index];

    if (!deletedShipment) return;

    const tracking =
        deletedShipment.tracking || "Unknown shipment";

    shipments.splice(index, 1);

    saveShipments();

    loadShipments();

    updateDashboard();

    addActivity(
        `Shipment ${tracking} was deleted`,
        "🗑️"
    );
}

    // Clear the edit form
    document.getElementById("editTracking").value = "";
    document.getElementById("editStatus").value = "";
    document.getElementById("editLocation").value = "";
    document.getElementById("editDelivery").value = "";
    document.getElementById("editInstructions").value = "";

    alert("Shipment deleted successfully!");

}

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
// ======================================================
// ANIMATE VEHICLE
// ======================================================

function animateVehicle(origin, destination) {

    if (!cities[origin] || !cities[destination]) {
        return;
    }

    let start = cities[origin];
    let end = cities[destination];

    if (movingVehicle) {
        adminMap.removeLayer(movingVehicle);
    }

    movingVehicle = L.marker(start, {
        icon: vehicleIcon
    }).addTo(adminMap);

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

        }
// ======================================================
// PAGE INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // Load shipment table
    loadShipments();
loadCustomerMessages();
loadActivity();

    // Update dashboard cards
    updateDashboard();

    // Initialize interactive map
    initializeMap();

    console.log("American Global Logistics Admin Dashboard Ready");

});

// Load Customer Messages

function loadMessages(){

    let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

    let table = document.getElementById("messageTable");

let alertBox = document.getElementById("newMessageAlert");

if(messages.length > 0){

    alertBox.innerHTML = "🔔 New customer enquiries!";

}else{

    alertBox.innerHTML = "";

}
    if(!table){
        return;
    }


    table.innerHTML = "";


    messages.forEach(function(message,index){


        let row = `

        <tr>

            <td>${message.name}</td>

            <td>${message.email}</td>

            <td>${message.phone}</td>

            <td>${message.subject}</td>

            <td>${message.message}</td>

            <td>${message.date}</td>

            <td>

<a href="mailto:${message.email}?subject=Reply from American Global Logistics"
style="background:#0b4ea2;color:white;padding:8px 12px;border-radius:5px;text-decoration:none;display:inline-block;margin-bottom:5px;">
📧 Reply
</a>

<button onclick="deleteMessage(${index})">
🗑 Delete
</button>

</td>

        </tr>

        `;


        table.innerHTML += row;


    });


}


function deleteMessage(index){

let confirmDelete = confirm(
"Are you sure you want to delete this message?"
);

if(confirmDelete){

let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

messages.splice(index,1);

localStorage.setItem(
"contactMessages",
JSON.stringify(messages)
);

loadMessages();
updateDashboard();

}

}

// =========================
// Admin Activity Log
// =========================

function addActivity(activity){

    let logs = JSON.parse(localStorage.getItem("adminActivity")) || [];

    logs.unshift({

        date: new Date().toLocaleString(),

        activity: activity

    });

    localStorage.setItem("adminActivity", JSON.stringify(logs));

    loadActivity();

}


function loadActivity(){

    let logs = JSON.parse(localStorage.getItem("adminActivity")) || [];

    let table = document.getElementById("activityTable");

    if(!table) return;

    table.innerHTML = "";

    logs.forEach(function(log){

        table.innerHTML += `

        <tr>

            <td>${log.date}</td>

            <td>${log.activity}</td>

        </tr>

        `;

    });

      }

// ===========================================
// LIVE SHIPMENT STATISTICS - V4
// ===========================================

function updateLiveStatistics() {

    // Get the latest shipment data
    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    let total = shipments.length;
    let inTransit = 0;
    let delivered = 0;
    let awaiting = 0;

    shipments.forEach(function (shipment) {

        const status = (shipment.status || "").toLowerCase();

        if (status === "delivered") {
            delivered++;
        }

        else if (
            status === "in transit" ||
            status === "customs cleared" ||
            status === "arrived at destination hub" ||
            status === "out for delivery"
        ) {
            inTransit++;
        }

        else if (
            status === "awaiting pickup" ||
            status === "shipment created" ||
            status === "picked up"
        ) {
            awaiting++;
        }

    });

    // Update dashboard numbers
    const totalElement = document.getElementById("totalShipments");
    const transitElement = document.getElementById("inTransit");
    const deliveredElement = document.getElementById("delivered");
    const awaitingElement = document.getElementById("awaiting");

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (transitElement) {
        transitElement.textContent = inTransit;
    }

    if (deliveredElement) {
        deliveredElement.textContent = delivered;
    }

    if (awaitingElement) {
    awaitingElement.textContent = awaiting;
}

} // End updateLiveStatistics()


// Initial statistics update
updateLiveStatistics();

// Keep statistics synchronized
window.addEventListener("storage", function () {
    updateLiveStatistics();
});

loadShipments();


