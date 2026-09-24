"use strict";

/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   ADMIN DASHBOARD
   SUPABASE CONNECTED VERSION
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

/*
   IMPORTANT:
   Paste the SAME Supabase publishable key you already use
   in your create-shipment.js / track.html here.
*/

const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";



const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   VARIABLES
   ========================================================= */

let shipments = [];

let customerMessages =
    JSON.parse(
        localStorage.getItem("customerMessages")
    ) || [];

let activityLog =
    JSON.parse(
        localStorage.getItem("activityLog")
    ) || [];

let currentShipmentIndex = -1;

let statusChartInstance = null;
let serviceChartInstance = null;

/* =========================================================
   HELPERS
   ========================================================= */

function get(id) {
    return document.getElementById(id);
}


function saveLocalBackup() {

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


/* =========================================================
   CONVERT SUPABASE ROW
   ========================================================= */

function convertShipment(row) {

    return {

        trackingNumber:
            row.tracking_number || "",

        tracking:
            row.tracking_number || "",

        status:
            row.status || "Shipment Created",

        senderName:
            row.sender_name || "",

        receiverName:
            row.receiver_name || "",

        origin:
            row.origin || "",

        destination:
            row.destination || "",

        location:
            row.location || "",

        delivery:
            row.delivery_date || "",

        delivery_date:
            row.delivery_date || "",

        service:
            row.service || "",

        package:
            row.package || "",

        weight:
            row.weight || "",

        progress:
            Number(row.progress) || 0,

        packageType:
            row.package_type || "",

        package_type:
            row.package_type || "",

        pieces:
            row.pieces || 0,

        dimensions:
            row.dimensions || "",

        payment:
            row.payment || "",

        history:
            row.history || "",

        updated_at:
            row.updated_at || ""

    };

}


/* =========================================================
   LOAD SHIPMENTS FROM SUPABASE
   ========================================================= */

async function loadShipments() {

    const table =
        get("shipmentTable");

    if (table) {

        table.innerHTML =
            "<tr><td colspan='6'>Loading shipments...</td></tr>";

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("shipments")
                .select("*")
                .order(
                    "updated_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Supabase loading error:",
                error
            );

            if (table) {

                table.innerHTML =
                    "<tr><td colspan='6'>Unable to load shipments.</td></tr>";

            }

            return;

        }


        shipments = (data || []).map(convertShipment);

saveLocalBackup();

renderShipments();

updateDashboard();

updateCharts();

    }

    catch (error) {

        console.error(error);

        if (table) {

            table.innerHTML =
                "<tr><td colspan='6'>Connection error.</td></tr>";

        }

    }

}


/* =========================================================
   RENDER SHIPMENTS
   ========================================================= */

function renderShipments() {

    const table =
        get("shipmentTable");

    if (!table) return;


    table.innerHTML = "";


    if (!shipments.length) {

        table.innerHTML =
            "<tr><td colspan='6'>No shipments found.</td></tr>";

        return;

    }


    shipments.forEach(
        function(shipment, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        shipment.trackingNumber
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        shipment.senderName
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        shipment.receiverName
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        shipment.status
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        shipment.location
                    )}
                </td>

                <td>

                    <button
                        onclick="editShipment(${index})"
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteShipment(${index})"
                    >
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================================
   DASHBOARD COUNTERS
   ========================================================= */

function updateDashboard() {

    const total =
        get("totalShipments");

    if (total) {

        total.textContent =
            shipments.length;

    }


    const awaiting =
        get("awaiting");

    if (awaiting) {

        awaiting.textContent =
            shipments.filter(
                s =>
                    String(s.status)
                        .toLowerCase()
                        ===
                    "awaiting pickup"
            ).length;

    }


    const inTransit =
        get("inTransit");

    if (inTransit) {

        inTransit.textContent =
            shipments.filter(
                s =>
                    String(s.status)
                        .toLowerCase()
                        ===
                    "in transit"
            ).length;

    }


    const delivered =
        get("delivered");

    if (delivered) {

        delivered.textContent =
            shipments.filter(
                s =>
                    String(s.status)
                        .toLowerCase()
                        ===
                    "delivered"
            ).length;

    }


    const messageCount =
        get("messageCount");

    if (messageCount) {

        messageCount.textContent =
            customerMessages.length;

    }

}


function updateCharts() {

    // Make sure Chart.js is loaded
    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded.");
        return;
    }

    const statusCanvas = document.getElementById("statusChart");
    const serviceCanvas = document.getElementById("serviceChart");

    if (!statusCanvas || !serviceCanvas) {
        console.error("Chart canvas elements not found.");
        return;
    }

    // Destroy old charts before creating new ones
    if (statusChartInstance) {
        statusChartInstance.destroy();
        statusChartInstance = null;
    }

    if (serviceChartInstance) {
        serviceChartInstance.destroy();
        serviceChartInstance = null;
    }


    /* =========================================
       SHIPMENT STATUS DATA
       ========================================= */

    const statusCounts = {};

    shipments.forEach(function (shipment) {

        const status =
            shipment.status &&
            String(shipment.status).trim()
                ? String(shipment.status).trim()
                : "Unknown";

        statusCounts[status] =
            (statusCounts[status] || 0) + 1;
    });


    /* =========================================
       SHIPPING SERVICE DATA
       ========================================= */

    const serviceCounts = {};

    shipments.forEach(function (shipment) {

        const service =
            shipment.service &&
            String(shipment.service).trim()
                ? String(shipment.service).trim()
                : "Not Specified";

        serviceCounts[service] =
            (serviceCounts[service] || 0) + 1;
    });


    /* =========================================
       STATUS CHART
       ========================================= */

    statusChartInstance = new Chart(
        statusCanvas.getContext("2d"),
        {
            type: "doughnut",

            data: {
                labels: Object.keys(statusCounts),

                datasets: [{
                    data: Object.values(statusCounts),

                    backgroundColor: [
                        "#0b4ea2",
                        "#22a447",
                        "#ff9800",
                        "#8e44ad",
                        "#e74c3c",
                        "#16a085",
                        "#34495e"
                    ],

                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        }
    );


    /* =========================================
       SERVICE CHART
       ========================================= */

    serviceChartInstance = new Chart(
        serviceCanvas.getContext("2d"),
        {
            type: "bar",

            data: {
                labels: Object.keys(serviceCounts),

                datasets: [{
                    label: "Shipments",
                    data: Object.values(serviceCounts),

                    backgroundColor: "#0b4ea2",

                    borderRadius: 6
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
                },

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }
    );
}


/* =========================================================
   EDIT SHIPMENT
   ========================================================= */

function editShipment(index) {

    currentShipmentIndex =
        index;


    const shipment =
        shipments[index];

    if (!shipment) return;


    const tracking =
        get("editTracking");

    const sender =
        get("editSender");

    const receiver =
        get("editReceiver");

    const status =
        get("editStatus");

    const location =
        get("editLocation");

    const delivery =
        get("editDelivery");

    const instructions =
        get("editInstructions");


    if (tracking)
        tracking.value =
            shipment.trackingNumber || "";


    if (sender)
        sender.value =
            shipment.senderName || "";


    if (receiver)
        receiver.value =
            shipment.receiverName || "";


    if (status)
        status.value =
            shipment.status || "";


    if (location)
        location.value =
            shipment.location || "";


    if (delivery)
        delivery.value =
            shipment.delivery || "";


    /*
       Your current Supabase table does NOT contain
       an instructions column.

       Therefore instructions cannot be saved to
       Supabase yet.
    */

    if (instructions)
        instructions.value = "";


    const editPanel =
    get("editPanel");

if (editPanel) {

    editPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

}


/* =========================================================
   STATUS PROGRESS
   ========================================================= */

function getProgress(status) {

    const value =
        String(status || "")
            .toLowerCase()
            .trim();


    if (value === "delivered")
        return 100;


    if (value === "out for delivery")
        return 90;


    if (
        value === "arrived at destination hub" ||
        value === "arrived hub"
    )
        return 75;


    if (value === "customs cleared")
        return 65;


    if (value === "in transit")
        return 50;


    if (value === "picked up")
        return 25;


    if (value === "awaiting pickup")
        return 15;


    return 5;

}


/* =========================================================
   HISTORY
   ========================================================= */

function readHistory(value) {

    if (!value)
        return [];


    if (Array.isArray(value))
        return value;


    try {

        const parsed =
            JSON.parse(value);

        if (Array.isArray(parsed))
            return parsed;

    }

    catch (error) {

        console.warn(
            "Could not read shipment history."
        );

    }


    return [];

}


function buildUpdatedHistory(
    oldHistory,
    oldStatus,
    oldLocation,
    newStatus,
    newLocation
) {

    let history =
        readHistory(oldHistory);


    const changed =
        oldStatus !== newStatus ||
        oldLocation !== newLocation;


    if (!changed)
        return history;


    history.push({

        status:
            newStatus,

        location:
            newLocation,

        date:
            new Date().toLocaleString()

    });


    return history;

}

/* =========================================================
   SAVE SHIPMENT TO SUPABASE
   ========================================================= */

async function saveShipment() {

    if (currentShipmentIndex < 0) {
        alert("Please select a shipment first.");
        return;
    }

    const shipment = shipments[currentShipmentIndex];

    if (!shipment) {
        alert("Shipment could not be found.");
        return;
    }

    try {

        /* =========================================
           GET EDITED VALUES
           ========================================= */

        const newTracking =
            (
                get("editTracking")?.value ||
                shipment.trackingNumber ||
                shipment.tracking ||
                ""
            )
            .trim()
            .toUpperCase();

        const newSender =
            (
                get("editSender")?.value ||
                ""
            ).trim();

        const newReceiver =
            (
                get("editReceiver")?.value ||
                ""
            ).trim();

        const newStatus =
            (
                get("editStatus")?.value ||
                ""
            ).trim();

        const newLocation =
            (
                get("editLocation")?.value ||
                ""
            ).trim();

        const newDelivery =
            (
                get("editDelivery")?.value ||
                ""
            ).trim();


        /* =========================================
           VALIDATION
           ========================================= */

        if (!newTracking) {
            alert("Tracking number is required.");
            return;
        }

        if (!newStatus) {
            alert("Shipment status is required.");
            return;
        }


        /* =========================================
           CALCULATE PROGRESS
           ========================================= */

        const newProgress =
            getProgress(newStatus);


        /* =========================================
           BUILD HISTORY
           ========================================= */

        let history = [];

        try {

            history = buildUpdatedHistory(
                shipment.history,
                shipment.status,
                shipment.location,
                newStatus,
                newLocation
            );

        } catch (historyError) {

            console.error(
                "History error:",
                historyError
            );

            history = Array.isArray(shipment.history)
                ? shipment.history
                : [];

        }


        /* =========================================
           SUPABASE DATA
           ========================================= */

        const updateData = {

            tracking_number:
                newTracking,

            status:
                newStatus,

            sender_name:
                newSender,

            receiver_name:
                newReceiver,

            location:
                newLocation,

            delivery_date:
                newDelivery,

            progress:
                newProgress,

            history:
                JSON.stringify(history),

            updated_at:
                new Date().toISOString()

        };


        console.log(
            "Saving shipment:",
            updateData
        );


        /* =========================================
           UPDATE SUPABASE
           ========================================= */

        const originalTracking =
            shipment.trackingNumber ||
            shipment.tracking;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("shipments")
                .update(updateData)
                .eq(
                    "tracking_number",
                    originalTracking
                )
                .select("*");


        /* =========================================
           CHECK SUPABASE ERROR
           ========================================= */

        if (error) {

            console.error(
                "SUPABASE SAVE ERROR:",
                error
            );

            alert(
                "Shipment was NOT saved.\n\n" +
                error.message
            );

            return;
        }


        /* =========================================
           CHECK WHETHER A ROW WAS ACTUALLY UPDATED
           ========================================= */

        if (!data || data.length === 0) {

            console.error(
                "No shipment was updated.",
                {
                    originalTracking,
                    updateData
                }
            );

            alert(
                "The shipment was not updated in Supabase.\n\n" +
                "Tracking number used:\n" +
                originalTracking +
                "\n\n" +
                "Please check your Supabase UPDATE policy."
            );

            return;
        }


        /* =========================================
           UPDATE LOCAL SHIPMENT
           ========================================= */

        shipments[currentShipmentIndex] =
            convertShipment(data[0]);


        saveLocalBackup();


        /* =========================================
           ACTIVITY LOG
           ========================================= */

        addActivity(
            "Shipment " +
            newTracking +
            " updated",
            "✏️"
        );


        /* =========================================
           REFRESH DASHBOARD
           ========================================= */

        renderShipments();

        updateDashboard();

        if (typeof updateCharts === "function") {
            updateCharts();
        }


        /* =========================================
           FINISH
           ========================================= */

        alert(
            "Shipment updated successfully! ✅\n\n" +
            "Tracking: " +
            newTracking
        );


        currentShipmentIndex = -1;

    }

    catch (error) {

        console.error(
            "SAVE SHIPMENT ERROR:",
            error
        );

        alert(
            "Unable to save shipment.\n\n" +
            error.message
        );

    }

        }


/* =========================================================
   DELETE SHIPMENT
   ========================================================= */

async function deleteShipment(index) {

    const shipment =
        shipments[index];

    if (!shipment)
        return;


    const confirmed =
        confirm(
            "Delete shipment " +
            shipment.trackingNumber +
            "?"
        );


    if (!confirmed)
        return;


    try {

        const {
            error
        } =
            await supabaseClient
                .from("shipments")
                .delete()
                .eq(
                    "tracking_number",
                    shipment.trackingNumber
                );


        if (error) {

            console.error(error);

            alert(
                "Shipment could not be deleted.\n\n" +
                error.message
            );

            return;

        }


        shipments.splice(
            index,
            1
        );


        saveLocalBackup();


        addActivity(
            "Shipment " +
            shipment.trackingNumber +
            " deleted",
            "🗑️"
        );


        renderShipments();

updateDashboard();


        alert(
            "Shipment deleted successfully."
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete shipment."
        );

    }

}


/* =========================================================
   DELETE CURRENT
   ========================================================= */

function deleteCurrentShipment() {

    if (
        currentShipmentIndex >= 0
    ) {

        deleteShipment(
            currentShipmentIndex
        );

    }

}


/* =========================================================
   NEW SHIPMENT
   ========================================================= */

function newShipment() {

    window.location.href =
        "create-shipment.html";

}


/* =========================================================
   SEARCH
   ========================================================= */

function searchShipments() {

    const input =
        get("searchShipment");

    if (!input) return;


    const query =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            "#shipmentTable tr"
        )
        .forEach(
            row => {

                row.style.display =
                    row.innerText
                        .toLowerCase()
                        .includes(query)
                        ? ""
                        : "none";

            }
        );

}


/* =========================================================
   ACTIVITY
   ========================================================= */

function addActivity(
    message,
    icon = "📦"
) {

    activityLog.unshift({

        message:
            message,

        icon:
            icon,

        time:
            new Date()
                .toLocaleString()

    });


    activityLog =
        activityLog.slice(
            0,
            50
        );


    saveActivity();

    loadActivity();

}


function loadActivity() {

    const container =
        get("activityLog");

    if (!container)
        return;


    if (!activityLog.length) {

        container.innerHTML =
            "<div class='empty-activity'>" +
            "<h3>No Recent Activity</h3>" +
            "</div>";

        return;

    }


    container.innerHTML =
        activityLog
            .map(
                item => `

                    <div>
                        ${escapeHTML(item.icon)}
                        ${escapeHTML(item.message)}
                        <br>
                        <small>
                            ${escapeHTML(item.time)}
                        </small>
                    </div>

                    <hr>

                `
            )
            .join("");

}


/* =========================================================
   CUSTOMER MESSAGES
   ========================================================= */

function loadCustomerMessages() {

    const container =
        get("customerMessages");

    if (!container)
        return;


    customerMessages =
        JSON.parse(
            localStorage.getItem(
                "customerMessages"
            )
        ) || [];


    const count =
        get("messageCount");

    if (count)
        count.textContent =
            customerMessages.length;


    if (!customerMessages.length) {

        container.innerHTML =
            "<div class='empty-messages'>" +
            "<h3>No Customer Messages</h3>" +
            "</div>";

        return;

    }


    container.innerHTML =
        customerMessages
            .map(
                (message, index) => `

                    <div>

                        <strong>
                            ${escapeHTML(
                                message.name ||
                                "Customer"
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                message.message ||
                                ""
                            )}
                        </p>

                        <button

             onclick="deleteCustomerMessage(${index})"
                        >
                            Delete
                        </button>

                        <hr>

                    </div>

                `
            )
            .join("");

}


function replyToCustomer(index) {

    const message =
        customerMessages[index];

    if (
        message &&
        message.email
    ) {

        window.location.href =
            "mailto:" +
            message.email;

    }

}


function deleteCustomerMessage(index) {

    if (
        !confirm(
            "Delete this customer message?"
        )
    )
        return;


    customerMessages.splice(
        index,
        1
    );


    saveMessages();

    loadCustomerMessages();

}


/* =========================================================
   VIEW RECEIPT
   ========================================================= */

function setupViewReceipt() {

    const button =
        get("viewReceipt");

    if (!button)
        return;


    button.onclick =
        function() {

            if (
                currentShipmentIndex < 0
            ) {

                alert(
                    "Select a shipment first."
                );

                return;

            }


            const shipment =
                shipments[
                    currentShipmentIndex
                ];


            if (!shipment)
                return;


            window.open(
                "receipt.html?tracking=" +
                encodeURIComponent(
                    shipment.trackingNumber
                ),
                "_blank"
            );

        };

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadShipments();

        loadCustomerMessages();

        loadActivity();

        updateDashboard();

        setupViewReceipt();


        const logout =
            get("logoutBtn");

        if (logout) {

            logout.onclick =
                function() {

                    window.location.href =
                        "admin-login.html";

                };

        }

    }
);
