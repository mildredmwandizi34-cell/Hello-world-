// ===============================
// American Global Logistics
// receipt.js
// ===============================

// Get saved shipment
const shipment = JSON.parse(localStorage.getItem("shipment"));

if (!shipment) {
    alert("No shipment information found.");
    window.location.href = "create-shipment.html";
}

// Shortcut
function set(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || "-";
    }
}

// ------------------------------
// HEADER
// ------------------------------

set("trackingNumber", shipment.trackingNumber);
set("receiptNumber", shipment.receiptNumber);
set("receiptDate", shipment.receiptDate);
set("shipmentId", shipment.shipmentId);
set("createdTime", shipment.createdTime);

// ------------------------------
// SUMMARY
// ------------------------------

set("summaryTracking", shipment.trackingNumber);
set("summaryStatus", shipment.status);
set("summaryLocation", shipment.location);
set("summaryDelivery", shipment.delivery);

// ------------------------------
// SENDER
// ------------------------------

set("senderName", shipment.senderName);
set("senderCompany", shipment.senderCompany);
set("senderAddress", shipment.senderAddress);
set("senderPhone", shipment.senderPhone);
set("senderEmail", shipment.senderEmail);

// ------------------------------
// RECEIVER
// ------------------------------

set("receiverName", shipment.receiverName);
set("receiverCompany", shipment.receiverCompany);
set("receiverAddress", shipment.receiverAddress);
set("receiverPhone", shipment.receiverPhone);
set("receiverEmail", shipment.receiverEmail);

// ------------------------------
// SHIPMENT DETAILS
// ------------------------------

set("description", shipment.description);
set("packageType", shipment.packageType);
set("pieces", shipment.pieces);
set("weight", shipment.weight + " kg");
set("dimensions", shipment.dimensions);
set("value", "$" + shipment.value);
set("service", shipment.service);
set("insurance", shipment.insurance);
set("payment", shipment.payment);
set("origin", shipment.origin);
set("destination", shipment.destination);
set("delivery", shipment.delivery);
set("status", shipment.status);
set("location", shipment.location);

set("reference", shipment.reference);
set("customerReference", shipment.customerReference);
set("barcodeNumber", shipment.barcodeNumber);
set("instructions", shipment.instructions);

// ------------------------------
// CHARGES
// ------------------------------

set("shippingCost", "$" + shipment.shippingCost);
set("tax", "$" + shipment.tax);
set("discount", "$" + shipment.discount);
set("totalAmount", "$" + shipment.totalAmount);

// ------------------------------
// FOOTER
// ------------------------------

set("documentNo", shipment.documentNo);
set("issueDate", shipment.issueDate);

// ------------------------------
// VERIFICATION
// ------------------------------

set("verificationCode", shipment.verificationCode);

// ------------------------------
// SIGNATURE
// ------------------------------

set("senderSignature", shipment.senderName);

// ------------------------------
// PAYMENT BADGE
// ------------------------------

const badge = document.getElementById("paymentStamp");

if (badge) {

    badge.className = "payment-badge";

    switch ((shipment.payment || "").toLowerCase()) {

        case "paid":
            badge.innerHTML = "✔ PAID";
            badge.style.background = "#28a745";
            break;

        case "unpaid":
            badge.innerHTML = "UNPAID";
            badge.style.background = "#dc3545";
            break;

        default:
            badge.innerHTML = "PAY ON DELIVERY";
            badge.style.background = "#ff9800";
    }

}

// ------------------------------
// BARCODE
// ------------------------------

JsBarcode("#barcode", shipment.trackingNumber, {
    format: "CODE128",
    displayValue: true,
    lineColor: "#000",
    width: 2,
    height: 60
});

// ------------------------------
// QR CODE
// ------------------------------

const qrData =
`American Global Logistics

Tracking:
${shipment.trackingNumber}

Sender:
${shipment.senderName}

Receiver:
${shipment.receiverName}

Status:
${shipment.status}

Destination:
${shipment.destination}

Verification:
${shipment.verificationCode}`;

QRCode.toCanvas(document.getElementById("qrcode"), qrData, {
    width: 140
});

// ------------------------------
// TIMELINE
// ------------------------------

const created = document.getElementById("stepCreated");
const picked = document.getElementById("stepPicked");
const transit = document.getElementById("stepTransit");
const delivered = document.getElementById("stepDelivered");

function complete(step) {
    if (step) step.classList.add("complete");
}

switch ((shipment.status || "").toLowerCase()) {

    case "shipment created":
        complete(created);
        break;

    case "picked up":
        complete(created);
        complete(picked);
        break;

    case "in transit":
        complete(created);
        complete(picked);
        complete(transit);
        break;

    case "delivered":
        complete(created);
        complete(picked);
        complete(transit);
        complete(delivered);
        break;
}

// ------------------------------
// AUTO GENERATE MISSING VALUES
// ------------------------------

if (!shipment.receiptNumber) {
    set("receiptNumber", "RCP-" + Date.now());
}

if (!shipment.documentNo) {
    set("documentNo", "DOC-" + Math.floor(Math.random() * 999999));
}

if (!shipment.verificationCode) {
    set("verificationCode",
        Math.random().toString(36).substring(2,10).toUpperCase()
    );
    }
