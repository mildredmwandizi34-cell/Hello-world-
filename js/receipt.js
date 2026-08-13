// ==========================================
// American Global Logistics
// Premium Receipt V3
// ==========================================

// Get tracking number from URL
const params = new URLSearchParams(window.location.search);
const tracking = params.get("tracking");

// Load shipments
const shipments =
JSON.parse(localStorage.getItem("shipments")) || [];

// Find shipment
const shipment = shipments.find(s =>
    s.tracking === tracking ||
    s.trackingNumber === tracking
);

if (!shipment) {
    alert("Shipment not found.");
    window.location.href = "track.html";
}

// Helper
function set(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || "-";
    }
}

// ======================
// HEADER
// ======================

set("trackingNumber", shipment.tracking || shipment.trackingNumber);

set("receiptNumber",
shipment.receiptNumber ||
("RCP-" + Date.now()));

set("receiptDate",
shipment.receiptDate ||
new Date().toLocaleDateString());

set("documentNo",
shipment.documentNo ||
("DOC-" + Math.floor(Math.random()*900000+100000)));

set("issueDate",
shipment.issueDate ||
new Date().toLocaleDateString());

// ======================
// SENDER
// ======================

set("senderName", shipment.senderName);
set("senderCompany", shipment.senderCompany);
set("senderAddress", shipment.senderAddress);
set("senderPhone", shipment.senderPhone);
set("senderEmail", shipment.senderEmail);

// ======================
// RECEIVER
// ======================

set("receiverName", shipment.receiverName);
set("receiverCompany", shipment.receiverCompany);
set("receiverAddress", shipment.receiverAddress);
set("receiverPhone", shipment.receiverPhone);
set("receiverEmail", shipment.receiverEmail);

// ======================
// SHIPMENT DETAILS
// ======================

set("description", shipment.description);
set("packageType", shipment.packageType);
set("pieces", shipment.pieces);
set("weight", shipment.weight);
set("dimensions", shipment.dimensions);
set("value", shipment.value);
set("service", shipment.service);
set("insurance", shipment.insurance);
set("payment", shipment.payment);
set("origin", shipment.origin);
set("destination", shipment.destination);
set("delivery", shipment.delivery);
set("status", shipment.status);
set("location", shipment.location);

// ======================
// CHARGES
// ======================

set("shippingCost", shipment.shippingCost);
set("tax", shipment.tax);
set("discount", shipment.discount);
set("totalAmount", shipment.totalAmount);

// ======================
// VERIFICATION
// ======================

const verification =
shipment.verificationCode ||
Math.random().toString(36)
.substring(2,10)
.toUpperCase();

set("verificationCode", verification);

// ======================
// SIGNATURE
// ======================

set("senderSignature", shipment.senderName);

// ======================
// BARCODE
// ======================

if (document.getElementById("barcode")) {

JsBarcode("#barcode",
shipment.tracking || shipment.trackingNumber,
{
format:"CODE128",
width:2,
height:60,
displayValue:true
});

}

// ======================
// QR CODE
// ======================

if(document.getElementById("qrcode")){

QRCode.toCanvas(

document.getElementById("qrcode"),

`
American Global Logistics

Tracking:
${shipment.tracking || shipment.trackingNumber}

Sender:
${shipment.senderName}

Receiver:
${shipment.receiverName}

Status:
${shipment.status}

Verification:
${verification}
`,

{
width:140
}

);

}

// ======================
// PAYMENT STAMP
// ======================

const stamp =
document.getElementById("paymentStamp");

if(stamp){

const payment =
(shipment.payment || "").toLowerCase();

stamp.className="stamp";

if(payment==="paid"){

stamp.classList.add("paid");
stamp.textContent="PAID";

}

else if(payment==="pending"){

stamp.classList.add("pending");
stamp.textContent="PENDING";

}

else if(payment==="received"){

stamp.classList.add("received");
stamp.textContent="RECEIVED";

}

else{

stamp.classList.add("unpaid");
stamp.textContent="UNPAID";

}

}

// ======================
// SHIPMENT TIMELINE
// ======================

const steps =
document.querySelectorAll(".timeline .step");

steps.forEach(step=>{
step.classList.remove("complete");
});

const status =
(shipment.status || "").toLowerCase();

if(status.includes("shipment")){

steps[0]?.classList.add("complete");

}

if(status.includes("picked")){

steps[0]?.classList.add("complete");
steps[1]?.classList.add("complete");

}

if(status.includes("transit")){

steps[0]?.classList.add("complete");
steps[1]?.classList.add("complete");
steps[2]?.classList.add("complete");

}

if(status.includes("delivered")){

steps.forEach(step=>{
step.classList.add("complete");
});

}

// ======================
// PRINT
// ======================

function printReceipt(){

window.print();

}
