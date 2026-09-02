// ======================================================
// American Global Logistics
// Admin Dashboard v4.0
// Part 1 - Foundation & Dashboard
// ======================================================

"use strict";

// ======================================================
// STORAGE
// ======================================================

let shipments =
JSON.parse(localStorage.getItem("shipments")) || [];

let customerMessages =
JSON.parse(localStorage.getItem("customerMessages")) || [];

let activityLog =
JSON.parse(localStorage.getItem("activityLog")) || [];

let currentShipmentIndex = -1;


// ======================================================
// SAVE FUNCTIONS
// ======================================================

function saveShipments(){

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

}

function saveMessages(){

    localStorage.setItem(
        "customerMessages",
        JSON.stringify(customerMessages)
    );

}

function saveActivity(){

    localStorage.setItem(
        "activityLog",
        JSON.stringify(activityLog)
    );

}


// ======================================================
// ACTIVITY
// ======================================================

function addActivity(message, icon = "📦"){

    activityLog.unshift({

        message: message,
        icon: icon,
        time: new Date().toLocaleString()

    });

    if(activityLog.length > 50){

        activityLog.pop();

    }

    saveActivity();

    loadActivity();

}


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateDashboard(){

    const total =
    document.getElementById("totalShipments");

    const awaiting =
    document.getElementById("awaiting");

    const transit =
    document.getElementById("inTransit");

    const delivered =
    document.getElementById("delivered");

    if(total){

        total.textContent = shipments.length;

    }

    if(awaiting){

        awaiting.textContent =
        shipments.filter(function(s){

            return s.status === "Awaiting Pickup";

        }).length;

    }

    if(transit){

        transit.textContent =
        shipments.filter(function(s){

            return s.status === "In Transit";

        }).length;

    }

    if(delivered){

        delivered.textContent =
        shipments.filter(function(s){

            return s.status === "Delivered";

        }).length;

    }

    const messageCount =
    document.getElementById("messageCount");

    if(messageCount){

        messageCount.textContent =
        customerMessages.length;

    }

}


// ======================================================
// LOAD SHIPMENTS
// ======================================================

function loadShipments(){

    shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    const table =
    document.getElementById("shipmentTable");

    if(!table) return;

    table.innerHTML = "";

    if(shipments.length === 0){

        table.innerHTML = `
        <tr>

            <td colspan="6"
            style="text-align:center;padding:30px;">

                No Shipments Found

            </td>

        </tr>
        `;

        updateDashboard();

        return;

    }

    shipments.forEach(function(shipment,index){

        table.innerHTML += `

        <tr>

            <td>

                ${shipment.tracking || shipment.trackingNumber}

            </td>

            <td>

                ${shipment.senderName || ""}

            </td>

            <td>

                ${shipment.receiverName || ""}

            </td>

            <td>

                ${shipment.status || ""}

            </td>

            <td>

                ${shipment.location || ""}

            </td>

            <td>

                <button
                onclick="editShipment(${index})">

                Edit

                </button>

                <button
                onclick="deleteShipment(${index})">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

    updateDashboard();

}


// ======================================================
// CREATE NEW SHIPMENT
// ======================================================

function newShipment(){

    window.location.href =
    "create-shipment.html";

}

// ======================================================
// PART 2 - SHIPMENT MANAGEMENT
// ======================================================

// ------------------------------------------------------
// EDIT SHIPMENT
// ------------------------------------------------------

function editShipment(index){

    currentShipmentIndex = index;

    const shipment = shipments[index];

    if(!shipment) return;

    document.getElementById("editTracking").value =
        shipment.tracking || shipment.trackingNumber || "";

    document.getElementById("editSender").value =
        shipment.senderName || "";

    document.getElementById("editReceiver").value =
        shipment.receiverName || "";

    document.getElementById("editStatus").value =
        shipment.status || "";

    document.getElementById("editLocation").value =
        shipment.location || "";

    document.getElementById("editDelivery").value =
        shipment.delivery || "";

    document.getElementById("editInstructions").value =
        shipment.instructions || "";

    document
        .getElementById("editPanel")
        .scrollIntoView({
            behavior: "smooth"
        });

}

// ------------------------------------------------------
// SAVE SHIPMENT
// ------------------------------------------------------

function saveShipment(){

    if(currentShipmentIndex < 0){

        alert("Please select a shipment first.");

        return;

    }

    const shipment = shipments[currentShipmentIndex];

    shipment.tracking =
        document.getElementById("editTracking").value;

    shipment.senderName =
        document.getElementById("editSender").value;

    shipment.receiverName =
        document.getElementById("editReceiver").value;

    shipment.status =
        document.getElementById("editStatus").value;

    shipment.location =
        document.getElementById("editLocation").value;

    shipment.delivery =
        document.getElementById("editDelivery").value;

    shipment.instructions =
        document.getElementById("editInstructions").value;

    saveShipments();

    loadShipments();

    addActivity(
        "Shipment updated",
        "✏️"
    );

    alert("Shipment updated successfully.");

}

// ------------------------------------------------------
// DELETE SHIPMENT
// ------------------------------------------------------

function deleteShipment(index){

    if(!confirm("Delete this shipment?")){

        return;

    }

    shipments.splice(index,1);

    saveShipments();

    loadShipments();

    addActivity(
        "Shipment deleted",
        "🗑️"
    );

    updateDashboard();

}

// ------------------------------------------------------
// DELETE CURRENT SHIPMENT
// ------------------------------------------------------

function deleteCurrentShipment(){

    if(currentShipmentIndex < 0){

        alert("Please load a shipment first.");

        return;

    }

    if(!confirm("Delete this shipment?")){

        return;

    }

    shipments.splice(currentShipmentIndex,1);

    currentShipmentIndex = -1;

    saveShipments();

    loadShipments();

    updateDashboard();

    addActivity(
        "Shipment deleted",
        "🗑️"
    );

    document.getElementById("editTracking").value = "";
    document.getElementById("editSender").value = "";
    document.getElementById("editReceiver").value = "";
    document.getElementById("editStatus").value = "";
    document.getElementById("editLocation").value = "";
    document.getElementById("editDelivery").value = "";
    document.getElementById("editInstructions").value = "";

}

// ------------------------------------------------------
// SEARCH SHIPMENTS
// ------------------------------------------------------

function searchShipments(){

    const keyword =
        document
        .getElementById("searchShipment")
        .value
        .toLowerCase();

    const table =
        document.getElementById("shipmentTable");

    table.innerHTML = "";

    shipments.forEach(function(shipment,index){

        const tracking =
            (shipment.tracking || shipment.trackingNumber || "")
            .toLowerCase();

        const sender =
            (shipment.senderName || "")
            .toLowerCase();

        const receiver =
            (shipment.receiverName || "")
            .toLowerCase();

        if(

            tracking.includes(keyword) ||

            sender.includes(keyword) ||

            receiver.includes(keyword)

        ){

            table.innerHTML += `

            <tr>

                <td>${shipment.tracking || shipment.trackingNumber}</td>

                <td>${shipment.senderName}</td>

                <td>${shipment.receiverName}</td>

                <td>${shipment.status}</td>

                <td>${shipment.location}</td>

                <td>

                    <button
                    onclick="editShipment(${index})">

                    Edit

                    </button>

                    <button
                    onclick="deleteShipment(${index})">

                    Delete

                    </button>

                </td>

            </tr>

            `;

        }

    });

}

// ======================================================
// PART 3 - CUSTOMER MESSAGES
// ======================================================

function loadCustomerMessages(){

    customerMessages =
        JSON.parse(localStorage.getItem("customerMessages")) || [];

    const container =
        document.getElementById("customerMessages");

    const count =
        document.getElementById("messageCount");

    if(!container) return;

    if(count){
        count.textContent = customerMessages.length;
    }

    if(customerMessages.length === 0){

        container.innerHTML = `

        <div class="empty-messages">

            <div class="empty-icon">💬</div>

            <h3>No Customer Messages</h3>

            <p>Customer messages will appear here.</p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    customerMessages.forEach(function(message,index){

        container.innerHTML += `

        <div class="message-card">

            <strong>${message.name || "Customer"}</strong><br>

            ${message.email || ""}

            <p style="margin:10px 0;">

                ${message.message || ""}

            </p>

            <button
            onclick="replyToCustomer(${index})">

                Reply

            </button>

            <button
            onclick="deleteCustomerMessage(${index})">

                Delete

            </button>

        </div>

        <hr>

        `;

    });

}


// ======================================================
// DELETE CUSTOMER MESSAGE
// ======================================================

function deleteCustomerMessage(index){

    if(!confirm("Delete this message?")){

        return;

    }

    customerMessages.splice(index,1);

    saveMessages();

    loadCustomerMessages();

    updateDashboard();

    addActivity(
        "Customer message deleted",
        "💬"
    );

}


// ======================================================
// REPLY
// ======================================================

function replyToCustomer(index){

    const msg = customerMessages[index];

    if(!msg){

        return;

    }

    if(!msg.email){

        alert("Customer has no email address.");

        return;

    }

    window.location.href =
        "mailto:" + msg.email;

}


// ======================================================
// ACTIVITY LOG
// ======================================================

function loadActivity(){

    activityLog =
        JSON.parse(localStorage.getItem("activityLog")) || [];

    const container =
        document.getElementById("activityLog");

    if(!container){

        return;

    }

    if(activityLog.length === 0){

        container.innerHTML = `

        <div class="empty-activity">

            <div class="empty-icon">📋</div>

            <h3>No Recent Activity</h3>

            <p>Dashboard activity will appear here.</p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    activityLog.forEach(function(item){

        container.innerHTML += `

        <div class="activity-item">

            <strong>

                ${item.icon}

                ${item.message}

            </strong>

            <br>

            <small>

                ${item.time}

            </small>

        </div>

        <hr>

        `;

    });

}


// ======================================================
// VIEW RECEIPT
// ======================================================

const receiptButton =
document.getElementById("viewReceipt");

if(receiptButton){

    receiptButton.addEventListener("click",function(){

        if(currentShipmentIndex < 0){

            alert("Please select a shipment first.");

            return;

        }

        const shipment =
            shipments[currentShipmentIndex];

        window.open(

            "receipt.html?tracking=" +

            (shipment.tracking ||
             shipment.trackingNumber),

            "_blank"

        );

    });

}


// ======================================================
// LOGOUT
// ======================================================

const logoutButton =
document.getElementById("logoutBtn");

if(logoutButton){

    logoutButton.addEventListener("click",function(){

        if(confirm("Logout from dashboard?")){

            window.location.href =
            "admin-login.html";

        }

    });

}


// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(function(){

    shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    customerMessages =
    JSON.parse(localStorage.getItem("customerMessages")) || [];

    activityLog =
    JSON.parse(localStorage.getItem("activityLog")) || [];

    loadShipments();

    loadCustomerMessages();

    loadActivity();

    updateDashboard();

},5000);


// ======================================================
// INITIALIZE DASHBOARD
// ======================================================

document.addEventListener("DOMContentLoaded",function(){

    shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    customerMessages =
    JSON.parse(localStorage.getItem("customerMessages")) || [];

    activityLog =
    JSON.parse(localStorage.getItem("activityLog")) || [];

    loadShipments();

    loadCustomerMessages();

    loadActivity();

    updateDashboard();

});
