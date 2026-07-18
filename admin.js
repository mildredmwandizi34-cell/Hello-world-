// Load shipments
let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

// Current selected shipment
let currentShipmentIndex = -1;

// Save shipments
function saveShipments() {
    localStorage.setItem("shipments", JSON.stringify(shipments));
}

// Display shipments
function loadShipments() {

    let table = document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    shipments.forEach((s, index) => {

        table.innerHTML += `
        <tr>
            <td>${s.tracking}</td>
            <td>${s.sender}</td>
            <td>${s.receiver}</td>
            <td>${s.status}</td>
            <td>
                <button onclick="deleteShipment(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

// Search shipment
function loadShipment() {

    let tracking = document.getElementById("trackingSearch").value.toUpperCase();

    currentShipmentIndex = shipments.findIndex(function(shipment){

        return shipment.tracking.toUpperCase() === tracking;

    });

    if(currentShipmentIndex === -1){

        alert("Shipment not found.");

        return;

    }

    let s = shipments[currentShipmentIndex];

    document.getElementById("statusUpdate").value = s.status;

    document.getElementById("progressUpdate").value = s.progress;

    document.getElementById("locationUpdate").value = s.location;

}

// Update shipment
function updateShipment() {

    if (currentShipmentIndex === -1) {

        alert("Search for a shipment first.");

        return;

    }

    shipments[currentShipmentIndex].status =
        document.getElementById("statusUpdate").value;

    shipments[currentShipmentIndex].progress =
        Number(document.getElementById("progressUpdate").value);

    shipments[currentShipmentIndex].location =
        document.getElementById("locationUpdate").value;

    saveShipments();

    alert("Shipment updated successfully.");

}

// Delete shipment
function deleteShipment(index){

    shipments.splice(index,1);

    saveShipments();

    loadShipments();

}

document.addEventListener("DOMContentLoaded", loadShipments);
