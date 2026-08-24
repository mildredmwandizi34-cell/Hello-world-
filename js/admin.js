========================================================
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
    "contactMessages",
    JSON.stringify(messages)
);

loadCustomerMessages();

updateDashboard();

addActivity(
    "A customer message was deleted",
    "💬"
);


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
// AUTOMATIC LOCAL STORAGE SYNCHRONIZATION
// ======================================================

function syncDashboard() {

    // Reload shipments
    shipments =
        JSON.parse(localStorage.getItem("shipments")) || [];

    // Refresh shipment table
    loadShipments();

    // Refresh dashboard statistics
    updateDashboard();

    // Refresh customer messages
    loadCustomerMessages();

    // Refresh activity log
    loadActivity();
}
    
    // ======================================================
// LISTEN FOR STORAGE CHANGES
// ======================================================

window.addEventListener("storage", function (event) {

    if (
        event.key === "shipments" ||
        event.key === "contactMessages" ||
        event.key === "activityLog"
    ) {

        syncDashboard();

    }

});

    // ======================================================
// DASHBOARD AUTO REFRESH
// ======================================================

setInterval(function () {

    syncDashboard();

}, 5000);
    
// ======================================================
// LOAD SHIPMENT TABLE
// ======================================================

function loadShipments() {

    shipments =
        JSON.parse(localStorage.getItem("shipments")) || [];

    const table =
        document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    shipments.forEach(function (shipment, index) {

        table.innerHTML += `
        <tr>

            <td>${shipment.tracking || ""}</td>

            <td>${shipment.senderName || ""}</td>

            <td>${shipment.receiverName || ""}</td>

            <td>${shipment.status || ""}</td>

            <td>${shipment.location || ""}</td>

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


// ======================================================
// EDIT / LOAD SHIPMENT
// ======================================================

function editShipment(index) {

    if (!shipments[index]) {
        alert("Shipment not found.");
        return;
    }

    currentShipmentIndex = index;

    const shipment = shipments[index];

    document.getElementById("editTracking").value =
        shipment.tracking || "";

    document.getElementById("editSender").value =
        shipment.senderName || "";

    document.getElementById("editReceiver").value =
        shipment.receiverName || "";

    document.getElementById("editStatus").value =
        shipment.status || "";

    document.getElementById("editLocation").value =
        shipment.location || "";

    document.getElementById("editDelivery").value =
        shipment.delivery || "";

    document.getElementById("editInstructions").value =
        shipment.instructions || "";

    const panel =
        document.getElementById("editPanel");

    if (panel) {

        panel.style.display = "block";

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// NEW SHIPMENT
// ======================================================

function newShipment() {

    currentShipmentIndex = -1;

    window.location.href =
        "create-shipment.html";

}


// ======================================================
// SAVE CURRENT SHIPMENT
// ======================================================

function saveShipment() {

    if (currentShipmentIndex === -1) {

        alert("Please load a shipment before saving changes.");

        return;
    }

    const shipment =
        shipments[currentShipmentIndex];

    if (!shipment) {

        alert("Shipment could not be found.");

        return;
    }


    // ------------------------------
    // Read edit form values
    // ------------------------------

    shipment.tracking =
        document.getElementById("editTracking").value.trim();

    shipment.senderName =
        document.getElementById("editSender").value.trim();

    shipment.receiverName =
        document.getElementById("editReceiver").value.trim();

    shipment.status =
        document.getElementById("editStatus").value.trim();

    shipment.location =
        document.getElementById("editLocation").value.trim();

    shipment.delivery =
        document.getElementById("editDelivery").value;

    shipment.instructions =
        document.getElementById("editInstructions").value.trim();


    // ------------------------------
    // Automatic progress
    // ------------------------------

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
            shipment.progress =
                shipment.progress || 0;
    }


    // ------------------------------
    // Update shipment history
    // ------------------------------

    if (!shipment.history) {
        shipment.history = "";
    }

    const time =
        new Date().toLocaleString();

    shipment.history +=
        "• " +
        shipment.status +
        " - " +
        shipment.location +
        " (" +
        time +
        ")\n";


    // ------------------------------
    // Save to Local Storage
    // ------------------------------

    saveShipments();


    // ------------------------------
    // Refresh dashboard
    // ------------------------------

    loadShipments();

    updateDashboard();


    // ------------------------------
    // Activity Log
    // ------------------------------

    addActivity(
        "Shipment " +
        shipment.tracking +
        " was updated",
        "✏️"
    );


    alert(
        "Shipment " +
        shipment.tracking +
        " updated successfully."
    );

}


// ======================================================
// DELETE SHIPMENT FROM TABLE
// ======================================================

function deleteShipment(index) {

    if (!shipments[index]) {
        alert("Shipment not found.");
        return;
    }

    const tracking =
        shipments[index].tracking || "this shipment";

    if (
        !confirm(
            "Are you sure you want to delete " +
            tracking +
            "?"
        )
    ) {
        return;
    }

    shipments.splice(index, 1);

    saveShipments();

    currentShipmentIndex = -1;

    loadShipments();

    updateDashboard();

    addActivity(
        "Shipment " +
        tracking +
        " was deleted",
        "🗑️"
    );

}


// ======================================================
// DELETE CURRENT SHIPMENT
// ======================================================

function deleteCurrentShipment() {

    if (currentShipmentIndex === -1) {

        alert(
            "Please load a shipment before deleting it."
        );

        return;
    }

    const tracking =
        shipments[currentShipmentIndex].tracking ||
        "this shipment";

    if (
        !confirm(
            "Are you sure you want to delete " +
            tracking +
            "?"
        )
    ) {
        return;
    }

    shipments.splice(
        currentShipmentIndex,
        1
    );

    saveShipments();

    currentShipmentIndex = -1;

    loadShipments();

    updateDashboard();

    const panel =
        document.getElementById("editPanel");

    if (panel) {
        panel.style.display = "none";
    }

    addActivity(
        "Shipment " +
        tracking +
        " was deleted",
        "🗑️"
    );

}


// ======================================================
// SEARCH SHIPMENTS
// ======================================================

function searchShipments() {

    const input =
        document.getElementById("searchShipment");

    const table =
        document.getElementById("shipmentTable");

    if (!input || !table) return;

    const search =
        input.value.toLowerCase().trim();

    table.innerHTML = "";

    shipments.forEach(function (shipment, index) {

        const tracking =
            (shipment.tracking || "").toLowerCase();

        const sender =
            (shipment.senderName || "").toLowerCase();

        const receiver =
            (shipment.receiverName || "").toLowerCase();

        if (
            tracking.includes(search) ||
            sender.includes(search) ||
            receiver.includes(search)
        ) {

            table.innerHTML += `
            <tr>

                <td>${shipment.tracking || ""}</td>

                <td>${shipment.senderName || ""}</td>

                <td>${shipment.receiverName || ""}</td>

                <td>${shipment.status || ""}</td>

                <td>${shipment.location || ""}</td>

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

        }

    });

}


// ======================================================
// INITIAL DASHBOARD LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadShipments();

        updateDashboard();

        loadCustomerMessages();

        loadActivity();

        const editPanel =
            document.getElementById("editPanel");

        if (editPanel) {
            editPanel.style.display = "block";
        }

    }
);
                            
