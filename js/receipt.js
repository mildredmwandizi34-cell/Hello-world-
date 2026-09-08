/* =====================================================
   American Global Logistics
   Receipt.js Pro
   Part 1 - Initialization
===================================================== */

"use strict";

/* ==========================
   Helper Functions
========================== */

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

// ==========================
// Load Shipment From URL
// ==========================

const params = new URLSearchParams(window.location.search);
const tracking = params.get("tracking");

const shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

let shipment =
    shipments.find(item =>
        item.trackingNumber === tracking ||
        item.tracking === tracking
    );

// Fallback only if URL tracking wasn't found
if (!shipment) {
    shipment = JSON.parse(localStorage.getItem("shipment"));
}

if (!shipment) {
    alert("Shipment not found.");
    window.location.href = "create-shipment.html";
    throw new Error("Shipment not found.");
}

/* ==========================
   Automatic Values
========================== */

shipment.trackingNumber =
    shipment.trackingNumber ||
    shipment.tracking ||
    "-";

shipment.receiptNumber =
    shipment.receiptNumber ||
    "RCP-" + Date.now();

shipment.receiptDate =
    shipment.receiptDate ||
    new Date().toLocaleDateString();

shipment.issueDate =
    shipment.issueDate ||
    shipment.receiptDate;

shipment.documentNo =
    shipment.documentNo ||
    "DOC-" +
    Math.floor(100000 + Math.random() * 900000);

shipment.shipmentId =
    shipment.shipmentId ||
    "SHP-" + Date.now();

shipment.createdTime =
    shipment.createdTime ||
    new Date().toLocaleString();

shipment.barcodeNumber =
    shipment.barcodeNumber ||
    shipment.trackingNumber;

shipment.verificationCode =
    shipment.verificationCode ||
    Math.random()
        .toString(36)
        .substring(2,10)
        .toUpperCase();

/* ==========================
   Save Updated Shipment
========================== */

localStorage.setItem(
    "shipment",
    JSON.stringify(shipment)
);

const index =
    shipments.findIndex(item =>
        item.trackingNumber === shipment.trackingNumber ||
        item.tracking === shipment.trackingNumber
    );

if (index >= 0) {

    shipments[index] = shipment;

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

}

/* =====================================================
   PART 2 - Populate Receipt
===================================================== */

/* ==========================
   Header
========================== */

set("trackingNumber", shipment.trackingNumber);
set("receiptNumber", shipment.receiptNumber);
set("receiptNumberBottom", shipment.receiptNumber);
set("receiptDate", shipment.receiptDate);

set("receiptPaymentStatus", shipment.payment);
set("receiptShipmentStatus", shipment.status);
set("receiptServiceType", shipment.service);
set("receiptDelivery", shipment.delivery);

/* ==========================
   Summary
========================== */

set("summaryTracking", shipment.trackingNumber);
set("summaryStatus", shipment.status);
set("summaryLocation", shipment.location);
set("summaryDelivery", shipment.delivery);

/* ==========================
   Status Boxes
========================== */

set("status", shipment.status);
set("location", shipment.location);

/* ==========================
   Sender
========================== */

set("senderName", shipment.senderName);
set("senderCompany", shipment.senderCompany);
set("senderAddress", shipment.senderAddress);
set("senderCity", shipment.senderCity);
set("senderCountry", shipment.senderCountry);
set("senderPhone", shipment.senderPhone);
set("senderEmail", shipment.senderEmail);

/* ==========================
   Receiver
========================== */

set("receiverName", shipment.receiverName);
set("receiverCompany", shipment.receiverCompany);
set("receiverAddress", shipment.receiverAddress);
set("receiverCity", shipment.receiverCity);
set("receiverCountry", shipment.receiverCountry);
set("receiverPhone", shipment.receiverPhone);
set("receiverEmail", shipment.receiverEmail);

/* ==========================
   Shipment Details
========================== */

set("referenceNumber", shipment.reference);
set("customerReference", shipment.customerReference);

set("package", shipment.package);
set("packageType", shipment.descriptionType);

set("pieces", shipment.pieces);
set("weight", shipment.weight);
set("dimensions", shipment.dimensions);

set(
    "declaredValue",
    shipment.value ? "$" + shipment.value : "-"
);

set("service", shipment.service);
set("insurance", shipment.insurance);
set("paymentStatus", shipment.payment);

set("origin", shipment.origin);
set("destination", shipment.destination);
set("delivery", shipment.delivery);

set("route", shipment.route);

set("instructions", shipment.instructions);

/* ==========================
   References
========================== */

set("shipmentId", shipment.shipmentId);

set(
    "customerReferenceExtra",
    shipment.customerReference
);

set("reference", shipment.reference);

set(
    "barcodeNumber",
    shipment.barcodeNumber
);

set("createdTime", shipment.createdTime);

set(
    "instructionsReference",
    shipment.instructions
);

set(
    "instructionsText",
    shipment.instructions
);

/* ==========================
   Charges
========================== */

set(
    "shippingCost",
    shipment.shippingCost
        ? "$" + shipment.shippingCost
        : "-"
);

set(
    "tax",
    shipment.tax
        ? "$" + shipment.tax
        : "-"
);

set(
    "discount",
    shipment.discount
        ? "$" + shipment.discount
        : "-"
);

set(
    "totalAmount",
    shipment.totalAmount
        ? "$" + shipment.totalAmount
        : "-"
);

/* ==========================
   Verification
========================== */

set(
    "verificationCode",
    shipment.verificationCode
);

set(
    "verificationCodeLarge",
    shipment.verificationCode
);

/* ==========================
   Signatures
========================== */

set(
    "senderSignature",
    shipment.senderSignature
);

set(
    "authorizedOfficer",
    shipment.authorizedOfficer
);

/* ==========================
   Footer
========================== */

set("documentNo", shipment.documentNo);
set("issueDate", shipment.issueDate);

console.log("Receipt fields populated.");

/* =====================================================
   PART 3 - Barcode, QR Code, Payment & Timeline
===================================================== */

/* ==========================
   Payment Stamp
========================== */

const payment =
    (shipment.payment || "").toLowerCase();

const paymentStamp =
    $("paymentStamp");

const paymentStampLarge =
    $("paymentStampLarge");

if (paymentStamp) {

    paymentStamp.className = "stamp";

    switch (payment) {

        case "paid":
            paymentStamp.classList.add("paid");
            paymentStamp.textContent = "PAID";
            break;

        case "pending":
            paymentStamp.classList.add("pending");
            paymentStamp.textContent = "PENDING";
            break;

        case "received":
            paymentStamp.classList.add("received");
            paymentStamp.textContent = "RECEIVED";
            break;

        default:
            paymentStamp.classList.add("unpaid");
            paymentStamp.textContent = "UNPAID";

    }

if (paymentStampLarge) {

    paymentStampLarge.className = paymentStamp.className;
    paymentStampLarge.textContent = paymentStamp.textContent;
     }

}
   
/* ==========================
   Barcode
========================== */

if (typeof JsBarcode !== "undefined") {

    if ($("barcode")) {
        JsBarcode("#barcode", shipment.trackingNumber, {
            format: "CODE128",
            width: 2,
            height: 60,
            displayValue: true
        });
    }

    if ($("barcodeLarge")) {
        JsBarcode("#barcodeLarge", shipment.trackingNumber, {
            format: "CODE128",
            width: 2,
            height: 60,
            displayValue: true
        });
    }

}

/* ==========================
   QR Code
========================== */

if (typeof QRCode !== "undefined" && $("qrcode")) {

    QRCode.toCanvas(
        shipment.trackingNumber,
        { width: 140 },
        function(err, canvas) {
            if (!err) {
                $("qrcode").innerHTML = "";
                $("qrcode").appendChild(canvas);
            }
        }
    );

}

/* ==========================
   Timeline
========================== */

function complete(id) {
    const step = $(id);
    if (step) step.classList.add("complete");
}

switch ((shipment.status || "").toLowerCase()) {

    case "shipment created":
        complete("stepCreated");
        break;

    case "picked up":
        complete("stepCreated");
        complete("stepPicked");
        break;

    case "in transit":
        complete("stepCreated");
        complete("stepPicked");
        complete("stepTransit");
        break;

    case "delivered":
        complete("stepCreated");
        complete("stepPicked");
        complete("stepTransit");
        complete("stepDelivered");
        break;
}

console.log("Receipt loaded successfully.");
