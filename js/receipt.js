// ==========================================
// American Global Logistics
// Premium Receipt System
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Get tracking number from URL
    const params = new URLSearchParams(window.location.search);
    const tracking = params.get("tracking");

    if (!tracking) {
        alert("No tracking number supplied.");
        return;
    }

    // Load shipments
    let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    // Find shipment
    let shipment = shipments.find(s =>
        s.tracking &&
        s.tracking.toUpperCase() === tracking.toUpperCase()
    );

    if (!shipment) {
        alert("Shipment not found.");
        return;
    }
    console.log(shipments);
console.log(tracking);
alert(JSON.stringify(shipment));

    // Helper function
    function set(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value || "-";
        }
    }

    // Receipt number
   const receiptNo = shipment.receiptNumber ||
    "RCP-" + Date.now();

shipment.receiptNumber = receiptNo; 

    localStorage.setItem("shipments", JSON.stringify(shipments));

    // Date
    const today = new Date().toLocaleDateString();

    // Header
    set("trackingNumber", shipment.tracking);
    // Generate barcode
if (typeof JsBarcode !== "undefined") {

    JsBarcode("#barcode", shipment.tracking, {

        format: "CODE128",

        lineColor: "#000",

        width: 2,

        height: 60,

        displayValue: true,

        fontSize: 16,

        margin: 8

    });

        }
    set("receiptNumber", receiptNo);
    set("receiptDate", today);

    // Sender
    set("senderName", shipment.senderName);
    set("senderCompany", shipment.senderCompany);
    set("senderAddress", shipment.senderAddress);
    set("senderPhone", shipment.senderPhone);
    set("senderEmail", shipment.senderEmail);

    // Receiver
    set("receiverName", shipment.receiverName);
    set("receiverCompany", shipment.receiverCompany);
    set("receiverAddress", shipment.receiverAddress);
    set("receiverPhone", shipment.receiverPhone);
    set("receiverEmail", shipment.receiverEmail);

    // Shipment Details
    set("description", shipment.package);
    set("packageType", shipment.packageType);
    set("pieces", shipment.pieces);
    set("weight", shipment.weight);
    set("dimensions", shipment.dimensions);
    set("value", shipment.declaredValue);
    set("service", shipment.service);
    set("insurance", shipment.insurance);
    set("payment", shipment.paymentStatus);
    set("origin", shipment.origin);
    set("destination", shipment.destination);
    set("delivery", shipment.delivery);
    set("status", shipment.status);
    set("location", shipment.location);
    set("shippingCost", shipment.shippingCost);
    set("tax", shipment.tax);
    set("discount", shipment.discount);
    set("totalAmount", shipment.totalAmount);

    // Signature
    set("senderSignature", shipment.senderSignature);

    // Footer
    set("documentNo", receiptNo);
    set("issueDate", today);

    // =========================
// Generate QR Code
// =========================

const qrContainer = document.getElementById("qrcode");

if (qrContainer) {

    qrContainer.innerHTML = "";

    // Tracking URL
    const trackingURL =
        "https://www.americangloballogistics.com/track.html?tracking=" +
        shipment.tracking;

    QRCode.toCanvas(
        trackingURL,
        {
            width: 140,
            margin: 2,
            color: {
                dark: "#0b4ea2",
                light: "#ffffff"
            }
        },
        function (error, canvas) {

            if (error) {
                console.error(error);
                return;
            }

            qrContainer.appendChild(canvas);

        }
    );
    
}

// ==========================================
// Print Receipt
// ==========================================

function printReceipt() {

    window.print();

              }

 //==============================
// Payment Stamp
//==============================

const stamp = document.getElementById("paymentStamp");

if (stamp) {

    const status = (shipment.paymentStatus || "").toLowerCase();

    stamp.className = "stamp";

    if (status === "paid") {

        stamp.classList.add("paid");
        stamp.textContent = "PAID";

    } else if (status === "received") {

        stamp.classList.add("received");
        stamp.textContent = "RECEIVED";

    } else if (status === "pending") {

        stamp.classList.add("pending");
        stamp.textContent = "PENDING";

    } else {

        stamp.classList.add("unpaid");
        stamp.textContent = "UNPAID";

    }

}  
    
// ==============================
// Verification Code
// ==============================

const verifyElement = document.getElementById("verificationCode");

if (verifyElement) {

    let verification = shipment.verificationCode;

    if (!verification) {

        verification =
            "AGL-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase();

        shipment.verificationCode = verification;

        localStorage.setItem("shipments", JSON.stringify(shipments));

    }

    verifyElement.textContent = verification;

}
}); // End of DOMContentLoaded
