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

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateDashboard() {

    // Reload latest shipment data
    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    let total = shipments.length;
    let awaiting = 0;
    let inTransit = 0;
    let delivered = 0;

    shipments.forEach(function(shipment) {

        switch ((shipment.status || "").toLowerCase()) {

            case "shipment created":
            case "awaiting pickup":
            case "picked up":
                awaiting++;
                break;

            case "in transit":
            case "customs cleared":
            case "arrived at destination hub":
            case "out for delivery":
                inTransit++;
                break;

            case "delivered":
                delivered++;
                break;

        }

    });

    // Update dashboard cards
    const totalCard = document.getElementById("totalShipments");
    const awaitingCard = document.getElementById("awaiting");
    const transitCard = document.getElementById("inTransit");
    const deliveredCard = document.getElementById("delivered");

    if (totalCard) totalCard.textContent = total;
    if (awaitingCard) awaitingCard.textContent = awaiting;
    if (transitCard) transitCard.textContent = inTransit;
    if (deliveredCard) deliveredCard.textContent = delivered;

    // ======================================================
// LOAD SHIPMENT TABLE
// ======================================================

function loadShipments() {

    // Load latest data
    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    const table = document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    // No shipments found
    if (shipments.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:20px;">
                    No shipments found.
                </td>
            </tr>
        `;

        updateDashboard();
        return;
    }

    // Display all shipments
    shipments.forEach(function(shipment, index){

        table.innerHTML += `
        <tr>

            <td>${shipment.tracking || "-"}</td>

            <td>${shipment.senderName || "-"}</td>

            <td>${shipment.receiverName || "-"}</td>

            <td>
                <span class="status">
                    ${shipment.status || "Shipment Created"}
                </span>
            </td>

            <td>${shipment.location || "-"}</td>

            <td>

                <button
                    class="action-btn edit"
                    onclick="editShipment(${index})">
                    Edit
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteShipment(${index})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    updateDashboard();

        }

    // ======================================================
// NEW SHIPMENT
// ======================================================

function newShipment() {

    currentShipmentIndex = -1;

    // Generate a new tracking number
    document.getElementById("editTracking").value =
        generateTrackingNumber();

    // Default values
    document.getElementById("editStatus").value =
        "Shipment Created";

    document.getElementById("editLocation").value = "";
    document.getElementById("editDelivery").value = "";
    document.getElementById("editInstructions").value = "";

    // Scroll to the edit panel
    const panel = document.getElementById("editPanel");

    if (panel) {
        panel.scrollIntoView({
            behavior: "smooth"
        });

        // ======================================================
// EDIT SHIPMENT
// ======================================================

function editShipment(index){

    shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    currentShipmentIndex = index;

    let shipment = shipments[index];

    if(!shipment){
        alert("Shipment not found.");
        return;
    }

    document.getElementById("editTracking").value =
        shipment.tracking || "";

    document.getElementById("editStatus").value =
        shipment.status || "Shipment Created";

    document.getElementById("editLocation").value =
        shipment.location || "";

    document.getElementById("editDelivery").value =
        shipment.delivery || "";

    document.getElementById("editInstructions").value =
        shipment.instructions || "";

    // Scroll to edit panel
    document.getElementById("editPanel").scrollIntoView({
        behavior: "smooth"
    });

}
    }

}

}
