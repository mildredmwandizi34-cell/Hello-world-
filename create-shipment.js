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
        service: "Air Freight",

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

    alert(
        "Shipment Created Successfully!\n\nTracking Number: " +
        tracking
    );

    this.reset();

});
