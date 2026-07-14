document.getElementById("shipmentForm").addEventListener("submit", function(e){

    e.preventDefault();

    let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    let tracking = "AGL" + Math.floor(100000 + Math.random() * 900000);

    let shipment = {
        tracking: tracking,
        sender: document.getElementById("sender").value,
        receiver: document.getElementById("receiver").value,
        package: document.getElementById("package").value,
        weight: document.getElementById("weight").value + " kg",
        status: "Shipment Created"
    };

    shipments.push(shipment);

    localStorage.setItem("shipments", JSON.stringify(shipments));

    alert("Shipment Created Successfully!\nTracking Number: " + tracking);

    this.reset();
});
