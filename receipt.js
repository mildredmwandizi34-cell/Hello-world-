function printReceipt() {

    let tracking = document.getElementById("receiptTracking").value.trim().toUpperCase();

    let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    let shipment = shipments.find(function(s){
        return s.tracking.toUpperCase() === tracking;
    });

    if(!shipment){
        alert("Tracking number not found.");
        return;
    }

    document.getElementById("receipt").style.display = "block";

    document.getElementById("receipt").innerHTML = `
<div style="max-width:700px;margin:auto;background:#fff;border:2px solid #0b4ea2;border-radius:10px;padding:30px;box-shadow:0 5px 15px rgba(0,0,0,.2);font-family:Arial,sans-serif;">

<div style="text-align:center;">
<img src="image/file_00000000fb107243823fd30bcb45f00f.png" style="height:80px;">
<h2 style="color:#0b4ea2;">American Global Logistics</h2>
<p><strong>Shipment Receipt</strong></p>
</div>

<hr>

<div style="text-align:center;background:#0b4ea2;color:#fff;padding:20px;border-radius:8px;margin:20px 0;">
<p style="margin:0;">TRACKING NUMBER</p>
<h1 style="margin:10px 0;font-size:38px;">
${shipment.tracking}
</h1>
</div>

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
<td><strong>Service</strong></td>
<td>${shipment.service}</td>
</tr>

<tr>
<td><strong>Status</strong></td>
<td>${shipment.status}</td>
</tr>

<tr>
<td><strong>Current Location</strong></td>
<td>${shipment.location}</td>
</tr>

<tr>
<td><strong>Estimated Delivery</strong></td>
<td>${shipment.delivery}</td>
</tr>

<tr>
<td><strong>Route</strong></td>
<td>${shipment.route}</td>
</tr>

</table>

<hr>

<p style="text-align:center;">
Thank you for choosing American Global Logistics.
</p>

<div style="text-align:center;margin-top:20px;">

<button onclick="window.print()" style="background:#0b4ea2;color:#fff;border:none;padding:15px 30px;border-radius:6px;cursor:pointer;">
🖨 Print Receipt
</button>

</div>

</div>
`;

      }
