// =====================================
// American Global Logistics
// Premium Receipt V3
// =====================================

// -----------------------------
// Get Shipment
// -----------------------------
console.log("Stored shipment:", localStorage.getItem("shipment"));

let shipment =
JSON.parse(localStorage.getItem("shipment"));

// Fallback: load from shipments array using tracking number
if (!shipment) {

    const params = new URLSearchParams(window.location.search);
    const tracking = params.get("tracking");

    const shipments =
        JSON.parse(localStorage.getItem("shipments")) || [];

    shipment = shipments.find(s =>
        s.trackingNumber === tracking ||
        s.tracking === tracking
    );
}

if (!shipment) {
    alert("Shipment not found.");
    window.location.href = "create-shipment.html";
}

// -----------------------------
// Helper
// -----------------------------
function set(id, value) {

    const el = document.getElementById(id);

    if (!el) return;

    el.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";
}

// -----------------------------
// Auto Values
// -----------------------------
shipment.trackingNumber =
    shipment.trackingNumber || shipment.tracking || "-";

shipment.receiptNumber =
    shipment.receiptNumber ||
    "RCP-" + Date.now();

shipment.receiptDate =
    shipment.receiptDate ||
    new Date().toLocaleDateString();

shipment.documentNo =
    shipment.documentNo ||
    "DOC-" +
    Math.floor(Math.random() * 900000 + 100000);

shipment.issueDate =
    shipment.issueDate ||
    new Date().toLocaleDateString();

shipment.verificationCode =
    shipment.verificationCode ||
    Math.random()
        .toString(36)
        .substring(2,10)
        .toUpperCase();

// -----------------------------
// Header
// -----------------------------
set("trackingNumber", shipment.trackingNumber);
set("receiptNumber", shipment.receiptNumber);
set("receiptNumberBottom", shipment.receiptNumber);
set("receiptDate", shipment.receiptDate);

// -----------------------------
// Summary
// -----------------------------
set("summaryTracking", shipment.trackingNumber);
set("summaryStatus", shipment.status);
set("summaryLocation", shipment.location);
set("summaryDelivery", shipment.delivery);

// -----------------------------
// Sender
// -----------------------------
set("senderName", shipment.senderName);
set("senderCompany", shipment.senderCompany);
set("senderAddress", shipment.senderAddress);
set("senderCity", shipment.senderCity);
set("senderCountry", shipment.senderCountry);
set("senderPhone", shipment.senderPhone);
set("senderEmail", shipment.senderEmail);

// -----------------------------
// Receiver
// -----------------------------
set("receiverName", shipment.receiverName);
set("receiverCompany", shipment.receiverCompany);
set("receiverAddress", shipment.receiverAddress);
set("receiverCity", shipment.receiverCity);
set("receiverCountry", shipment.receiverCountry);
set("receiverPhone", shipment.receiverPhone);
set("receiverEmail", shipment.receiverEmail);

// -----------------------------
// Shipment Details
// -----------------------------
set("package", shipment.description);
set("packageType", shipment.packageType);
set("pieces", shipment.pieces);
set("weight", shipment.weight ? shipment.weight + " kg" : "-");
set("dimensions", shipment.dimensions);
set("declaredValue", shipment.value ? "$" + shipment.value : "-");
set("service", shipment.service);
set("insurance", shipment.insurance);
set("paymentStatus", shipment.payment);
set("origin", shipment.origin);
set("destination", shipment.destination);
set("delivery", shipment.delivery);
set("status", shipment.status);
set("location", shipment.location);

// -----------------------------
// Charges
// -----------------------------
set("shippingCost", shipment.shippingCost ? "$" + shipment.shippingCost : "-");
set("tax", shipment.tax ? "$" + shipment.tax : "-");
set("discount", shipment.discount ? "$" + shipment.discount : "-");
set("totalAmount", shipment.totalAmount ? "$" + shipment.totalAmount : "-");

// -----------------------------
// References
// -----------------------------
set("shipmentId", shipment.shipmentId);
set("reference", shipment.reference);
set("customerReference", shipment.customerReference);
set("barcodeNumber", shipment.barcodeNumber || shipment.trackingNumber);
set("createdTime", shipment.createdTime);
set("instructionsTable", shipment.instructions);
set("instructionsReference", shipment.instructions);
set("instructionsText", shipment.instructions);

// -----------------------------
// Verification
// -----------------------------
set("verificationCode", shipment.verificationCode);
set("verificationCode", shipment.verificationCode);
set("verificationCodeLarge", shipment.verificationCode);
// -----------------------------
// Footer
// -----------------------------
set("documentNo", shipment.documentNo);
set("issueDate", shipment.issueDate);

// -----------------------------
// Sender Signature
// -----------------------------
set("senderSignature", shipment.senderSignature);
set("authorizedOfficer", shipment.authorizedOfficer);

// -----------------------------
// Payment Stamp
// -----------------------------
const stamp = document.getElementById("paymentStamp");

if (stamp) {

    const payment =
        (shipment.payment || "").toLowerCase();

    stamp.className = "stamp";

    const stampLarge = document.getElementById("paymentStampLarge");

if (stampLarge) {
    stampLarge.className = stamp.className;
    stampLarge.textContent = stamp.textContent;
}

    if (payment === "paid") {

        stamp.classList.add("paid");
        stamp.textContent = "PAID";

    } else if (payment === "pending") {

        stamp.classList.add("pending");
        stamp.textContent = "PENDING";

    } else if (payment === "received") {

        stamp.classList.add("received");
        stamp.textContent = "RECEIVED";

    } else {

        stamp.classList.add("unpaid");
        stamp.textContent = "UNPAID";

    }
}

// -----------------------------
// Barcode
// -----------------------------
if (document.getElementById("barcode")) {

    JsBarcode("#barcode", shipment.trackingNumber, {
    format: "CODE128",
    width: 2,
    height: 60,
    displayValue: true
});

JsBarcode("#barcodeLarge", shipment.trackingNumber, {
    format: "CODE128",
    width: 2,
    height: 60,
    displayValue: true
});

// -----------------------------
// QR Code
// -----------------------------
const qr = document.getElementById("qrcode");

if (qr) {

    qr.innerHTML = "";

    QRCode.toCanvas(

        qr,

        JSON.stringify({

            tracking: shipment.trackingNumber,
            sender: shipment.senderName,
            receiver: shipment.receiverName,
            destination: shipment.destination,
            status: shipment.status,
            verification: shipment.verificationCode

        }),

        {
            width: 140
        }

    );

}

// -----------------------------
// Shipment Timeline
// -----------------------------
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

console.log("Receipt loaded successfully.", shipment);

/* ==========================================
   SHIPMENT ROUTE MAP
========================================== */

const coordinates = {

    "New York": [40.7128, -74.0060],
    "London": [51.5074, -0.1278],
    "Dubai": [25.2048, 55.2708],
    "Nairobi": [-1.2864, 36.8172],
    "Los Angeles": [34.0522, -118.2437],
    "Costa Rica": [9.7489, -83.7534],
    "Guatemala": [14.6349, -90.5069]

};

const start = coordinates[shipment.origin];
const end = coordinates[shipment.destination];

if (start && end && document.getElementById("receiptMap")) {

    const map = L.map("receiptMap");

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    L.marker(start)
        .addTo(map)
        .bindPopup("Origin<br><strong>" + shipment.origin + "</strong>");

    L.marker(end)
        .addTo(map)
        .bindPopup("Destination<br><strong>" + shipment.destination + "</strong>");

    L.polyline(
        [start, end],
        {
            color: "#0b4ea2",
            weight: 5
        }
    ).addTo(map);

    map.fitBounds([start, end], {
        padding: [50, 50]
    });

}
