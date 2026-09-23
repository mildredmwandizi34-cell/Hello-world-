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
    "PASTE_YOUR_EXISTING_SUPABASE_PUBLISHABLE_KEY_HERE";


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


        shipments =
            (data || []).map(
                convertShipment
            );


        saveLocalBackup();

        renderShipments();

        updateDashboard();

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


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

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

    if (
        currentShipmentIndex < 0
    ) {

        alert(
            "Please select a shipment first."
        );

        return;

    }


    const shipment =
        shipments[
            currentShipmentIndex
        ];


    if (!shipment) {

        alert(
            "Shipment could not be found."
        );

        return;

    }


    const newTracking =
        (
            get("editTracking")?.value ||
            shipment.trackingNumber
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


    if (!newTracking) {

        alert(
            "Tracking number is required."
        );

        return;

    }


    if (!newStatus) {

        alert(
            "Shipment status is required."
        );

        return;

    }


    const newProgress =
        getProgress(newStatus);


    const history =
        buildUpdatedHistory(
            shipment.history,
            shipment.status,
            shipment.location,
            newStatus,
            newLocation
        );


    /*
       ONLY columns that actually exist
       in your Supabase shipments table
       are sent.
    */

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


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("shipments")
                .update(updateData)
                .eq(
                    "tracking_number",
                    shipment.trackingNumber
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Supabase update error:",
                error
            );

            alert(
                "Shipment was NOT saved.\n\n" +
                error.message
            );

            return;

        }


        /*
           Replace the local copy with
           the database version.
        */

        shipments[
            currentShipmentIndex
        ] =
            convertShipment(data);


        saveLocalBackup();


        addActivity(
            "Shipment " +
            newTracking +
            " updated",
            "✏️"
        );


        renderShipments();

        updateDashboard();


        alert(
            "Shipment updated successfully.\n\n" +
            "The customer tracking page can now see the new information."
        );


        currentShipmentIndex = -1;

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to update shipment.\n\n" +
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
