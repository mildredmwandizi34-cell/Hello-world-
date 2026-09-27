// ===========================================
// AMERICAN GLOBAL LOGISTICS
// CREATE SHIPMENT SYSTEM
// DATE + TIME ENABLED
// SUPABASE VERSION
// ===========================================

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";

let supabaseClient = null;

let shipments =
    JSON.parse(
        localStorage.getItem("shipments")
    ) || [];


// ===========================================
// SUPABASE
// ===========================================

function loadSupabase() {

    return new Promise(function(resolve, reject) {

        if (window.supabase) {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

            resolve();
            return;
        }

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = function() {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

            resolve();
        };

        script.onerror = function() {

            reject(
                new Error(
                    "Supabase library could not be loaded."
                )
            );
        };

        document.head.appendChild(script);
    });
}


// ===========================================
// DATE / TIME HELPERS
// ===========================================

function padNumber(number) {

    return String(number).padStart(2, "0");
}


// ===========================================
// CURRENT LOCAL DATE
// YYYY-MM-DD
// ===========================================

function getTodayDate() {

    const now =
        new Date();

    return (
        now.getFullYear() +
        "-" +
        padNumber(now.getMonth() + 1) +
        "-" +
        padNumber(now.getDate())
    );
}


// ===========================================
// CURRENT LOCAL TIME
// HH:MM
// ===========================================

function getCurrentTime() {

    const now =
        new Date();

    const createdAt =
    now.toISOString();

    return (
        padNumber(now.getHours()) +
        ":" +
        padNumber(now.getMinutes())
    );
}


// ===========================================
// FORMAT DATE FOR DISPLAY
// ===========================================

function formatDate(date) {

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


// ===========================================
// FORMAT TIME FOR DISPLAY
// ===========================================

function formatTime(date) {

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    );
}


// ===========================================
// CREATE LOCAL DATE FROM INPUTS
// ===========================================

function getSelectedCreationDateTime() {

    const dateInput =
        document.getElementById(
            "shipmentCreatedDate"
        );

    const timeInput =
        document.getElementById(
            "shipmentCreatedTime"
        );

    if (
        !dateInput ||
        !timeInput ||
        !dateInput.value ||
        !timeInput.value
    ) {

        return null;
    }

    const selected =
        new Date(
            dateInput.value +
            "T" +
            timeInput.value
        );

    if (
        Number.isNaN(
            selected.getTime()
        )
    ) {

        return null;
    }

    return selected;
}


// ===========================================
// ADD CREATION DATE/TIME UI
// ===========================================

function setupCreationDateTimeFields() {

    const form =
        document.getElementById(
            "shipmentForm"
        );

    if (!form) {
        return;
    }


    let dateInput =
        document.getElementById(
            "shipmentCreatedDate"
        );

    let timeInput =
        document.getElementById(
            "shipmentCreatedTime"
        );


    // =======================================
    // IF FIELDS DO NOT EXIST,
    // CREATE THEM AUTOMATICALLY
    // =======================================

    if (!dateInput || !timeInput) {

        const wrapper =
            document.createElement("div");

        wrapper.id =
            "shipmentCreationDateTime";

        wrapper.style.cssText = `
            width:100%;
            margin:15px 0;
            padding:15px;
            background:#f4f9ff;
            border:1px solid #0b4ea2;
            border-radius:8px;
            box-sizing:border-box;
        `;


        const title =
            document.createElement("div");

        title.innerHTML = `
            <strong style="
                display:block;
                color:#083b80;
                font-size:15px;
                margin-bottom:5px;
            ">
                <i class="fa-solid fa-calendar-clock"></i>
                SHIPMENT CREATION DATE & TIME
            </strong>

            <span style="
                display:block;
                color:#64798b;
                font-size:12px;
                margin-bottom:12px;
            ">
                Select when this shipment was created.
                Past dates are allowed. Future dates are not allowed.
            </span>
        `;


        const fields =
            document.createElement("div");

        fields.style.cssText = `
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
        `;


        const dateBox =
            document.createElement("div");

        const dateLabel =
            document.createElement("label");

        dateLabel.innerHTML =
            "Creation Date";

        dateLabel.style.cssText = `
            display:block;
            margin-bottom:5px;
            font-weight:700;
            color:#17324d;
        `;


        dateInput =
            document.createElement("input");

        dateInput.type =
            "date";

        dateInput.id =
            "shipmentCreatedDate";

        dateInput.name =
            "shipmentCreatedDate";

        dateInput.style.cssText = `
            width:100%;
            padding:10px;
            border:1px solid #b8c9d8;
            border-radius:5px;
            box-sizing:border-box;
        `;


        dateBox.appendChild(
            dateLabel
        );

        dateBox.appendChild(
            dateInput
        );


        const timeBox =
            document.createElement("div");

        const timeLabel =
            document.createElement("label");

        timeLabel.innerHTML =
            "Creation Time";

        timeLabel.style.cssText = `
            display:block;
            margin-bottom:5px;
            font-weight:700;
            color:#17324d;
        `;


        timeInput =
            document.createElement("input");

        timeInput.type =
            "time";

        timeInput.id =
            "shipmentCreatedTime";

        timeInput.name =
            "shipmentCreatedTime";

        timeInput.style.cssText = `
            width:100%;
            padding:10px;
            border:1px solid #b8c9d8;
            border-radius:5px;
            box-sizing:border-box;
        `;


        timeBox.appendChild(
            timeLabel
        );

        timeBox.appendChild(
            timeInput
        );


        fields.appendChild(
            dateBox
        );

        fields.appendChild(
            timeBox
        );


        wrapper.appendChild(
            title
        );

        wrapper.appendChild(
            fields
        );


        // Put the date/time section
        // near the beginning of the form.

        form.insertBefore(
            wrapper,
            form.firstElementChild
        );
    }


    // =======================================
    // DEFAULT CURRENT DATE/TIME
    // =======================================

    if (!dateInput.value) {

        dateInput.value =
            getTodayDate();
    }


    if (!timeInput.value) {

        timeInput.value =
            getCurrentTime();
    }


    // =======================================
    // FUTURE DATE BLOCKING
    // =======================================

    dateInput.max =
        getTodayDate();


    // =======================================
    // VALIDATE DATE/TIME
    // =======================================

    function validateCreationDateTime() {

        const selected =
            getSelectedCreationDateTime();

        if (!selected) {

            alert(
                "Please select a valid shipment creation date and time."
            );

            return false;
        }


        const now = new Date();

const createdAt = now.toISOString();


        if (
            selected.getTime() >
            now.getTime()
        ) {

            alert(
                "Shipment creation date and time cannot be in the future."
            );

            return false;
        }


        return true;
    }


    dateInput.addEventListener(
        "change",
        validateCreationDateTime
    );

    timeInput.addEventListener(
        "change",
        validateCreationDateTime
    );
}


// ===========================================
// SAFE FIELD VALUE
// ===========================================

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return String(
        element.value ?? ""
    ).trim();
}


// ===========================================
// PAGE LOADED
// ===========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        try {

            await loadSupabase();

            console.log(
                "AGL Online Database Connected"
            );

        } catch (error) {

            console.error(
                "Supabase connection error:",
                error
            );

            alert(
                "Online database connection failed. Please check your internet connection."
            );

            return;
        }


        const shipmentForm =
            document.getElementById(
                "shipmentForm"
            );


        if (!shipmentForm) {

            console.error(
                "Shipment form not found."
            );

            return;
        }


        // Create date/time controls
        setupCreationDateTimeFields();


        shipmentForm.addEventListener(
            "submit",
            createShipment
        );
    }
);


// ===========================================
// CREATE SHIPMENT
// ===========================================

async function createShipment(event) {

    event.preventDefault();


    // =======================================
    // VALIDATE CREATION DATE/TIME
    // =======================================

    const creationDateTime =
        getSelectedCreationDateTime();


    if (!creationDateTime) {

        alert(
            "Please select the shipment creation date and time."
        );

        return;
    }


    
const now = new Date();

const createdAt = now.toISOString();

    if (
        creationDateTime.getTime() >
        now.getTime()
    ) {

        alert(
            "Shipment creation date and time cannot be in the future."
        );

        return;
    }


    // =======================================
    // CALCULATE / FORMAT CHARGES
    // =======================================

    calculateShippingCost();


    // =======================================
    // GENERATE TRACKING NUMBER
    // =======================================

    const trackingNumber =
        "AGL" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    const barcodeField =
        document.getElementById(
            "trackingBarcode"
        );


    if (barcodeField) {

        barcodeField.value =
            trackingNumber;
    }


    // =======================================
    // IDs
    // =======================================

    const receiptNumber =
        "RCP-" +
        Date.now();


    const documentNo =
        "DOC-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    const verificationCode =
        Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();


    const shipmentId =
        "SHP-" +
        Date.now();


    // =======================================
    // CREATION DATE/TIME
    // =======================================

    const creationISO =
        creationDateTime.toISOString();


    const creationDate =
        formatDate(
            creationDateTime
        );


    const creationTime =
        formatTime(
            creationDateTime
        );


    // =======================================
    // FIRST HISTORY EVENT
    // =======================================

    const history = [

        {
            status:
                "Shipment Created",

            location:
                "American Global Logistics Warehouse",

            date:
                creationDate,

            time:
                creationTime,

            timestamp:
                creationISO
        }

    ];


    // =======================================
    // FULL SHIPMENT OBJECT
    // =======================================

    const shipment = {

        trackingNumber:
            trackingNumber,

        tracking:
            trackingNumber,


        receiptNumber:
            receiptNumber,

        receiptDate:
            creationDate,


        documentNo:
            documentNo,

        issueDate:
            creationDate,


        verificationCode:
            verificationCode,


        shipmentId:
            shipmentId,


        // ===================================
        // IMPORTANT:
        // ORIGINAL CREATION TIME
        // IS SAVED PERMANENTLY
        // ===================================

        createdTime:
            creationISO,

        createdDate:
            creationDate,

        createdTimeDisplay:
            creationTime,


        barcodeNumber:
            trackingNumber,


        reference:
            getValue(
                "referenceNumber"
            ),

        customerReference:
            getValue(
                "customerReference"
            ),


        // ===================================
        // SENDER
        // ===================================

        senderName:
            getValue(
                "senderName"
            ),

        senderCompany:
            getValue(
                "senderCompany"
            ),

        senderAddress:
            getValue(
                "senderAddress"
            ),

        senderCity:
            getValue(
                "senderCity"
            ),

        senderCountry:
            getValue(
                "senderCountry"
            ),

        senderPhone:
            getValue(
                "senderPhone"
            ),

        senderEmail:
            getValue(
                "senderEmail"
            ),


        // ===================================
        // RECEIVER
        // ===================================

        receiverName:
            getValue(
                "receiverName"
            ),

        receiverCompany:
            getValue(
                "receiverCompany"
            ),

        receiverAddress:
            getValue(
                "receiverAddress"
            ),

        receiverCity:
            getValue(
                "receiverCity"
            ),

        receiverCountry:
            getValue(
                "receiverCountry"
            ),

        receiverPhone:
            getValue(
                "receiverPhone"
            ),

        receiverEmail:
            getValue(
                "receiverEmail"
            ),


        // ===================================
        // SHIPMENT
        // ===================================

        package:
            getValue(
                "package"
            ),

        descriptionType:
            getValue(
                "packageType"
            ),

        pieces:
            getValue(
                "pieces"
            ),

        weight:
            getValue(
                "weight"
            ) + " kg",

        dimensions:
            getValue(
                "dimensions"
            ),

        value:
            getValue(
                "declaredValue"
            ),

        service:
            getValue(
                "service"
            ),

        payment:
            getValue(
                "paymentStatus"
            ),

        insurance:
            getValue(
                "insurance"
            ),

        origin:
            getValue(
                "origin"
            ),

        destination:
            getValue(
                "destination"
            ),

        delivery:
            getValue(
                "deliveryDate"
            ),

        instructions:
            getValue(
                "instructions"
            ),


        // ===================================
        // CHARGES
        // ===================================

        shippingCost:
            getValue(
                "shippingCost"
            ),

        tax:
            getValue(
                "tax"
            ),

        discount:
            getValue(
                "discount"
            ),

        totalAmount:
            getValue(
                "totalAmount"
            ),


        // ===================================
        // SIGNATURES
        // ===================================

        senderSignature:
            getValue(
                "senderSignature"
            ),

        authorizedOfficer:
            getValue(
                "authorizedOfficer"
            ),


        barcode:
            getValue(
                "trackingBarcode"
            ),


        // ===================================
        // TRACKING
        // ===================================

        status:
            "Shipment Created",

        location:
            "American Global Logistics Warehouse",

        route:
            getValue("origin") +
            " → " +
            getValue("destination"),

        progress:
            5,


        // ===================================
        // IMPORTANT HISTORY
        // ===================================

        history:
            history
    };


    // =======================================
    // SUPABASE OBJECT
    // =======================================

    const onlineShipment = {

        tracking_number:
            shipment.trackingNumber,

        status:
            shipment.status,


        // ===================================
        // SENDER
        // ===================================

        sender_name:
            shipment.senderName,

        sender_company:
            shipment.senderCompany,

        sender_address:
            shipment.senderAddress,

        sender_city:
            shipment.senderCity,

        sender_country:
            shipment.senderCountry,

        sender_phone:
            shipment.senderPhone,

        sender_email:
            shipment.senderEmail,


        // ===================================
        // RECEIVER
        // ===================================

        receiver_name:
            shipment.receiverName,

        receiver_company:
            shipment.receiverCompany,

        receiver_address:
            shipment.receiverAddress,

        receiver_city:
            shipment.receiverCity,

        receiver_country:
            shipment.receiverCountry,

        receiver_phone:
            shipment.receiverPhone,

        receiver_email:
            shipment.receiverEmail,


        // ===================================
        // SHIPMENT
        // ===================================

        origin:
            shipment.origin,

        destination:
            shipment.destination,

        location:
            shipment.location,

        delivery_date:
            shipment.delivery,

        service:
            shipment.service,

        package:
            shipment.package,

        weight:
            shipment.weight,

        progress:
            shipment.progress,

        package_type:
            shipment.descriptionType,

        pieces:
            Number(
                shipment.pieces
            ) || 1,

        dimensions:
            shipment.dimensions,

        payment:
            shipment.payment,

        shipping_cost: shipment.shippingCost,
tax: shipment.tax,
discount: shipment.discount,
insurance_cost: shipment.insuranceCost,
total_amount: shipment.totalAmount,


        // ===================================
        // STRUCTURED HISTORY
        // ===================================

        history:
            JSON.stringify(
                shipment.history
            ),


        // ===================================
        // DATABASE UPDATE TIME
        // ===================================

        created_at:
    createdAt,

updated_at:
    createdAt
    };


    console.log(
        "Sending shipment to Supabase:",
        onlineShipment
    );


    // =======================================
    // SAVE ONLINE
    // =======================================

    const {
        data,
        error
    } =
        await supabaseClient
            .from("shipments")
            .insert(
                [onlineShipment]
            )
            .select()
            .single();


    // =======================================
    // ONLINE ERROR
    // =======================================

    if (error) {

        console.error(
            "Supabase shipment error:",
            error
        );

        alert(
            "Shipment could not be saved online.\n\n" +
            error.message
        );

        return;
    }


    console.log(
        "Shipment saved online:",
        data
    );


    // =======================================
    // LOCAL STORAGE
    // =======================================

    shipments.push(
        shipment
    );


    localStorage.setItem(
        "shipments",
        JSON.stringify(
            shipments
        )
    );


    // =======================================
    // ACTIVITY LOG
    // =======================================

    let activities =
        JSON.parse(
            localStorage.getItem(
                "activityLog"
            )
        ) || [];


    activities.unshift({

        message:
            `Shipment ${shipment.tracking} was created`,

        icon:
            "📦",

        time:
            creationDate +
            " " +
            creationTime,

        timestamp:
            creationISO
    });


    activities =
        activities.slice(
            0,
            50
        );


    localStorage.setItem(
        "activityLog",
        JSON.stringify(
            activities
        )
    );


    // =======================================
    // LATEST SHIPMENT
    // =======================================

    localStorage.setItem(
        "shipment",
        JSON.stringify(
            shipment
        )
    );


    // =======================================
    // OPEN RECEIPT
    // =======================================

    window.location.href =
        "receipt.html?tracking=" +
        encodeURIComponent(
            shipment.trackingNumber
        );
}


// ===========================================
// BILLING INFORMATION
// MANUAL ENTRY MODE
// ===========================================

function calculateShippingCost() {

    const shippingCost =
        document.getElementById(
            "shippingCost"
        );

    const tax =
        document.getElementById(
            "tax"
        );

    const discount =
        document.getElementById(
            "discount"
        );

    const totalAmount =
        document.getElementById(
            "totalAmount"
        );


    if (
        shippingCost &&
        shippingCost.value !== ""
    ) {

        shippingCost.value =
            parseFloat(
                shippingCost.value
            ).toFixed(2);
    }


    if (
        tax &&
        tax.value !== ""
    ) {

        tax.value =
            parseFloat(
                tax.value
            ).toFixed(2);
    }


    if (
        discount &&
        discount.value !== ""
    ) {

        discount.value =
            parseFloat(
                discount.value
            ).toFixed(2);
    }


    if (
        totalAmount &&
        totalAmount.value !== ""
    ) {

        totalAmount.value =
            parseFloat(
                totalAmount.value
            ).toFixed(2);
    }
}
