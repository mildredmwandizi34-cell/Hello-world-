// ===========================================
// American Global Logistics
// Create Shipment System
// ===========================================

// Load saved shipments
let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    const shipmentForm = document.getElementById("shipmentForm");

    if (!shipmentForm) {
        console.error("Shipment form not found.");
        return;
    }

    shipmentForm.addEventListener("submit", createShipment);

});

// ===========================================
// Create Shipment
// ===========================================

function createShipment (event) {

    alert("Create Shipment button is working");

    event.preventDefault();

// Generate IDs
const trackingNumber = "AGL" + Math.floor(100000 + Math.random() * 900000);
const receiptNumber = "RCP-" + Date.now();

// Build the shipment object
const shipment = {

    trackingNumber: trackingNumber,
tracking: trackingNumber,
    receiptNumber: receiptNumber,
    receiptDate: new Date().toLocaleDateString(),
documentNo: "DOC-" + Math.floor(100000 + Math.random() * 900000),
issueDate: new Date().toLocaleDateString(),
verificationCode: Math.random().toString(36).substring(2,10).toUpperCase(),
shipmentId: "SHP-" + Date.now(),
createdTime: new Date().toLocaleString(),
barcodeNumber: trackingNumber,

    reference: document.getElementById("referenceNumber").value,
    customerReference: document.getElementById("customerReference").value,

    // Sender
    senderName: document.getElementById("senderName").value,
    senderCompany: document.getElementById("senderCompany").value,
    senderAddress: document.getElementById("senderAddress").value,
    senderCity: document.getElementById("senderCity").value,
    senderCountry: document.getElementById("senderCountry").value,
    senderPhone: document.getElementById("senderPhone").value,
    senderEmail: document.getElementById("senderEmail").value,

    // Receiver
    receiverName: document.getElementById("receiverName").value,
    receiverCompany: document.getElementById("receiverCompany").value,
    receiverAddress: document.getElementById("receiverAddress").value,
    receiverCity: document.getElementById("receiverCity").value,
    receiverCountry: document.getElementById("receiverCountry").value,
    receiverPhone: document.getElementById("receiverPhone").value,
    receiverEmail: document.getElementById("receiverEmail").value,

    // Shipment
    description: document.getElementById("package").value,
    descriptionType: document.getElementById("packageType").value,
    pieces: document.getElementById("pieces").value,
    weight: document.getElementById("weight").value + " kg",
    dimensions: document.getElementById("dimensions").value,
    value: document.getElementById("declaredValue").value,
    service: document.getElementById("service").value,
    payment: document.getElementById("paymentStatus").value,
    insurance: document.getElementById("insurance").value,
    origin: document.getElementById("origin").value,
    destination: document.getElementById("destination").value,
    delivery: document.getElementById("deliveryDate").value,
    instructions: document.getElementById("instructions").value,

    // Charges
    shippingCost: document.getElementById("shippingCost").value,
    tax: document.getElementById("tax").value,
    discount: document.getElementById("discount").value,
    totalAmount: document.getElementById("totalAmount").value,

    // Signatures
    senderSignature: document.getElementById("senderSignature").value,
    authorizedOfficer: document.getElementById("authorizedOfficer").value,

    // Barcode
    barcode: document.getElementById("trackingBarcode").value,

    // Tracking
    status: "Shipment Created",
    location: "American Global Logistics Warehouse",
    route: "To Be Assigned",
    progress: 5,

    history: [
        {
            date: new Date().toLocaleString(),
            status: "Shipment Created",
            location: "American Global Logistics Warehouse"
        }
    ]

};

    // Save shipment
shipments.push(shipment);

// Save all shipments
localStorage.setItem("shipments", JSON.stringify(shipments));

    let activities =
    JSON.parse(localStorage.getItem("activityLog")) || [];

activities.unshift({
    message: `Shipment ${shipment.tracking} was created`,
    icon: "📦",
    time: new Date().toLocaleString()
});

activities = activities.slice(0, 50);

localStorage.setItem(
    "activityLog",
    JSON.stringify(activities)
);

// Save the latest shipment for receipt.html
localStorage.setItem("shipment", JSON.stringify(shipment));

// Open receipt
window.location.href =
"receipt.html?tracking=" + shipment.trackingNumber;

}
