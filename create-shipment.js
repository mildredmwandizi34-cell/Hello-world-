document.getElementById("shipmentForm").addEventListener("submit", function(e){

    e.preventDefault();

    let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    let tracking = "AGL" + Math.floor(100000 + Math.random() * 900000);

    let shipment = {

        // Basic Information
        tracking: tracking,
        sender: document.getElementById("sender").value,
        receiver: document.getElementById("receiver").value,
        package: document.getElementById("package").value,
        weight: document.getElementById("weight").value + " kg",

        // Shipping Details
        service: document.getElementById("service").value,

        origin: "",
        destination: "",

        route: "",

        // Shipment Status
        status: "Shipment Created",
        progress: 5,

        // Tracking
        location: "American Global Logistics Warehouse",

        vehicle: "Waiting for Dispatch",

        delivery: "Pending",

        // Shipment History
        history:
            "📦 Shipment Created<br>" +
            "📍 American Global Logistics Warehouse<br>" +
            "🕒 " + new Date().toLocaleString()

    };

    shipments.push(shipment);

    localStorage.setItem("shipments", JSON.stringify(shipments));

// Show the receipt
document.getElementById("receipt").style.display = "block";

document.getElementById("receiptContent").innerHTML = `
// Generate QR Code
document.getElementById("qrcode").innerHTML = "";

new QRCode(document.getElementById("qrcode"), {
    text: shipment.tracking,
    width: 140,
    height: 140
});

<h2 style="text-align:center;color:#0b4ea2;font-size:34px;">
${shipment.tracking}
</h2>

<table style="width:100%;border-collapse:collapse;">

<tr>
<td><strong>Sender</strong></td>
<td>${shipment.sender}</td>
</tr>

<tr>
<td><strong>Receiver</strong></td>
<td>${shipment.receiver}</td>
</tr>

<tr>
<td><strong>Package</strong></td>
<td>${shipment.package}</td>
</tr>

<tr>
<td><strong>Weight</strong></td>
<td>${shipment.weight}</td>
</tr>

<tr>
<td><strong>Shipping Service</strong></td>
<td>${shipment.service}</td>
</tr>

<tr>
<td><strong>Origin</strong></td>
<td>${shipment.origin || "Not Assigned"}</td>
</tr>

<tr>
<td><strong>Destination</strong></td>
<td>${shipment.destination || "Not Assigned"}</td>
</tr>

<tr>
<td><strong>Status</strong></td>
<td>${shipment.status}</td>
</tr>

<tr>
<td><strong>Created On</strong></td>
<td>${new Date().toLocaleString()}</td>
</tr>

</table>

<hr>
<div style="text-align:center;margin:25px 0;">
    <div id="qrcode"></div>
</div>
<p style="text-align:center;color:#666;">
Thank you for choosing
<strong>American Global Logistics</strong>.
Please keep this receipt for tracking and future reference.
</p>

`;

alert("Shipment Created Successfully!");

this.reset();
