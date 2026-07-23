function trackShipment() {

    const tracking = document.getElementById("trackingNumber").value.trim().toUpperCase();

    const shipments = {

        "AGL123456": {
            status: "In Transit",
            location: "New York Distribution Center",
            delivery: "15 July 2026",
            route: "New York → London",
            trackNo: "AGL123456",
            sender: "American Global Logistics",
            recipient: "John Smith",
            origin: "New York, USA",
            destination: "London, United Kingdom",
            service: "Express Air Freight",
            weight: "12.5 kg",
            receiverName: "Not Delivered",
            deliveryDate: "Pending",
            deliveryTime: "Pending",
            signature: "Pending Delivery",
            progress: `
<li>✅ Shipment Created</li>
<li>✅ Picked Up</li>
<li>✅ Arrived at International Hub</li>
<li>🟡 Customs Clearance</li>
<li>⬜ Out for Delivery</li>
<li>⬜ Delivered</li>
`,
            history: `
                <tr>
                    <td>10 Jul 2026</td>
                    <td>09:15</td>
                    <td>Shipment Created</td>
                    <td>New York, USA</td>
                </tr>

                <tr>
                    <td>11 Jul 2026</td>
                    <td>07:40</td>
                    <td>Picked Up</td>
                    <td>New York, USA</td>
                </tr>

                <tr>
                    <td>12 Jul 2026</td>
                    <td>18:20</td>
                    <td>Departed International Hub</td>
                    <td>New York, USA</td>
                </tr>
            `
        },

        "AGL654321": {
            status: "Delivered",
            location: "Toronto, Canada",
            delivery: "Delivered on 10 July 2026",
            route: "Los Angeles → Toronto",
            trackNo: "AGL654321",
            sender: "American Global Logistics",
            recipient: "Sarah Johnson",
            origin: "Los Angeles, USA",
            destination: "Toronto, Canada",
            service: "Express Air Freight",
            weight: "8.4 kg",
            receiverName: "Sarah Johnson",
            deliveryDate: "10 July 2026",
            deliveryTime: "2:45 PM",
            signature: "Sarah Johnson",
            progress: `
<li>✅ Shipment Created</li>
<li>✅ Picked Up</li>
<li>✅ Arrived at International Hub</li>
<li>✅ Customs Clearance</li>
<li>✅ Out for Delivery</li>
<li>✅ Delivered</li>
`,
            history: `
                <tr>
                    <td>08 Jul 2026</td>
                    <td>10:30</td>
                    <td>Shipment Created</td>
                    <td>Los Angeles, USA</td>
                </tr>

                <tr>
                    <td>09 Jul 2026</td>
                    <td>08:50</td>
                    <td>Out for Delivery</td>
                    <td>Toronto, Canada</td>
                </tr>

                <tr>
                    <td>10 Jul 2026</td>
                    <td>14:45</td>
                    <td>Delivered</td>
                    <td>Toronto, Canada</td>
                </tr>
            `
        },

        "AGL987654": {
            status: "Customs Clearance",
            location: "Dubai, UAE",
            delivery: "17 July 2026",
            route: "Dubai → Nairobi",
            trackNo: "AGL987654",
            sender: "American Global Logistics",
            recipient: "Michael Brown",
            origin: "Dubai, UAE",
            destination: "Nairobi, Kenya",
            service: "Priority Air Cargo",
            weight: "18.2 kg",
            receiverName: "Not Delivered",
            deliveryDate: "Pending",
            deliveryTime: "Pending",
            signature: "Pending Delivery",
            progress: `
<li>✅ Shipment Created</li>
<li>✅ Picked Up</li>
<li>✅ Arrived at International Hub</li>
<li>🟡 Customs Clearance</li>
<li>⬜ Out for Delivery</li>
<li>⬜ Delivered</li>
`,
            history: `
                <tr>
                    <td>13 Jul 2026</td>
                    <td>08:20</td>
                    <td>Shipment Created</td>
                    <td>Dubai, UAE</td>
                </tr>

                <tr>
                    <td>14 Jul 2026</td>
                    <td>12:40</td>
                    <td>Arrived at Hub</td>
                    <td>Dubai, UAE</td>
                </tr>

                <tr>
                    <td>15 Jul 2026</td>
                    <td>16:10</td>
                    <td>Customs Clearance</td>
                    <td>Dubai, UAE</td>
                </tr>
            `
        }

    };

    const shipments = {
   ...
};

const shipment = shipments[tracking];

    if (!shipment) {

        alert("Tracking number not found.");

        return;

    }

    document.getElementById("status").textContent = shipment.status;
    document.getElementById("location").textContent = shipment.location;
    document.getElementById("delivery").textContent = shipment.delivery;
    document.getElementById("route").textContent = shipment.route;
    document.getElementById("trackNo").textContent = shipment.trackNo;
    document.getElementById("sender").textContent = shipment.sender;
    document.getElementById("recipient").textContent = shipment.receiver;
    document.getElementById("origin").textContent = shipment.origin;
    document.getElementById("destination").textContent = shipment.destination;
    document.getElementById("service").textContent = shipment.service;
    document.getElementById("weight").textContent = shipment.weight;
    document.getElementById("receiverName").textContent = shipment.receiverName;
    document.getElementById("deliveryDate").textContent = shipment.deliveryDate;
    document.getElementById("deliveryTime").textContent = shipment.deliveryTime;
    document.getElementById("signatureBox").textContent = shipment.signature;
    document.getElementById("progressList").innerHTML = shipment.progress;
    document.getElementById("historyTable").innerHTML = shipment.history;

    document.getElementById("result").style.display = "block";

          }
