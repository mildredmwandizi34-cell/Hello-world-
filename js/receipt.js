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

    // Helper function
    function set(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value || "-";
        }
    }

    // Receipt number
    const receiptNo = shipment.receiptNo ||
        "RCP-" + Date.now();

    shipment.receiptNo = receiptNo;

    localStorage.setItem("shipments", JSON.stringify(shipments));

    // Date
    const today = new Date().toLocaleDateString();

    // Header
    set("trackingNumber", shipment.tracking);
    set("receiptNumber", receiptNo);
    set("receiptDate", today);

    // Sender
    set("senderName", shipment.sender);
    set("senderCompany", shipment.senderCompany);
    set("senderAddress", shipment.senderAddress);
    set("senderPhone", shipment.senderPhone);
    set("senderEmail", shipment.senderEmail);

    // Receiver
    set("receiverName", shipment.receiver);
    set("receiverCompany", shipment.receiverCompany);
    set("receiverAddress", shipment.receiverAddress);
    set("receiverPhone", shipment.receiverPhone);
    set("receiverEmail", shipment.receiverEmail);

    // Shipment Details
    set("description", shipment.description);
    set("packageType", shipment.package);
    set("pieces", shipment.pieces);
    set("weight", shipment.weight);
    set("dimensions", shipment.dimensions);
    set("value", shipment.value);
    set("service", shipment.service);
    set("insurance", shipment.insurance);
    set("payment", shipment.paymentStatus);
    set("origin", shipment.origin);
    set("destination", shipment.destination);
    set("delivery", shipment.delivery);
    set("status", shipment.status);
    set("location", shipment.location);

    // Signature
    set("senderSignature", shipment.sender);

    // Footer
    set("documentNo", receiptNo);
    set("issueDate", today);

    // QR Code
    if (typeof QRCode !== "undefined") {

        QRCode.toCanvas(
            shipment.tracking,
            {
                width: 120,
                margin: 1
            },
            function (err, canvas) {

                if (!err) {
                    document.getElementById("qrcode").appendChild(canvas);
                }

            }
        );

    }

});

// ==========================================
// Print Receipt
// ==========================================

function printReceipt() {

    window.print();

              }
