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

<div style="text-align:center;">

<img
src="image/file_00000000fb107243823fd30bcb45f00f.png"
style="width:90px;margin-bottom:10px;">

<h2 style="
margin:0;
color:#0b4ea2;
font-size:30px;">
American Global Logistics
</h2>

<p style="
margin:5px 0 20px;
font-size:18px;
color:#555;">
Official Shipment Receipt
</p>
<p style="text-align:center;font-size:14px;color:#555;line-height:1.6;">

Website: www.americangloballogistics.com<br>

Email: support@americangloballogistics.com<br>

Phone: +1 (800) 555-2040
Phone: +506 71542765
Phone: +57 3123615392
Phone: +504 98241362
</p>

<hr>
<div style="
background:#0b4ea2;
color:white;
padding:18px;
font-size:32px;
font-weight:bold;
text-align:center;
border-radius:8px;
letter-spacing:3px;
margin:25px 0;">

${shipment.tracking}

</div>

</div>

<table style="
width:100%;
margin-top:25px;
border-collapse:collapse;
font-size:16px;">

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Sender</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.sender}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Receiver</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.receiver}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Package</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.package}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Weight</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.weight}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Shipping Service</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.service}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Origin</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.origin || "Pending Assignment"}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Destination</strong></td>
<td style="padding:12px;border:1px solid #ddd;">${shipment.destination || "Pending Assignment"}</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Status</strong></td>
<td style="padding:12px;border:1px solid #ddd;color:#0b4ea2;font-weight:bold;">
${shipment.status}
</td>
</tr>

<tr>
<td style="padding:12px;border:1px solid #ddd;background:#f5f8fc;"><strong>Date Created</strong></td>
<td style="padding:12px;border:1px solid #ddd;">
${new Date().toLocaleString()}
</td>
</tr>

</table>

<div style="text-align:center;margin-top:30px;">

<div id="qrcode"></div>

<p style="
margin-top:15px;
color:#777;
font-size:14px;">

Scan this QR code to identify this shipment.

</p>

</div>

<hr style="margin:30px 0;">

<p style="
text-align:center;
font-size:15px;
color:#666;">

Thank you for choosing
<strong>American Global Logistics</strong>.

</p>

<hr style="margin-top:35px;">

<table style="width:100%;margin-top:20px;">

<tr>

<td style="text-align:left;">

<strong>Authorised By</strong><br><br>

_________________________<br>

American Global Logistics

</td>

<td style="text-align:right;">

<div style="
width:120px;
height:120px;
border:2px dashed #0b4ea2;
border-radius:50%;
display:inline-flex;
align-items:center;
justify-content:center;
color:#0b4ea2;
font-weight:bold;
font-size:14px;">

AGL<br>OFFICIAL<br>STAMP

</div>

</td>

</tr>

</table>

<p style="
margin-top:30px;
text-align:center;
font-size:13px;
color:#777;">

This document serves as official proof that the shipment has been registered with American Global Logistics.

</p>

`;
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
