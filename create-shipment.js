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

    event.preventDefault();

// Generate IDs
const trackingNumber = "AGL" + Math.floor(100000 + Math.random() * 900000);
const receiptNumber = "RCP-" + Date.now();

// Build the shipment object
const shipment = {

    tracking: trackingNumber,
    receiptNumber: receiptNumber,

    referenceNumber: document.getElementById("referenceNumber").value,
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
    package: document.getElementById("package").value,
    packageType: document.getElementById("packageType").value,
    pieces: document.getElementById("pieces").value,
    weight: document.getElementById("weight").value + " kg",
    dimensions: document.getElementById("dimensions").value,
    declaredValue: document.getElementById("declaredValue").value,
    service: document.getElementById("service").value,
    paymentStatus: document.getElementById("paymentStatus").value,
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

// Save to localStorage
localStorage.setItem("shipments", JSON.stringify(shipments));

// Show the receipt area
document.getElementById("receipt").style.display = "block";

    // Display the receipt

document.getElementById("receiptContent").innerHTML = `

<div style="background:#ffffff;
border:2px solid #0b4ea2;
border-radius:12px;
padding:35px;
font-family:Arial,sans-serif;
max-width:900px;
margin:auto;
box-shadow:0 8px 20px rgba(0,0,0,.15);">

<div style="display:flex;
justify-content:space-between;
align-items:center;
border-bottom:3px solid #0b4ea2;
padding-bottom:20px;">

<div>

<img src="image/file_00000000fb107243823fd30bcb45f00f.png"
style="height:80px;">

<h2 style="margin:8px 0;color:#0b4ea2;">
American Global Logistics
</h2>

<p style="margin:0;">
Reliable Worldwide Shipping Solutions
</p>

</div>

<div style="text-align:right;">

<h3 style="margin:0;">
SHIPMENT RECEIPT
</h3>

<p><strong>Tracking:</strong> ${shipment.tracking}</p>

<p><strong>Receipt No:</strong> ${shipment.receiptNumber}</p>

<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

</div>

</div>
`;
    
<hr style="margin:25px 0;">

<div style="display:flex;gap:20px;margin-bottom:25px;">

    <div style="flex:1;border:1px solid #d9d9d9;border-radius:8px;padding:20px;">

        <h3 style="margin-top:0;color:#0b4ea2;">
            Sender Information
        </h3>

        <p><strong>Name:</strong> ${shipment.senderName}</p>

        <p><strong>Company:</strong> ${shipment.senderCompany || "-"}</p>

        <p><strong>Address:</strong><br>
        ${shipment.senderAddress}</p>

        <p>${shipment.senderCity}, ${shipment.senderCountry}</p>

        <p><strong>Phone:</strong> ${shipment.senderPhone}</p>

        <p><strong>Email:</strong> ${shipment.senderEmail}</p>

    </div>

    <div style="flex:1;border:1px solid #d9d9d9;border-radius:8px;padding:20px;">

        <h3 style="margin-top:0;color:#0b4ea2;">
            Receiver Information
        </h3>

        <p><strong>Name:</strong> ${shipment.receiverName}</p>

        <p><strong>Company:</strong> ${shipment.receiverCompany || "-"}</p>

        <p><strong>Address:</strong><br>
        ${shipment.receiverAddress}</p>

        <p>${shipment.receiverCity}, ${shipment.receiverCountry}</p>

        <p><strong>Phone:</strong> ${shipment.receiverPhone}</p>

        <p><strong>Email:</strong> ${shipment.receiverEmail}</p>

    </div>

</div>

    <hr style="margin:25px 0;">

<h3 style="color:#0b4ea2;margin-bottom:15px;">
Shipment Details
</h3>

<table style="
width:100%;
border-collapse:collapse;
margin-bottom:25px;
">

<tr style="background:#0b4ea2;color:#fff;">

<th style="padding:12px;text-align:left;">Field</th>

<th style="padding:12px;text-align:left;">Information</th>

</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Package Description</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.package}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Package Type</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.packageType}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Pieces</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.pieces}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Weight</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.weight}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Dimensions</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.dimensions}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Declared Value</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.declaredValue}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Shipping Service</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.service}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Payment Status</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.paymentStatus}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Insurance</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.insurance}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Origin</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.origin}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Destination</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.destination}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Estimated Delivery</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.delivery}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Current Status</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.status}</td>
</tr>

<tr>
<td style="padding:10px;border:1px solid #ddd;"><strong>Current Location</strong></td>
<td style="padding:10px;border:1px solid #ddd;">${shipment.location}</td>
</tr>

</table>

<hr style="margin:30px 0;">

<h3 style="color:#0b4ea2;margin-bottom:20px;">
Authorization & Verification
</h3>

<div style="display:flex;justify-content:space-between;gap:30px;align-items:flex-end;">

    <!-- Sender Signature -->
    <div style="width:30%;text-align:center;">

        <div style="
        font-family:'Brush Script MT','Segoe Script','Lucida Handwriting',cursive;
        font-size:38px;
        color:#1b4fa3;
        transform:rotate(-4deg);
        letter-spacing:1px;
        margin-bottom:8px;
        text-shadow:0 1px 1px rgba(0,0,0,.15);
        ">
        ${shipment.senderSignature}
        </div>

        <div style="border-top:1px solid #000;padding-top:6px;">
            Sender Signature
        </div>

    </div>

    <!-- AGL Officer Signature -->
    <div style="width:30%;text-align:center;">

        <div style="
        font-family:'Brush Script MT','Segoe Script','Lucida Handwriting',cursive;
        font-size:36px;
        color:#003c8f;
        transform:rotate(-2deg);
        margin-bottom:8px;
        text-shadow:0 1px 1px rgba(0,0,0,.15);
        ">
        ${shipment.authorizedOfficer}
        </div>

        <div style="border-top:1px solid #000;padding-top:6px;">
            Authorized AGL Officer
        </div>

    </div>

    <!-- Company Stamp -->
    <div style="width:30%;text-align:center;">

        <div style="
        display:inline-block;
        border:4px solid #0b4ea2;
        color:#0b4ea2;
        padding:18px 26px;
        font-weight:bold;
        border-radius:10px;
        transform:rotate(-8deg);
        font-size:15px;
        line-height:1.5;
        text-transform:uppercase;
        ">

        AMERICAN GLOBAL<br>
        LOGISTICS

        <hr style="border:1px solid #0b4ea2;margin:8px 0;">

        ✔ AUTHORIZED

        <hr style="border:1px solid #0b4ea2;margin:8px 0;">

        LONDON HQ

        </div>

        <div style="margin-top:10px;">
            Official Company Stamp
        </div>

    </div>

</div>

<hr style="margin:35px 0;">

<div style="text-align:center;color:#666;font-size:14px;">

This document is electronically generated by
<strong>American Global Logistics</strong> and serves as proof of shipment creation.

<br><br>

Customer Support: support@americangloballogistics.com

<br>

www.americangloballogistics.com

</div>
