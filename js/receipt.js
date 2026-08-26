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
set("instructions", shipment.instructions);

// -----------------------------
// Verification
// -----------------------------
set("verificationCode", shipment.verificationCode);

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

    JsBarcode("#barcode",
        shipment.trackingNumber,
        {
            format: "CODE128",
            width: 2,
            height: 60,
            displayValue: true
        }
    );

}

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
