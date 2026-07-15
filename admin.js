// Load shipments
let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

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

// Delete shipment
function deleteShipment(index){
    shipments.splice(index,1);
    saveShipments();
    loadShipments();
}


document.addEventListener("DOMContentLoaded", loadShipments);
