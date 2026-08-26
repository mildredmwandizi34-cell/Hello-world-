// ======================================================
// American Global Logistics
// Admin Dashboard v3.0
// PART 1 - FOUNDATION
// ======================================================

"use strict";

// ======================================================
// STORAGE
// ======================================================

let shipments = JSON.parse(localStorage.getItem("shipments")) || [];
let currentShipmentIndex = -1;

let customerMessages = JSON.parse(localStorage.getItem("customerMessages")) || [];
let activityLog = JSON.parse(localStorage.getItem("activityLog")) || [];

// ======================================================
// SAVE DATA
// ======================================================

function saveShipments() {
    localStorage.setItem("shipments", JSON.stringify(shipments));
}

function saveMessages() {
    localStorage.setItem("customerMessages", JSON.stringify(customerMessages));
}

function saveActivity() {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
}

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateDashboard() {

    const total = document.getElementById("totalShipments");
    const awaiting = document.getElementById("awaiting");
    const transit = document.getElementById("inTransit");
    const delivered = document.getElementById("delivered");

    if (total)
        total.textContent = shipments.length;

    if (awaiting)
        awaiting.textContent = shipments.filter(s => s.status === "Awaiting Pickup").length;

    if (transit)
        transit.textContent = shipments.filter(s => s.status === "In Transit").length;

    if (delivered)
        delivered.textContent = shipments.filter(s => s.status === "Delivered").length;

    const messageCount = document.getElementById("messageCount");

    if (messageCount)
        messageCount.textContent = customerMessages.length;
}

// ======================================================
// ACTIVITY LOG
// ======================================================

function addActivity(message, icon = "📦") {

    activityLog.unshift({
        message: message,
        icon: icon,
        time: new Date().toLocaleString()
    });

    if (activityLog.length > 50) {
        activityLog.pop();
    }

    saveActivity();
}

// ======================================================
// INITIALIZE DASHBOARD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    customerMessages =
        JSON.parse(localStorage.getItem("customerMessages")) || [];

    activityLog =
        JSON.parse(localStorage.getItem("activityLog")) || [];

    updateDashboard();

    // ======================================================
// PART 2 - SHIPMENT MANAGEMENT
// ======================================================

// ------------------------------------------------------
// LOAD SHIPMENTS
// ------------------------------------------------------

function loadShipments() {

    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    const table = document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    shipments.forEach(function(shipment, index){

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


// ------------------------------------------------------
// NEW SHIPMENT
// ------------------------------------------------------

function newShipment(){

    currentShipmentIndex = -1;

    window.location.href = "create-shipment.html";

}


// ------------------------------------------------------
// EDIT SHIPMENT
// ------------------------------------------------------

function editShipment(index){

    currentShipmentIndex = index;

    const shipment = shipments[index];

    if(!shipment) return;

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

    document
        .getElementById("editPanel")
        .scrollIntoView({
            behavior:"smooth"
        });

}


// ------------------------------------------------------
// SAVE SHIPMENT
// ------------------------------------------------------

function saveShipment(){

    if(currentShipmentIndex < 0){
        alert("Please load a shipment first.");
        return;
    }

    shipments[currentShipmentIndex].tracking =
        document.getElementById("editTracking").value;

    shipments[currentShipmentIndex].senderName =
        document.getElementById("editSender").value;

    shipments[currentShipmentIndex].receiverName =
        document.getElementById("editReceiver").value;

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

    addActivity(
        "Shipment updated",
        "✏️"
    );

    alert("Shipment updated successfully.");

}


// ------------------------------------------------------
// DELETE SHIPMENT
// ------------------------------------------------------

function deleteShipment(index){

    if(!confirm("Delete this shipment?"))
        return;

    shipments.splice(index,1);

    saveShipments();

    loadShipments();

    addActivity(
        "Shipment deleted",
        "🗑️"
    );

}


// ------------------------------------------------------
// DELETE CURRENT SHIPMENT
// ------------------------------------------------------

function deleteCurrentShipment(){

    if(currentShipmentIndex < 0){
        alert("

});
