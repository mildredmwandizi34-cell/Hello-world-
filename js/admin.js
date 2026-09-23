/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   ADMIN DASHBOARD
   SUPABASE + LOCALSTORAGE
   ========================================================= */

"use strict";

/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

/*
   Keep your existing Supabase publishable/anon key here.
   Use the SAME key already used by your create-shipment.js.
*/
const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let shipments = [];
let customerMessages =
    JSON.parse(localStorage.getItem("customerMessages")) || [];

let activityLog =
    JSON.parse(localStorage.getItem("activityLog")) || [];

let currentShipmentIndex = -1;


/* =========================================================
   SUPABASE REQUEST HELPER
   ========================================================= */

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const response = await fetch(
        SUPABASE_URL + endpoint,
        {
            ...options,

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization":
                    "Bearer " + SUPABASE_KEY,
                "Content-Type":
                    "application/json",
                "Prefer":
                    "return=representation",

                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            "Supabase error: " +
            response.status +
            " " +
            errorText
        );
    }

    const text =
        await response.text();

    return text ? JSON.parse(text) : [];
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

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


/* =========================================================
   LOAD SHIPMENTS FROM SUPABASE
   ========================================================= */

async function loadShipmentsFromSupabase() {

    try {

        const data =
            await supabaseRequest(
                "/rest/v1/shipments?select=*&order=created_at.desc"
            );

        shipments =
            Array.isArray(data)
                ? data
                : [];

        /*
           Save a backup copy locally.
        */

        saveShipments();

        console.log(
            "Supabase shipments loaded:",
            shipments.length
        );

        renderShipments();

        updateDashboard();

        return true;

    } catch (error) {

        console.error(
            "Unable to load Supabase shipments:",
            error
        );

        /*
           If Supabase cannot be reached,
           use the local backup instead.
        */

        shipments =
            JSON.parse(
                localStorage.getItem("shipments")
            ) || [];

        renderShipments();

        updateDashboard();

        return false;
    }
}


/* =========================================================
   DASHBOARD COUNTERS
   ========================================================= */

function updateDashboard() {

    const total =
        document.getElementById(
            "totalShipments"
        );

    const awaiting =
        document.getElementById(
            "awaiting"
        );

    const inTransit =
        document.getElementById(
            "inTransit"
        );

    const delivered =
        document.getElementById(
            "delivered"
        );

    if (total) {

        total.textContent =
            shipments.length;
    }

    if (awaiting) {

        awaiting.textContent =
            shipments.filter(
                s =>
                    String(s.status || "")
                        .toLowerCase()
                        .includes("awaiting")
            ).length;
    }

    if (inTransit) {

        inTransit.textContent =
            shipments.filter(
                s =>
                    String(s.status || "")
                        .toLowerCase()
                        .includes("transit")
            ).length;
    }

    if (delivered) {

        delivered.textContent =
            shipments.filter(
                s =>
                    String(s.status || "")
                        .toLowerCase()
                        .includes("delivered")
            ).length;
    }

    const messageCount =
        document.getElementById(
            "messageCount"
        );

    if (messageCount) {

        messageCount.textContent =
            customerMessages.length;
    }
}


/* =========================================================
   RENDER SHIPMENT TABLE
   ========================================================= */

function renderShipments() {

    const table =
        document.getElementById(
            "shipmentTable"
        );

    if (!table) return;

    table.innerHTML = "";

    if (!shipments.length) {

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center;">
                    No shipments found.
                </td>
            </tr>
        `;

        return;
    }


    shipments.forEach(
        (shipment, index) => {

            const tracking =
                shipment.tracking_number ||
                shipment.trackingNumber ||
                shipment.tracking ||
                "";

            const sender =
                shipment.sender_name ||
                shipment.senderName ||
                "";

            const receiver =
                shipment.receiver_name ||
                shipment.receiverName ||
                "";

            const status =
                shipment.status ||
                "";

            const location =
                shipment.location ||
                "";


            table.innerHTML += `

                <tr>

                    <td>
                        ${escapeHtml(tracking)}
                    </td>

                    <td>
                        ${escapeHtml(sender)}
                    </td>

                    <td>
                        ${escapeHtml(receiver)}
                    </td>

                    <td>
                        ${escapeHtml(status)}
                    </td>

                    <td>
                        ${escapeHtml(location)}
                    </td>

                    <td>

                        <button
                            onclick="editShipment(${index})">
                            Edit
                        </button>

                        <button
                            onclick="viewShipmentReceipt(${index})">
                            Receipt
                        </button>

                        <button
                            onclick="deleteShipment(${index})">
                            Delete
                        </button>

                    </td>

                </tr>

            `;
        }
    );
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   NEW SHIPMENT
   ========================================================= */

function newShipment() {

    window.location.href =
        "create-shipment.html";
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
        shipment.tracking_number ||
        shipment.trackingNumber ||
        shipment.tracking ||
        "";

    const sender =
        shipment.sender_name ||
        shipment.senderName ||
        "";

    const receiver =
        shipment.receiver_name ||
        shipment.receiverName ||
        "";

    const status =
        shipment.status ||
        "";

    const location =
        shipment.location ||
        "";

    const delivery =
        shipment.delivery ||
        "";

    const instructions =
        shipment.instructions ||
        "";


    setInput(
        "editTracking",
        tracking
    );

    setInput(
        "editSender",
        sender
    );

    setInput(
        "editReceiver",
        receiver
    );

    setInput(
        "editStatus",
        status
    );

    setInput(
        "editLocation",
        location
    );

    setInput(
        "editDelivery",
        delivery
    );

    setInput(
        "editInstructions",
        instructions
    );
}


function setInput(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";
    }
}


/* =========================================================
   SAVE SHIPMENT CHANGES
   ========================================================= */

async function saveShipment() {

    if (
        currentShipmentIndex < 0 ||
        !shipments[currentShipmentIndex]
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


    const tracking =
        document.getElementById(
            "editTracking"
        )?.value || "";

    const sender =
        document.getElementById(
            "editSender"
        )?.value || "";

    const receiver =
        document.getElementById(
            "editReceiver"
        )?.value || "";

    const status =
        document.getElementById(
            "editStatus"
        )?.value || "";

    const location =
        document.getElementById(
            "editLocation"
        )?.value || "";

    const delivery =
        document.getElementById(
            "editDelivery"
        )?.value || "";

    const instructions =
        document.getElementById(
            "editInstructions"
        )?.value || "";


    /*
       Update both possible naming
       formats used by your AGL system.
    */

    shipment.tracking =
        tracking;

    shipment.trackingNumber =
        tracking;

    shipment.tracking_number =
        tracking;


    shipment.senderName =
        sender;

    shipment.sender_name =
        sender;


    shipment.receiverName =
        receiver;

    shipment.receiver_name =
        receiver;


    shipment.status =
        status;

    shipment.location =
        location;

    shipment.delivery =
        delivery;

    shipment.instructions =
        instructions;


    try {

        const id =
            shipment.id;

        if (id) {

            await supabaseRequest(
                "/rest/v1/shipments?id=eq." +
                encodeURIComponent(id),
                {
                    method: "PATCH",

                    body: JSON.stringify(
                        shipment
                    )
                }
            );

        } else {

            const trackingValue =
                shipment.tracking_number;

            await supabaseRequest(
                "/rest/v1/shipments?tracking_number=eq." +
                encodeURIComponent(
                    trackingValue
                ),
                {
                    method: "PATCH",

                    body: JSON.stringify(
                        shipment
                    )
                }
            );
        }


        saveShipments();

        addActivity(
            "Shipment updated",
            "✏️"
        );

        await loadShipmentsFromSupabase();

        alert(
            "Shipment updated successfully."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not update shipment. " +
            "Check the Supabase connection."
        );
    }
}


/* =========================================================
   DELETE SHIPMENT
   ========================================================= */

async function deleteShipment(index) {

    const shipment =
        shipments[index];

    if (!shipment) return;


    const tracking =
        shipment.tracking_number ||
        shipment.trackingNumber ||
        shipment.tracking ||
        "";


    if (
        !confirm(
            "Delete shipment " +
            tracking +
            "?"
        )
    ) {

        return;
    }


    try {

        if (shipment.id) {

            await supabaseRequest(
                "/rest/v1/shipments?id=eq." +
                encodeURIComponent(
                    shipment.id
                ),
                {
                    method: "DELETE"
                }
            );

        } else {

            await supabaseRequest(
                "/rest/v1/shipments?tracking_number=eq." +
                encodeURIComponent(
                    tracking
                ),
                {
                    method: "DELETE"
                }
            );
        }


        addActivity(
            "Shipment deleted: " +
            tracking,
            "🗑️"
        );


        await loadShipmentsFromSupabase();


    } catch (error) {

        console.error(error);

        alert(
            "Could not delete shipment."
        );
    }
}


/* =========================================================
   VIEW RECEIPT
   ========================================================= */

function viewShipmentReceipt(index) {

    const shipment =
        shipments[index];

    if (!shipment) return;


    const tracking =
        shipment.tracking_number ||
        shipment.trackingNumber ||
        shipment.tracking ||
        "";


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


/* =========================================================
   SEARCH
   ========================================================= */

function searchShipments() {

    const input =
        document.getElementById(
            "searchShipment"
        );

    if (!input) return;


    const query =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            "#shipmentTable tr"
        )
        .forEach(row => {

            row.style.display =
                row.innerText
                    .toLowerCase()
                    .includes(query)
                    ? ""
                    : "none";
        });
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
        activityLog.slice(0, 50);

    saveActivity();

    loadActivity();
}


function loadActivity() {

    const container =
        document.getElementById(
            "activityLog"
        );

    if (!container) return;


    if (!activityLog.length) {

        container.innerHTML = `
            <div class="empty-activity">
                <h3>No Recent Activity</h3>
            </div>
        `;

        return;
    }


    container.innerHTML =
        activityLog
            .map(
                item => `

                    <div>

                        ${escapeHtml(
                            item.icon
                        )}

                        ${escapeHtml(
                            item.message
                        )}

                        <br>

                        <small>
                            ${escapeHtml(
                                item.time
                            )}
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
        document.getElementById(
            "customerMessages"
        );

    if (!container) return;


    customerMessages =
        JSON.parse(
            localStorage.getItem(
                "customerMessages"
            )
        ) || [];


    const count =
        document.getElementById(
            "messageCount"
        );

    if (count) {

        count.textContent =
            customerMessages.length;
    }


    if (!customerMessages.length) {

        container.innerHTML = `
            <div class="empty-messages">

                <h3>
                    No Customer Messages
                </h3>

                <p>
                    Customer messages
                    will appear here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        customerMessages
            .map(
                (message, index) => `

                    <div>

                        <strong>
                            ${escapeHtml(
                                message.name ||
                                "Customer"
                            )}
                        </strong>

                        <p>
                            ${escapeHtml(
                                message.message ||
                                ""
                            )}
                        </p>

                        <button
                            onclick=
                            "replyToCustomer(${index})">
                            Reply
                        </button>

                        <button
                            onclick=
                            "deleteCustomerMessage(${index})">
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
}


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "AGL Admin Dashboard starting..."
        );


        /*
           First load the existing
           online shipments.
        */

        await loadShipmentsFromSupabase();


        /*
           Then load local dashboard
           information.
        */

        loadCustomerMessages();

        loadActivity();

        updateDashboard();


        /*
           Search box.
        */

        const search =
            document.getElementById(
                "searchShipment"
            );

        if (search) {

            search.addEventListener(
                "input",
                searchShipments
            );
        }


        /*
           View receipt button.
        */

        const viewReceipt =
            document.getElementById(
                "viewReceipt"
            );

        if (viewReceipt) {

            viewReceipt.onclick =
                function () {

                    if (
                        currentShipmentIndex < 0
                    ) {

                        alert(
                            "Select a shipment first."
                        );

                        return;
                    }

                    viewShipmentReceipt(
                        currentShipmentIndex
                    );
                };
        }


        /*
           Logout.
        */

        const logout =
            document.getElementById(
                "logoutBtn"
            );

        if (logout) {

            logout.onclick =
                function () {

                    window.location.href =
                        "admin-login.html";
                };
        }

    }
);
     
