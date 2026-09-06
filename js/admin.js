// ======================================================
// American Global Logistics
// Admin Dashboard v4.1
// Clean Complete Version
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

let statusChartInstance = null;
let serviceChartInstance = null;


// ======================================================
// SHIPMENT STATUS PROGRESS
// ======================================================

function getShipmentProgress(status) {

    const progressMap = {

        "Shipment Created": 5,
        "Awaiting Pickup": 15,
        "Picked Up": 25,
        "In Transit": 50,
        "Customs Cleared": 65,
        "Arrived at Destination Hub": 75,
        "Out for Delivery": 90,
        "Delivered": 100

    };

    return progressMap[status] || 0;
}


// ======================================================
// STORAGE HELPERS
// ======================================================

function saveShipments() {

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

}


function saveMessages() {

    localStorage.setItem(
        "customerMessages",
        JSON.stringify(customerMessages)
    );

}


function saveActivity() {

    localStorage.setItem(
        "activityLog",
        JSON.stringify(activityLog)
    );

}


// ======================================================
// SAFE VALUE HELPER
// ======================================================

function safeValue(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value);

}


// ======================================================
// ACTIVITY LOG
// ======================================================

function addActivity(message, icon = "📦") {

    activityLog.unshift({

        message: message,
        icon: icon,
        time: new Date().toLocaleString()

    });

    if (activityLog.length > 50) {

        activityLog = activityLog.slice(0, 50);

    }

    saveActivity();

    loadActivity();

}


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateDashboard() {

    const total =
        document.getElementById("totalShipments");

    const awaiting =
        document.getElementById("awaiting");

    const transit =
        document.getElementById("inTransit");

    const delivered =
        document.getElementById("delivered");

    if (total) {

        total.textContent =
            shipments.length;

    }

    if (awaiting) {

        awaiting.textContent =
            shipments.filter(function (shipment) {

                return shipment.status === "Awaiting Pickup";

            }).length;

    }

    if (transit) {

        transit.textContent =
            shipments.filter(function (shipment) {

                return shipment.status === "In Transit";

            }).length;

    }

    if (delivered) {

        delivered.textContent =
            shipments.filter(function (shipment) {

                return shipment.status === "Delivered";

            }).length;

    }

    const messageCount =
        document.getElementById("messageCount");

    if (messageCount) {

        messageCount.textContent =
            customerMessages.length;

    }

}


// ======================================================
// NORMALIZE EXISTING SHIPMENTS
// ======================================================

function normalizeShipments() {

    shipments.forEach(function (shipment) {

        if (!shipment) {
            return;
        }

        // --------------------------------------------------
        // Tracking
        // --------------------------------------------------

        if (!shipment.tracking &&
            shipment.trackingNumber) {

            shipment.tracking =
                shipment.trackingNumber;

        }


        // --------------------------------------------------
        // Progress
        // --------------------------------------------------

        if (shipment.status) {

            shipment.progress =
                getShipmentProgress(
                    shipment.status
                );

        }


        // --------------------------------------------------
        // History
        // --------------------------------------------------

        if (!Array.isArray(shipment.history)) {

            shipment.history = [];

        }


        // --------------------------------------------------
        // Create initial history entry for old shipments
        // --------------------------------------------------

        if (
            shipment.history.length === 0 &&
            shipment.status
        ) {

            shipment.history.push({

                status: shipment.status,

                location:
                    shipment.location || "",

                date:
                    shipment.createdAt ||
                    new Date().toLocaleString()

            });

        }

    });

}


// ======================================================
// LOAD SHIPMENTS
// ======================================================

function loadShipments() {

    shipments =
        JSON.parse(
            localStorage.getItem("shipments")
        ) || [];

    normalizeShipments();

    saveShipments();

    const table =
        document.getElementById("shipmentTable");

    if (!table) {

        updateDashboard();

        return;

    }

    table.innerHTML = "";

    if (shipments.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:30px;"
                >

                    No Shipments Found

                </td>

            </tr>

        `;

        updateDashboard();

        return;

    }


    shipments.forEach(function (shipment, index) {

        const tracking =
            safeValue(
                shipment.tracking ||
                shipment.trackingNumber
            );

        const sender =
            safeValue(
                shipment.senderName
            );

        const receiver =
            safeValue(
                shipment.receiverName
            );

        const status =
            safeValue(
                shipment.status
            );

        const location =
            safeValue(
                shipment.location
            );


        table.innerHTML += `

            <tr>

                <td>
                    ${tracking}
                </td>

                <td>
                    ${sender}
                </td>

                <td>
                    ${receiver}
                </td>

                <td>
                    ${status}
                </td>

                <td>
                    ${location}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editShipment(${index})"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteShipment(${index})"
                    >
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

function newShipment() {

    window.location.href =
        "create-shipment.html";

}


// ======================================================
// EDIT SHIPMENT
// ======================================================

function editShipment(index) {

    if (
        index < 0 ||
        index >= shipments.length
    ) {

        return;

    }

    currentShipmentIndex = index;

    const shipment =
        shipments[index];

    if (!shipment) {

        return;

    }


    const editTracking =
        document.getElementById("editTracking");

    const editSender =
        document.getElementById("editSender");

    const editReceiver =
        document.getElementById("editReceiver");

    const editStatus =
        document.getElementById("editStatus");

    const editLocation =
        document.getElementById("editLocation");

    const editDelivery =
        document.getElementById("editDelivery");

    const editInstructions =
        document.getElementById("editInstructions");


    if (editTracking) {

        editTracking.value =
            shipment.tracking ||
            shipment.trackingNumber ||
            "";

    }

    if (editSender) {

        editSender.value =
            shipment.senderName || "";

    }

    if (editReceiver) {

        editReceiver.value =
            shipment.receiverName || "";

    }

    if (editStatus) {

        editStatus.value =
            shipment.status || "";

    }

    if (editLocation) {

        editLocation.value =
            shipment.location || "";

    }

    if (editDelivery) {

        editDelivery.value =
            shipment.delivery || "";

    }

    if (editInstructions) {

        editInstructions.value =
            shipment.instructions || "";

    }


    const editPanel =
        document.getElementById("editPanel");

    if (editPanel) {

        editPanel.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


// ======================================================
// SAVE / UPDATE SHIPMENT
// ======================================================

function saveShipment() {

    if (
        currentShipmentIndex < 0 ||
        currentShipmentIndex >= shipments.length
    ) {

        alert("Please select a shipment first.");

        return;

    }


    const shipment =
        shipments[currentShipmentIndex];

    if (!shipment) {

        alert("Shipment could not be found.");

        return;

    }


    // --------------------------------------------------
    // Read new values
    // --------------------------------------------------

    const editTracking =
        document.getElementById("editTracking");

    const editSender =
        document.getElementById("editSender");

    const editReceiver =
        document.getElementById("editReceiver");

    const editStatus =
        document.getElementById("editStatus");

    const editLocation =
        document.getElementById("editLocation");

    const editDelivery =
        document.getElementById("editDelivery");

    const editInstructions =
        document.getElementById("editInstructions");


    const oldStatus =
        shipment.status || "";

    const oldLocation =
        shipment.location || "";


    const newTracking =
        editTracking ?
        editTracking.value.trim() :
        shipment.tracking || "";


    const newSender =
        editSender ?
        editSender.value.trim() :
        shipment.senderName || "";


    const newReceiver =
        editReceiver ?
        editReceiver.value.trim() :
        shipment.receiverName || "";


    const newStatus =
        editStatus ?
        editStatus.value :
        shipment.status || "";


    const newLocation =
        editLocation ?
        editLocation.value.trim() :
        shipment.location || "";


    const newDelivery =
        editDelivery ?
        editDelivery.value.trim() :
        shipment.delivery || "";


    const newInstructions =
        editInstructions ?
        editInstructions.value.trim() :
        shipment.instructions || "";


    // --------------------------------------------------
    // Update shipment
    // --------------------------------------------------

    shipment.tracking =
        newTracking;

    shipment.senderName =
        newSender;

    shipment.receiverName =
        newReceiver;

    shipment.status =
        newStatus;

    shipment.location =
        newLocation;

    shipment.delivery =
        newDelivery;

    shipment.instructions =
        newInstructions;


    // --------------------------------------------------
    // Automatically update progress
    // --------------------------------------------------

    shipment.progress =
        getShipmentProgress(
            shipment.status
        );


    // --------------------------------------------------
    // Ensure history exists
    // --------------------------------------------------

    if (!Array.isArray(shipment.history)) {

        shipment.history = [];

    }


    // --------------------------------------------------
    // Add history entry when status/location changes
    // --------------------------------------------------

    const lastHistory =
        shipment.history[
            shipment.history.length - 1
        ];


    const statusChanged =
        oldStatus !== newStatus;

    const locationChanged =
        oldLocation !== newLocation;


    if (
        !lastHistory ||
        statusChanged ||
        locationChanged
    ) {

        shipment.history.push({

            status:
                shipment.status,

            location:
                shipment.location,

            date:
                new Date().toLocaleString()

        });

    }


    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    saveShipments();

    loadShipments();

    updateDashboard();


    // --------------------------------------------------
    // Activity
    // --------------------------------------------------

    const tracking =
        shipment.tracking ||
        shipment.trackingNumber ||
        "Unknown shipment";


    addActivity(

        "Shipment " +
        tracking +
        " updated",

        "✏️"

    );


    alert(
        "Shipment updated successfully."
    );

}


// ======================================================
// DELETE SHIPMENT
// ======================================================

function deleteShipment(index) {

    if (
        index < 0 ||
        index >= shipments.length
    ) {

        return;

    }


    const shipment =
        shipments[index];

    const tracking =
        shipment ?
        (
            shipment.tracking ||
            shipment.trackingNumber ||
            "shipment"
        ) :
        "shipment";


    if (
        !confirm(
            "Delete this shipment?"
        )
    ) {

        return;

    }


    shipments.splice(index, 1);


    if (
        currentShipmentIndex === index
    ) {

        currentShipmentIndex = -1;

    }
    else if (
        currentShipmentIndex > index
    ) {

        currentShipmentIndex--;

    }


    saveShipments();

    loadShipments();

    updateDashboard();


    addActivity(

        "Shipment " +
        tracking +
        " deleted",

        "🗑️"

    );

}


// ======================================================
// DELETE CURRENT SHIPMENT
// ======================================================

function deleteCurrentShipment() {

    if (
        currentShipmentIndex < 0 ||
        currentShipmentIndex >= shipments.length
    ) {

        alert(
            "Please load a shipment first."
        );

        return;

    }


    const shipment =
        shipments[currentShipmentIndex];


    const tracking =
        shipment ?
        (
            shipment.tracking ||
            shipment.trackingNumber ||
            "shipment"
        ) :
        "shipment";


    if (
        !confirm(
            "Delete this shipment?"
        )
    ) {

        return;

    }


    shipments.splice(
        currentShipmentIndex,
        1
    );


    currentShipmentIndex = -1;


    saveShipments();

    loadShipments();

    updateDashboard();


    addActivity(

        "Shipment " +
        tracking +
        " deleted",

        "🗑️"

    );


    clearEditForm();

}


// ======================================================
// CLEAR EDIT FORM
// ======================================================

function clearEditForm() {

    const fields = [

        "editTracking",
        "editSender",
        "editReceiver",
        "editStatus",
        "editLocation",
        "editDelivery",
        "editInstructions"

    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.value = "";

        }

    });

}


// ======================================================
// SEARCH SHIPMENTS
// ======================================================

function searchShipments() {

    // Supports both IDs so older/newer HTML works
    const searchInput =
        document.getElementById(
            "searchShipment"
        ) ||
        document.getElementById(
            "searchInput"
        );


    const table =
        document.getElementById(
            "shipmentTable"
        );


    if (!searchInput || !table) {

        return;

    }


    const keyword =
        searchInput.value
        .trim()
        .toLowerCase();


    table.innerHTML = "";


    let found = false;


    shipments.forEach(
        function (shipment, index) {

            const tracking =
                safeValue(
                    shipment.tracking ||
                    shipment.trackingNumber
                ).toLowerCase();


            const sender =
                safeValue(
                    shipment.senderName
                ).toLowerCase();


            const receiver =
                safeValue(
                    shipment.receiverName
                ).toLowerCase();


            const status =
                safeValue(
                    shipment.status
                ).toLowerCase();


            const location =
                safeValue(
                    shipment.location
                ).toLowerCase();


            if (

                tracking.includes(keyword) ||

                sender.includes(keyword) ||

                receiver.includes(keyword) ||

                status.includes(keyword) ||

                location.includes(keyword)

            ) {

                found = true;


                table.innerHTML += `

                    <tr>

                        <td>
                            ${safeValue(
                                shipment.tracking ||
                                shipment.trackingNumber
                            )}
                        </td>

                        <td>
                            ${safeValue(
                                shipment.senderName
                            )}
                        </td>

                        <td>
                            ${safeValue(
                                shipment.receiverName
                            )}
                        </td>

                        <td>
                            ${safeValue(
                                shipment.status
                            )}
                        </td>

                        <td>
                            ${safeValue(
                                shipment.location
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                onclick="editShipment(${index})"
                            >
                                Edit
                            </button>

                            <button

                            type="button"
                                onclick="deleteShipment(${index})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }

        }
    );


    if (!found) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:30px;"
                >

                    No matching shipments found.

                </td>

            </tr>

        `;

    }

}


// ======================================================
// CUSTOMER MESSAGES
// ======================================================

function loadCustomerMessages() {

    customerMessages =
        JSON.parse(
            localStorage.getItem(
                "customerMessages"
            )
        ) || [];


    const container =
        document.getElementById(
            "customerMessages"
        );


    const count =
        document.getElementById(
            "messageCount"
        );


    if (count) {

        count.textContent =
            customerMessages.length;

    }


    if (!container) {

        return;

    }


    if (
        customerMessages.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-messages">

                <div class="empty-icon">
                    💬
                </div>

                <h3>
                    No Customer Messages
                </h3>

                <p>
                    Customer messages will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    customerMessages.forEach(
        function (message, index) {

            container.innerHTML += `

                <div class="message-card">

                    <strong>
                        ${safeValue(
                            message.name ||
                            "Customer"
                        )}
                    </strong>

                    <br>

                    ${safeValue(
                        message.email
                    )}

                    <p
                        style="margin:10px 0;"
                    >

                        ${safeValue(
                            message.message
                        )}

                    </p>

                    <button
                        type="button"
                        onclick="replyToCustomer(${index})"
                    >
                        Reply
                    </button>

                    <button
                        type="button"
                        onclick="deleteCustomerMessage(${index})"
                    >
                        Delete
                    </button>

                </div>

                <hr>

            `;

        }
    );

}


// ======================================================
// DELETE CUSTOMER MESSAGE
// ======================================================

function deleteCustomerMessage(index) {

    if (
        index < 0 ||
        index >= customerMessages.length
    ) {

        return;

    }


    if (
        !confirm(
            "Delete this message?"
        )
    ) {

        return;

    }


    customerMessages.splice(
        index,
        1
    );


    saveMessages();

    loadCustomerMessages();

    updateDashboard();


    addActivity(

        "Customer message deleted",

        "💬"

    );

}


// ======================================================
// REPLY TO CUSTOMER
// ======================================================

function replyToCustomer(index) {

    const message =
        customerMessages[index];


    if (!message) {

        return;

    }


    if (!message.email) {

        alert(
            "Customer has no email address."
        );

        return;

    }


    window.location.href =
        "mailto:" +
        message.email;

}


// ======================================================
// ACTIVITY LOG DISPLAY
// ======================================================

function loadActivity() {

    activityLog =
        JSON.parse(
            localStorage.getItem(
                "activityLog"
            )
        ) || [];


    const container =
        document.getElementById(
            "activityLog"
        );


    if (!container) {

        return;

    }


    if (
        activityLog.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-activity">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    No Recent Activity
                </h3>

                <p>
                    Dashboard activity will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    activityLog.forEach(
        function (item) {

            container.innerHTML += `

                <div class="activity-item">

                    <strong>

                        ${safeValue(
                            item.icon
                        )}

                        ${safeValue(
                            item.message
                        )}

                    </strong>

                    <br>

                    <small>

                        ${safeValue(
                            item.time
                        )}

                    </small>

                </div>

                <hr>

            `;

        }
    );

}


// ======================================================
// VIEW RECEIPT
// ======================================================

function viewSelectedReceipt() {

    if (
        currentShipmentIndex < 0 ||
        currentShipmentIndex >= shipments.length
    ) {

        alert(
            "Please select a shipment first."
        );

        return;

    }


    const shipment =
        shipments[currentShipmentIndex];


    if (!shipment) {

        return;

    }


    const tracking =
        shipment.tracking ||
        shipment.trackingNumber;


    if (!tracking) {

        alert(
            "This shipment has no tracking number."
        );

        return;

    }


    window.open(

        "receipt.html?tracking=" +
        encodeURIComponent(tracking),

        "_blank"

    );

}


// ======================================================
// LOGOUT
// ======================================================

function logoutAdmin() {

    if (
        confirm(
            "Logout from dashboard?"
        )
    ) {

        window.location.href =
            "admin-login.html";

    }

}


// ======================================================
// DASHBOARD CHARTS
// ======================================================

function loadDashboardCharts() {

    // Chart.js must exist
    if (
        typeof Chart === "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

        return;

    }


    const statusCanvas =
        document.getElementById(
            "statusChart"
        );


    const serviceCanvas =
        document.getElementById(
            "serviceChart"
        );


    if (
        !statusCanvas &&
        !serviceCanvas
    ) {

        return;

    }


    const storedShipments =
        JSON.parse(
            localStorage.getItem(
                "shipments"
            )
        ) || [];


    let statusCounts = {

        Created: 0,
        Awaiting: 0,
        Transit: 0,
        Delivered: 0

    };


    let serviceCounts = {

        Air: 0,
        Ocean: 0,
        Road: 0,
        Express: 0

    };


    storedShipments.forEach(
        function (shipment) {

            switch (
                shipment.status
            ) {

                case "Shipment Created":

                    statusCounts.Created++;

                    break;


                case "Awaiting Pickup":

                    statusCounts.Awaiting++;

                    break;


                case "In Transit":

                    statusCounts.Transit++;

                    break;


                case "Delivered":

                    statusCounts.Delivered++;

                    break;

            }


            switch (
                shipment.service
            ) {

                case "Air Freight":

                    serviceCounts.Air++;

                    break;


                case "Ocean Freight":

                    serviceCounts.Ocean++;

                    break;


                case "Road Transport":

                    serviceCounts.Road++;

                    break;


                case "Express Delivery":

                    serviceCounts.Express++;

                    break;

            }

        }
    );


    // --------------------------------------------------
    // Status Chart
    // --------------------------------------------------

    if (statusCanvas) {

        if (statusChartInstance) {

            statusChartInstance.destroy();

        }


        statusChartInstance =
            new Chart(
                statusCanvas,
                {

                    type: "doughnut",

                    data: {

                        labels: [

                            "Created",
                            "Awaiting",
                            "In Transit",
                            "Delivered"

                        ],

                        datasets: [{

                            data: [

                                statusCounts.Created,
                                statusCounts.Awaiting,
                                statusCounts.Transit,
                                statusCounts.Delivered

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }
            );

    }


    // --------------------------------------------------
    // Service Chart
    // --------------------------------------------------

    if (serviceCanvas) {

        if (serviceChartInstance) {

            serviceChartInstance.destroy();

        }


        serviceChartInstance =
            new Chart(
                serviceCanvas,
                {

                    type: "bar",

                    data: {

                        labels: [

                            "Air",
                            "Ocean",
                            "Road",
                            "Express"

                        ],

                        datasets: [{

                            label: "Shipments",

                            data: [

                                serviceCounts.Air,
                                serviceCounts.Ocean,
                                serviceCounts.Road,
                                serviceCounts.Express

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    precision: 0

                                }

                            }

                        }

                    }

                }
            );

    }

}


// ======================================================
// REFRESH EVERYTHING
// ======================================================

function refreshDashboard() {

    shipments =
        JSON.parse(
            localStorage.getItem(
                "shipments"
            )
        ) || [];


    customerMessages =
        JSON.parse(
            localStorage.getItem(
                "customerMessages"
            )
        ) || [];


    activityLog =
        JSON.parse(
            localStorage.getItem(
                "activityLog"
            )
        ) || [];


    loadShipments();

    loadCustomerMessages();

    loadActivity();

    updateDashboard();

}


// ======================================================
// SEARCH LISTENER
// ======================================================

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "searchShipment"
        ) ||
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        searchShipments
    );

}


// ======================================================
// RECEIPT BUTTON
// ======================================================

function initializeReceiptButton() {

    const receiptButton =
        document.getElementById(
            "viewReceipt"
        );


    if (!receiptButton) {

        return;

    }


    receiptButton.addEventListener(
        "click",
        viewSelectedReceipt
    );

}


// ======================================================
// LOGOUT BUTTON
// ======================================================

function initializeLogoutButton() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        logoutAdmin
    );

}


// ======================================================
// INITIALIZE DASHBOARD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        shipments =
            JSON.parse(
                localStorage.getItem(
                    "shipments"
                )
            ) || [];


        customerMessages =
            JSON.parse(
                localStorage.getItem(
                    "customerMessages"
                )
            ) || [];


        activityLog =
            JSON.parse(
                localStorage.getItem(
                    "activityLog"
                )
            ) || [];


        normalizeShipments();

        saveShipments();


        loadShipments();

        loadCustomerMessages();

        loadActivity();

        updateDashboard();

        initializeSearch();

        initializeReceiptButton();

        initializeLogoutButton();

        loadDashboardCharts();

    }
);


// ======================================================
// AUTOMATIC REFRESH
// ======================================================

setInterval(
    function () {

        refreshDashboard();

        // Refresh charts without creating duplicates
        loadDashboardCharts();

    },
    5000
);


// ======================================================
// END OF ADMIN.JS
// ======================================================
