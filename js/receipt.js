/* =====================================================
   American Global Logistics
   Receipt.js Pro v1
===================================================== */
alert("receipt.js loaded");

alert(localStorage.getItem("shipment"));

alert(window.location.search);
// -----------------------------
// Helper Functions
// -----------------------------
function $(id) {
    return document.getElementById(id);
}

function set(id, value) {
    const el = $(id);

    if (!el) return;

    el.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";
}

// -----------------------------
// Load Shipment
// -----------------------------
let shipment = null;

// First: current shipment
try {
    shipment = JSON.parse(localStorage.getItem("shipment"));
} catch (e) {
    console.error(e);
}

// Second: search by tracking number
if (!shipment) {

    const params = new URLSearchParams(window.location.search);

    const tracking =
        params.get("tracking");

    const shipments =
        JSON.parse(localStorage.getItem("shipments")) || [];

    shipment = shipments.find(item =>

        item.trackingNumber === tracking ||

        item.tracking === tracking

    );
}

// No shipment found
if (!shipment) {

    alert("Shipment not found.");

    window.location.href =
        "create-shipment.html";

    throw new Error("Shipment not found.");

}

// -----------------------------
// Automatic Values
// -----------------------------
shipment.trackingNumber =
    shipment.trackingNumber ||
    shipment.tracking ||
    "-";

shipment.receiptNumber =
    shipment.receiptNumber ||
    "RCP-" +
    Math.floor(Math.random() * 900000 + 100000);

shipment.receiptDate =
    shipment.receiptDate ||
    new Date().toLocaleDateString();

shipment.issueDate =
    shipment.issueDate ||
    shipment.receiptDate;

shipment.documentNo =
    shipment.documentNo ||
    "DOC-" +
    Math.floor(Math.random() * 900000 + 100000);

shipment.verificationCode =
    shipment.verificationCode ||
    Math.random()
        .toString(36)
        .substring(2,10)
        .toUpperCase();

console.log("Shipment Loaded");
console.log(shipment);
