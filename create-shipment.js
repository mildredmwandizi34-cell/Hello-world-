// ===========================================
// American Global Logistics
// Create Shipment System
// ONLINE SUPABASE VERSION
// ===========================================

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";

let supabaseClient = null;
let shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];


// ===========================================
// Load Supabase
// ===========================================

function loadSupabase() {

    return new Promise(function (resolve, reject) {

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

        script.onload = function () {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

            resolve();
        };

        script.onerror = function () {
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
// Page Loaded
// ===========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

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
            document.getElementById("shipmentForm");


        if (!shipmentForm) {

            console.error(
                "Shipment form not found."
            );

            return;
        }


        shipmentForm.addEventListener(
            "submit",
            createShipment
        );

    }
);


// ===========================================
// Create Shipment
// ===========================================

async function createShipment(event) {

    event.preventDefault();

    alert("Create Shipment button is working");


    // Calculate charges first
    calculateShippingCost();


    // =======================================
    // Generate IDs
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


    const receiptNumber =
        "RCP-" + Date.now();


    const now =
        new Date();


    const history =
        [
            {
                date:
                    now.toLocaleString(),

                status:
                    "Shipment Created",

                location:
                    "American Global Logistics Warehouse"
            }
        ];


    // =======================================
    // Full local shipment
    // =======================================

    const shipment = {

        trackingNumber:
            trackingNumber,

        tracking:
            trackingNumber,

        receiptNumber:
            receiptNumber,

        receiptDate:
            now.toLocaleDateString(),

        documentNo:
            "DOC-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            ),

        issueDate:
            now.toLocaleDateString(),

        verificationCode:
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase(),

        shipmentId:
            "SHP-" + Date.now(),

        createdTime:
            now.toLocaleString(),

        barcodeNumber:
            trackingNumber,


        reference:
            document.getElementById(
                "referenceNumber"
            ).value,

        customerReference:
            document.getElementById(
                "customerReference"
            ).value,


        // Sender
        senderName:
            document.getElementById(
                "senderName"
            ).value,

        senderCompany:
            document.getElementById(
                "senderCompany"
            ).value,

        senderAddress:
            document.getElementById(
                "senderAddress"
            ).value,

        senderCity:
            document.getElementById(
                "senderCity"
            ).value,

        senderCountry:
            document.getElementById(
                "senderCountry"
            ).value,

        senderPhone:
            document.getElementById(
                "senderPhone"
            ).value,

        senderEmail:
            document.getElementById(
                "senderEmail"
            ).value,


        // Receiver
        receiverName:
            document.getElementById(
                "receiverName"
            ).value,

        receiverCompany:
            document.getElementById(
                "receiverCompany"
            ).value,

        receiverAddress:
            document.getElementById(
                "receiverAddress"
            ).value,

        receiverCity:
            document.getElementById(
                "receiverCity"
            ).value,

        receiverCountry:
            document.getElementById(
                "receiverCountry"
            ).value,

        receiverPhone:
            document.getElementById(
                "receiverPhone"
            ).value,

        receiverEmail:
            document.getElementById(
                "receiverEmail"
            ).value,


        // Shipment
        package:
            document.getElementById(
                "package"
            ).value,

        descriptionType:
            document.getElementById(
                "packageType"
            ).value,

        pieces:
            document.getElementById(
                "pieces"
            ).value,

        weight:
            document.getElementById(
                "weight"
            ).value + " kg",

        dimensions:
            document.getElementById(
                "dimensions"
            ).value,

        value:
            document.getElementById(
                "declaredValue"
            ).value,

        service:
            document.getElementById(
                "service"
            ).value,

        payment:
            document.getElementById(
                "paymentStatus"
            ).value,

        insurance:
            document.getElementById(
                "insurance"
            ).value,

        origin:
            document.getElementById(
                "origin"
            ).value,

        destination:
            document.getElementById(
                "destination"
            ).value,

        delivery:
            document.getElementById(
                "deliveryDate"
            ).value,

        instructions:
            document.getElementById(
                "instructions"
            ).value,


        // Charges
        shippingCost:
            document.getElementById(
                "shippingCost"
            ).value,

        tax:
            document.getElementById(
                "tax"
            ).value,

        discount:
            document.getElementById(
                "discount"
            ).value,

        totalAmount:
            document.getElementById(
                "totalAmount"
            ).value,


        // Signatures
        senderSignature:
            document.getElementById(
                "senderSignature"
            ).value,

        authorizedOfficer:
            document.getElementById(
                "authorizedOfficer"
            ).value,


        // Barcode
        barcode:
            document.getElementById(
                "trackingBarcode"
            ).value,


        // Tracking
        status:
            "Shipment Created",

        location:
            "American Global Logistics Warehouse",

        route:
            document.getElementById(
                "origin"
            ).value +
            " → " +
            document.getElementById(
                "destination"
            ).value,

        progress:
            5,

        history:
            history

    };


    // =======================================
    // SAVE ONLINE TO SUPABASE
    // =======================================

    const onlineShipment = {

        tracking_number:
            shipment.trackingNumber,

        status:
            shipment.status,

        sender_name:
            shipment.senderName,

        receiver_name:
            shipment.receiverName,

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
            Number(shipment.pieces) || 1,

        dimensions:
            shipment.dimensions,

        payment:
            shipment.payment,

        history:
            JSON.stringify(shipment.history),

        updated_at:
            new Date().toISOString()

    };


    console.log(
        "Sending shipment to Supabase:",
        onlineShipment
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("shipments")
        .insert([onlineShipment])
        .select()
        .single();


    // =======================================
    // ONLINE SAVE ERROR
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


    // =======================================
    // ONLINE SAVE SUCCESS
    // =======================================

    console.log(
        "Shipment saved online:",
        data
    );


    // =======================================
    // Keep localStorage for receipt/admin
    // =======================================

    shipments.push(shipment);

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );


    // Activity log
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
            new Date().toLocaleString()

    });


    activities =
        activities.slice(0, 50);


    localStorage.setItem(
        "activityLog",
        JSON.stringify(activities)
    );


    // Latest shipment for receipt
    localStorage.setItem(
        "shipment",
        JSON.stringify(shipment)
    );


    // =======================================
    // Open receipt
    // =======================================

    window.location.href =
        "receipt.html?tracking=" +
        shipment.trackingNumber;

}

// ===========================================
// BILLING INFORMATION
// MANUAL ENTRY MODE
// ===========================================

function calculateShippingCost() {

    // Billing is manually entered by the user.
    // This function intentionally does not
    // overwrite shipping cost, tax, discount,
    // or total amount.

    const shippingCost =
        document.getElementById("shippingCost");

    const tax =
        document.getElementById("tax");

    const discount =
        document.getElementById("discount");

    const totalAmount =
        document.getElementById("totalAmount");


    // Keep empty fields empty.
    // Only format values that the user has entered.

    if (shippingCost && shippingCost.value !== "") {
        shippingCost.value =
            parseFloat(shippingCost.value).toFixed(2);
    }

    if (tax && tax.value !== "") {
        tax.value =
            parseFloat(tax.value).toFixed(2);
    }

    if (discount && discount.value !== "") {
        discount.value =
            parseFloat(discount.value).toFixed(2);
    }

    if (totalAmount && totalAmount.value !== "") {
        totalAmount.value =
            parseFloat(totalAmount.value).toFixed(2);
    }

}
