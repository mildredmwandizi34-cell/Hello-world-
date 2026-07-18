// ===============================
// American Global Logistics
// Admin Dashboard JavaScript
// ===============================

// Load shipments
let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

// Currently selected shipment
let currentShipmentIndex = -1;

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

    let tracking = document.getElementById("trackingSearch").value.toUpperCase();

    currentShipmentIndex = shipments.findIndex(function(s){

        return s.tracking.toUpperCase() === tracking;

    });

    if(currentShipmentIndex === -1){

        alert("Shipment not found.");

        return;

    }

    let s = shipments[currentShipmentIndex];

    document.getElementById("senderUpdate").value = s.sender || "";

    document.getElementById("receiverUpdate").value = s.receiver || "";

    document.getElementById("packageUpdate").value = s.package || "";

    document.getElementById("weightUpdate").value = s.weight || "";

    document.getElementById("statusUpdate").value = s.status || "";

    document.getElementById("locationUpdate").value = s.location || "";

    document.getElementById("deliveryUpdate").value = s.delivery || "";

    document.getElementById("routeUpdate").value = s.route || "";

    document.getElementById("serviceUpdate").value = s.service || "";

    document.getElementById("progressUpdate").value = s.progress || 0;

    document.getElementById("historyUpdate").value = s.history || "";

}

// -------------------------------
// Update Shipment
// -------------------------------

function updateShipment(){

    if(currentShipmentIndex === -1){

        alert("Load a shipment first.");

        return;

    }

    let s = shipments[currentShipmentIndex];

    s.sender = document.getElementById("senderUpdate").value;

    s.receiver = document.getElementById("receiverUpdate").value;

    s.package = document.getElementById("packageUpdate").value;

    s.weight = document.getElementById("weightUpdate").value;

    s.status = document.getElementById("statusUpdate").value;

    s.location = document.getElementById("locationUpdate").value;

    s.delivery = document.getElementById("deliveryUpdate").value;

    s.route = document.getElementById("routeUpdate").value;

    s.service = document.getElementById("serviceUpdate").value;

    s.progress = Number(document.getElementById("progressUpdate").value);

    s.history = document.getElementById("historyUpdate").value;

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

document.addEventListener("DOMContentLoaded", function(){

    loadShipments();

});
