/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   CUSTOMER TRACKING
   SUPABASE LIVE VERSION
   ========================================================= */

"use strict";


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://aptkocjxcwmfatcycdnv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DFh11Zpc40ulOTzl53Z2pw_tteoaD7l";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   MAP VARIABLES
   ========================================================= */

let shipmentMap = null;
let routeLine = null;
let airplaneMarker = null;


/* =========================================================
   CITY COORDINATES
   ========================================================= */

const locationCoordinates = {

    Nairobi: [-1.286389, 36.817223],
    Mombasa: [-4.0435, 39.6682],

    London: [51.5074, -0.1278],
    Edinburgh: [55.9533, -3.1883],
    Glasgow: [55.8642, -4.2518],

    "New York": [40.7128, -74.0060],
    "Los Angeles": [34.0522, -118.2437],
    Chicago: [41.8781, -87.6298],
    Miami: [25.7617, -80.1918],
    Houston: [29.7604, -95.3698],
    Atlanta: [33.7490, -84.3880],
    Seattle: [47.6062, -122.3321],
    Boston: [42.3601, -71.0589],
    Washington: [38.9072, -77.0369],

    Toronto: [43.6532, -79.3832],
    Vancouver: [49.2827, -123.1207],
    Montreal: [45.5017, -73.5673],

    Dubai: [25.2048, 55.2708],
    AbuDhabi: [24.4539, 54.3773],

    Paris: [48.8566, 2.3522],
    Berlin: [52.5200, 13.4050],
    Rome: [41.9028, 12.4964],
    Madrid: [40.4168, -3.7038],
    Amsterdam: [52.3676, 4.9041],
    Brussels: [50.8503, 4.3517],
    Lisbon: [38.7223, -9.1393],
    Vienna: [48.2082, 16.3738],
    Zurich: [47.3769, 8.5417],
    Athens: [37.9838, 23.7275],
    Copenhagen: [55.6761, 12.5683],
    Stockholm: [59.3293, 18.0686],
    Oslo: [59.9139, 10.7522],
    Helsinki: [60.1699, 24.9384],
    Warsaw: [52.2297, 21.0122],
    Prague: [50.0755, 14.4378],
    Budapest: [47.4979, 19.0402],
    Bucharest: [44.4268, 26.1025],
    Dublin: [53.3498, -6.2603],

    Beijing: [39.9042, 116.4074],
    Shanghai: [31.2304, 121.4737],
    Tokyo: [35.6762, 139.6503],
    Osaka: [34.6937, 135.5023],
    Seoul: [37.5665, 126.9780],
    Singapore: [1.3521, 103.8198],
    Bangkok: [13.7563, 100.5018],
    Jakarta: [-6.2088, 106.8456],
    Manila: [14.5995, 120.9842],
    KualaLumpur: [3.1390, 101.6869],
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.6139, 77.2090],
    Karachi: [24.8607, 67.0011],
    Dhaka: [23.8103, 90.4125],

    Sydney: [-33.8688, 151.2093],
    Melbourne: [-37.8136, 144.9631],
    Perth: [-31.9505, 115.8605],
    Brisbane: [-27.4698, 153.0251],

    Johannesburg: [-26.2041, 28.0473],
    CapeTown: [-33.9249, 18.4241],
    Cairo: [30.0444, 31.2357],
    Accra: [5.6037, -0.1870],
    Lagos: [6.5244, 3.3792],
    AddisAbaba: [9.0320, 38.7469],
    Kampala: [0.3476, 32.5825],
    DarEsSalaam: [-6.7924, 39.2083],
    Kigali: [-1.9441, 30.0619],
    Lusaka: [-15.3875, 28.3228],
    Harare: [-17.8252, 31.0335],
    Maputo: [-25.9692, 32.5732],

    "San Jose": [9.9281, -84.0907],
    GuatemalaCity: [14.6349, -90.5069],
    PanamaCity: [8.9824, -79.5199],
    MexicoCity: [19.4326, -99.1332],
    Havana: [23.1136, -82.3666],

    SaoPaulo: [-23.5505, -46.6333],
    BuenosAires: [-34.6037, -58.3816],
    Santiago: [-33.4489, -70.6693],
    Lima: [-12.0464, -77.0428],
    Bogota: [4.7110, -74.0721],
    Caracas: [10.4806, -66.9036],

    Moscow: [55.7558, 37.6173],
    Istanbul: [41.0082, 28.9784],
    Riyadh: [24.7136, 46.6753],
    Doha: [25.2854, 51.5310],
    KuwaitCity: [29.3759, 47.9774],
    Muscat: [23.5880, 58.3829],

    Auckland: [-36.8509, 174.7645],
    Wellington: [-41.2866, 174.7756]

};


/* =========================================================
   COUNTRY COORDINATES
   Approximate central/representative coordinates
   ========================================================= */

const countryCoordinates = {

    Afghanistan: [33.9391, 67.7100],
    Albania: [41.1533, 20.1683],
    Algeria: [28.0339, 1.6596],
    Andorra: [42.5063, 1.5218],
    Angola: [-11.2027, 17.8739],
    AntiguaAndBarbuda: [17.0608, -61.7964],
    Argentina: [-38.4161, -63.6167],
    Armenia: [40.0691, 45.0382],
    Australia: [-25.2744, 133.7751],
    Austria: [47.5162, 14.5501],
    Azerbaijan: [40.1431, 47.5769],

    Bahamas: [25.0343, -77.3963],
    Bahrain: [26.0667, 50.5577],
    Bangladesh: [23.6850, 90.3563],
    Barbados: [13.1939, -59.5432],
    Belarus: [53.7098, 27.9534],
    Belgium: [50.5039, 4.4699],
    Belize: [17.1899, -88.4976],
    Benin: [9.3077, 2.3158],
    Bhutan: [27.5142, 90.4336],
    Bolivia: [-16.2902, -63.5887],
    BosniaHerzegovina: [43.9159, 17.6791],
    Botswana: [-22.3285, 24.6849],
    Brazil: [-14.2350, -51.9253],
    Brunei: [4.5353, 114.7277],
    Bulgaria: [42.7339, 25.4858],
    BurkinaFaso: [12.2383, -1.5616],
    Burundi: [-3.3731, 29.9189],

    CaboVerde: [16.5388, -23.0418],
    Cambodia: [12.5657, 104.9910],
    Cameroon: [7.3697, 12.3547],
    Canada: [56.1304, -106.3468],
    CentralAfricanRepublic: [6.6111, 20.9394],
    Chad: [15.4542, 18.7322],
    Chile: [-35.6751, -71.5430],
    China: [35.8617, 104.1954],
    Colombia: [4.5709, -74.2973],
    Comoros: [-11.6455, 43.3333],
    Congo: [-0.2280, 15.8277],
    CostaRica: [9.7489, -83.7534],
    Croatia: [45.1000, 15.2000],
    Cuba: [21.5218, -77.7812],
    Cyprus: [35.1264, 33.4299],
    Czechia: [49.8175, 15.4730],

    Denmark: [56.2639, 9.5018],
    Djibouti: [11.8251, 42.5903],
    Dominica: [15.4150, -61.3710],
    DominicanRepublic: [18.7357, -70.1627],

    Ecuador: [-1.8312, -78.1834],
    Egypt: [26.8206, 30.8025],
    ElSalvador: [13.7942, -88.8965],
    EquatorialGuinea: [1.6508, 10.2679],
    Eritrea: [15.1794, 39.7823],
    Estonia: [58.5953, 25.0136],
    Eswatini: [-26.5225, 31.4659],
    Ethiopia: [9.1450, 40.4897],

    Fiji: [-17.7134, 178.0650],
    Finland: [61.9241, 25.7482],
    France: [46.2276, 2.2137],

    Gabon: [-0.8037, 11.6094],
    Gambia: [13.4432, -15.3101],
    Georgia: [42.3154, 43.3569],
    Germany: [51.1657, 10.4515],
    Ghana: [7.9465, -1.0232],
    Greece: [39.0742, 21.8243],
    Grenada: [12.1165, -61.6790],
    Guatemala: [15.7835, -90.2308],
    Guinea: [9.9456, -9.6966],
    GuineaBissau: [11.8037, -15.1804],
    Guyana: [4.8604, -58.9302],

    Haiti: [18.9712, -72.2852],
    Honduras: [15.2000, -86.2419],
    Hungary: [47.1625, 19.5033],

    Iceland: [64.9631, -19.0208],
    India: [20.5937, 78.9629],
    Indonesia: [-0.7893, 113.9213],
    Iran: [32.4279, 53.6880],
    Iraq: [33.2232, 43.6793],
    Ireland: [53.1424, -7.6921],
    Israel: [31.0461, 34.8516],
    Italy: [41.8719, 12.5674],

    Jamaica: [18.1096, -77.2975],
    Japan: [36.2048, 138.2529],
    Jordan: [30.5852, 36.2384],

    Kazakhstan: [48.0196, 66.9237],
    Kenya: [-0.0236, 37.9062],
    Kiribati: [1.8709, -157.3630],
    Kuwait: [29.3117, 47.4818],
    Kyrgyzstan: [41.2044, 74.7661],

    Laos: [19.8563, 102.4955],
    Latvia: [56.8796, 24.6032],
    Lebanon: [33.8547, 35.8623],
    Lesotho: [-29.6100, 28.2336],
    Liberia: [6.4281, -9.4295],
    Libya: [26.3351, 17.2283],
    Liechtenstein: [47.1660, 9.5554],
    Lithuania: [55.1694, 23.8813],
    Luxembourg: [49.8153, 6.1296],

    Madagascar: [-18.7669, 46.8691],
    Malawi: [-13.2543, 34.3015],
    Malaysia: [4.2105, 101.9758],
    Maldives: [3.2028, 73.2207],
    Mali: [17.5707, -3.9962],
    Malta: [35.9375, 14.3754],
    MarshallIslands: [7.1315, 171.1845],
    Mauritania: [21.0079, -10.9408],
    Mauritius: [-20.3484, 57.5522],
    Mexico: [23.6345, -102.5528],
    Micronesia: [7.4256, 150.5508],
    Moldova: [47.4116, 28.3699],
    Monaco: [43.7384, 7.4246],
    Mongolia: [46.8625, 103.8467],
    Montenegro: [42.7087, 19.3744],
    Morocco: [31.7917, -7.0926],
    Mozambique: [-18.6657, 35.5296],
    Myanmar: [21.9162, 95.9560],

    Namibia: [-22.9576, 18.4904],
    Nauru: [-0.5228, 166.9315],
    Nepal: [28.3949, 84.1240],
    Netherlands: [52.1326, 5.2913],
    NewZealand: [-40.9006, 174.8860],
    Nicaragua: [12.8654, -85.2072],
    Niger: [17.6078, 8.0817],
    Nigeria: [9.0820, 8.6753],
    NorthKorea: [40.3399, 127.5101],
    NorthMacedonia: [41.6086, 21.7453],
    Norway: [60.4720, 8.4689],

    Oman: [21.4735, 55.9754],

    Pakistan: [30.3753, 69.3451],
    Palau: [7.5150, 134.5825],
    Panama: [8.5380, -80.7821],
    PapuaNewGuinea: [-6.3150, 143.9555],
    Paraguay: [-23.4425, -58.4438],
    Peru: [-9.1900, -75.0152],
    Philippines: [12.8797, 121.7740],
    Poland: [51.9194, 19.1451],
    Portugal: [39.3999, -8.2245],

    Qatar: [25.3548, 51.1839],

    Romania: [45.9432, 24.9668],
    Russia: [61.5240, 105.3188],
    Rwanda: [-1.9403, 29.8739],

    SaintKittsAndNevis: [17.3578, -62.7830],
    SaintLucia: [13.9094, -60.9789],
    SaintVincent: [13.1579, -61.2248],
    Samoa: [-13.7590, -172.1046],
    SanMarino: [43.9424, 12.4578],
    SaoTome: [0.1864, 6.6131],
    SaudiArabia: [23.8859, 45.0792],
    Senegal: [14.4974, -14.4524],
    Serbia: [44.0165, 21.0059],
    Seychelles: [-4.6796, 55.4920],
    SierraLeone: [8.4606, -11.7799],
    Singapore: [1.3521, 103.8198],
    Slovakia: [48.6690, 19.6990],
    Slovenia: [46.1512, 14.9955],
    SolomonIslands: [-9.6457, 160.1562],
    Somalia: [5.1521, 46.1996],
    SouthAfrica: [-30.5595, 22.9375],
    SouthKorea: [35.9078, 127.7669],
    SouthSudan: [6.8770, 31.3070],
    Spain: [40.4637, -3.7492],
    SriLanka: [7.8731, 80.7718],
    Sudan: [12.8628, 30.2176],
    Suriname: [3.9193, -56.0278],
    Sweden: [60.1282, 18.6435],
    Switzerland: [46.8182, 8.2275],
    Syria: [34.8021, 38.9968],

    Taiwan: [23.6978, 120.9605],
    Tajikistan: [38.8610, 71.2761],
    Tanzania: [-6.3690, 34.8888],
    Thailand: [15.8700, 100.9925],
    TimorLeste: [-8.8742, 125.7275],
    Togo: [8.6195, 0.8248],
    Tonga: [-21.1790, -175.1982],
    TrinidadAndTobago: [10.6918, -61.2225],
    Tunisia: [33.8869, 9.5375],
    Turkey: [38.9637, 35.2433],
    Turkmenistan: [38.9697, 59.5563],
    Tuvalu: [-7.1095, 177.6493],

    Uganda: [1.3733, 32.2903],
    Ukraine: [48.3794, 31.1656],
    UnitedArabEmirates: [23.4241, 53.8478],
    UnitedKingdom: [55.3781, -3.4360],
    UnitedStates: [37.0902, -95.7129],
    Uruguay: [-32.5228, -55.7658],
    Uzbekistan: [41.3775, 64.5853],

    Vanuatu: [-15.3767, 166.9592],
    VaticanCity: [41.9029, 12.4534],
    Venezuela: [6.4238, -66.5897],
    Vietnam: [14.0583, 108.2772],

    Yemen: [15.5527, 48.5164],

    Zambia: [-13.1339, 27.8493],
    Zimbabwe: [-19.0154, 29.1549]

};


/* =========================================================
   HELPER
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element =
        getElement(id);

    if (!element) {
        return;
    }

    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? value
            : "-";

}


/* =========================================================
   TRACKING NUMBER
   ========================================================= */

function getTrackingNumber() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlTracking =
        params.get("tracking") ||
        params.get("trackingNumber");


    if (urlTracking) {

        return urlTracking
            .trim()
            .toUpperCase();

    }


    const input =
        getElement("trackingNumber");


    if (
        input &&
        input.value.trim()
    ) {

        return input.value
            .trim()
            .toUpperCase();

    }


    return "";

}


/* =========================================================
   TRACK SHIPMENT
   ========================================================= */

async function trackShipment() {

    const tracking =
        getTrackingNumber();


    if (!tracking) {

        showMessage(
            "Please enter a tracking number.",
            "error"
        );

        return;

    }


    const input =
        getElement("trackingNumber");


    if (input) {

        input.value =
            tracking;

    }


    const result =
        getElement("trackingResult");


    if (result) {

        result.style.display =
            "none";

    }


    showMessage(
        "Searching for shipment...",
        "loading"
    );


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("shipments")

            .select("*")

            .eq(
                "tracking_number",
                tracking
            )

            .maybeSingle();


        if (error) {

            console.error(
                "Supabase error:",
                error
            );

            throw error;

        }


        if (!data) {

            showMessage(
                "Shipment not found. Please check your tracking number.",
                "error"
            );

            return;

        }


        console.log(
            "SHIPMENT FOUND:",
            data
        );


        displayShipment(data);


        const message =
            getElement("message");


        if (message) {

            message.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Tracking error:",
            error
        );


        showMessage(
            "Unable to connect to the tracking system. Please try again.",
            "error"
        );

    }

}


/* =========================================================
   DISPLAY SHIPMENT
   ========================================================= */

function displayShipment(shipment) {

    const tracking =
        shipment.tracking_number ||
        shipment.trackingNumber ||
        shipment.tracking ||
        "";


    const status =
        shipment.status ||
        "Shipment Created";


    const location =
        shipment.location ||
        shipment.current_location ||
        shipment.currentLocation ||
        "";


    const origin =
        shipment.origin ||
        "";


    const destination =
        shipment.destination ||
        "";


    const delivery =
        shipment.delivery_date ||
        shipment.deliveryDate ||
        shipment.estimated_delivery ||
        shipment.estimatedDelivery ||
        "";


    const service =
        shipment.service ||
        "";


    const payment =
        shipment.payment ||
        shipment.payment_status ||
        shipment.paymentStatus ||
        "";


    const packageName =
        shipment.package ||
        shipment.package_name ||
        shipment.packageName ||
        "";


    const packageType =
        shipment.package_type ||
        shipment.packageType ||
        "";


    const weight =
        shipment.weight ||
        "";


    const pieces =
        shipment.pieces ||
        "";


    const dimensions =
        shipment.dimensions ||
        "";


    /* =====================================================
       MAIN TRACKING INFORMATION
       ===================================================== */

    setText(
        "displayTracking",
        tracking
    );

    setText(
        "displayStatus",
        status
    );

    setText(
        "displayOrigin",
        origin
    );

    setText(
        "displayLocation",
        location
    );

    setText(
        "displayDestination",
        destination
    );

    setText(
        "displayDelivery",
        delivery
    );

    setText(
        "displayService",
        service
    );

    setText(
        "displayPayment",
        payment
    );


    /* =====================================================
       PACKAGE INFORMATION
       ===================================================== */

    setText(
        "packageInfo",
        packageName
    );

    setText(
        "packageType",
        packageType
    );

    setText(
        "packageWeight",
        weight
    );

    setText(
        "packagePieces",
        pieces
    );

    setText(
        "packageDimensions",
        dimensions
    );


    /* =====================================================
       ROUTE
       ===================================================== */

    setText(
        "routeOrigin",
        origin
    );

    setText(
        "routeCurrent",
        location
    );

    setText(
        "routeDestination",
        destination
    );


    /* =====================================================
       CONTROL CENTER
       ===================================================== */

    setText(
        "controlStatus",
        status
    );

    setText(
        "controlLocation",
        location
    );

    setText(
        "controlDestination",
        destination
    );


    /* =====================================================
       PROGRESS
       ===================================================== */

    let progress =
        Number(shipment.progress);


    if (
        Number.isNaN(progress)
    ) {

        progress =
            getProgress(status);

    }


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    updateProgress(
        progress
    );


    setText(
        "controlProgressText",
        progress + "%"
    );


    const controlProgress =
        getElement(
            "controlProgressFill"
        );


    if (controlProgress) {

        controlProgress.style.width =
            progress + "%";

    }


    /* =====================================================
       PAYMENT COLOR
       ===================================================== */

    const paymentElement =
        getElement(
            "displayPayment"
        );


    if (paymentElement) {

        paymentElement.classList.remove(
            "paid"
        );


        if (
            String(payment)
                .toLowerCase()
                .includes("paid")
        ) {

            paymentElement.classList.add(
                "paid"
            );

        }

    }


    /* =====================================================
       HISTORY
       ===================================================== */

    displayHistory(
        shipment.history
    );


    /* =====================================================
       MAP
       ===================================================== */

    displayMap(
        origin,
        location,
        destination
    );


    /* =====================================================
       SHOW RESULT
       ===================================================== */

    const result =
        getElement(
            "trackingResult"
        );


    if (result) {

        result.style.display =
            "block";

    }


    /* =====================================================
       LOCAL CACHE
       ===================================================== */

    localStorage.setItem(
        "currentShipment",
        JSON.stringify(shipment)
    );


    console.log(
        "Shipment displayed successfully."
    );

}


/* =========================================================
   PROGRESS
   ========================================================= */

function getProgress(status) {

    const value =
        String(status || "")
            .toLowerCase();


    if (
        value.includes("delivered")
    ) {
        return 100;
    }


    if (
        value.includes("out for delivery")
    ) {
        return 90;
    }


    if (
        value.includes("arrived")
    ) {
        return 75;
       }


    if (
        value.includes("customs")
    ) {
        return 65;
    }


    if (
        value.includes("transit")
    ) {
        return 50;
    }


    if (
        value.includes("picked up")
    ) {
        return 25;
    }


    if (
        value.includes("awaiting pickup")
    ) {
        return 15;
    }


    return 5;

}


function updateProgress(progress) {

    const progressFill =
        getElement(
            "progressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }


    const progressText =
        getElement(
            "progressText"
        );


    if (progressText) {

        progressText.textContent =
            progress + "%";

    }

}


/* =========================================================
   HISTORY
   ========================================================= */

function displayHistory(historyData) {

    const historyContainer =
        getElement(
            "shipmentHistory"
        );


    if (!historyContainer) {
        return;
    }


    if (!historyData) {

        historyContainer.innerHTML =
            "<p>No shipment history available.</p>";

        return;

    }


    let history =
        historyData;


    if (
        typeof historyData === "string"
    ) {

        try {

            history =
                JSON.parse(historyData);

        } catch (error) {

            console.error(
                "History JSON error:",
                error
            );

            history = [];

        }

    }


    if (
        !Array.isArray(history) ||
        !history.length
    ) {

        historyContainer.innerHTML =
            "<p>No shipment history available.</p>";

        return;

    }


    historyContainer.innerHTML =
        history
            .slice()
            .reverse()
            .map(function (item) {

                const status =
                    item.status ||
                    item.event ||
                    "Shipment Update";


                const location =
                    item.location ||
                    "";


                const date =
                    item.date ||
                    item.created_at ||
                    item.createdTime ||
                    "";


                return `
                    <div class="history-item">

                        <div class="history-dot">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>

                        <div class="history-content">

                            <strong>
                                ${escapeHTML(status)}
                            </strong>

                            ${
                                location
                                    ? `<span>${escapeHTML(location)}</span>`
                                    : ""
                            }

                            ${
                                date
                                    ? `<small>${escapeHTML(formatDate(date))}</small>`
                                    : ""
                            }

                        </div>

                    </div>
                `;

            })
            .join("");

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(value) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   NORMALIZE LOCATION
   ========================================================= */

function normalizeLocation(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[.,]/g, " ")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

}


/* =========================================================
   FIND COORDINATES
   ========================================================= */

function findCoordinates(place) {

    if (!place) {
        return null;
    }


    const original =
        String(place).trim();


    const text =
        normalizeLocation(original);


    /* =====================================================
       EXACT CITY MATCH
       ===================================================== */

    for (
        const key in locationCoordinates
    ) {

        const normalizedKey =
            normalizeLocation(key);

        if (
            text === normalizedKey
        ) {

            return locationCoordinates[key];

        }

    }


    /* =====================================================
       CITY / LOCATION MATCHES
       ===================================================== */

    const cityAliases = [

        ["nairobi", "Nairobi"],
        ["mombasa", "Mombasa"],

        ["london", "London"],
        ["edinburgh", "Edinburgh"],
        ["glasgow", "Glasgow"],

        ["new york", "New York"],
        ["los angeles", "Los Angeles"],
        ["chicago", "Chicago"],
        ["miami", "Miami"],
        ["houston", "Houston"],
        ["atlanta", "Atlanta"],
        ["seattle", "Seattle"],
        ["boston", "Boston"],
        ["washington", "Washington"],

        ["toronto", "Toronto"],
        ["vancouver", "Vancouver"],
        ["montreal", "Montreal"],

        ["dubai", "Dubai"],
        ["abu dhabi", "AbuDhabi"],

        ["paris", "Paris"],
        ["berlin", "Berlin"],
        ["rome", "Rome"],
        ["madrid", "Madrid"],
        ["amsterdam", "Amsterdam"],
        ["brussels", "Brussels"],
        ["lisbon", "Lisbon"],
        ["vienna", "Vienna"],
        ["zurich", "Zurich"],
        ["athens", "Athens"],
        ["copenhagen", "Copenhagen"],
        ["stockholm", "Stockholm"],
        ["oslo", "Oslo"],
        ["helsinki", "Helsinki"],
        ["warsaw", "Warsaw"],
        ["prague", "Prague"],
        ["budapest", "Budapest"],
        ["bucharest", "Bucharest"],
        ["dublin", "Dublin"],

        ["beijing", "Beijing"],
        ["shanghai", "Shanghai"],
        ["tokyo", "Tokyo"],
        ["osaka", "Osaka"],
        ["seoul", "Seoul"],
        ["singapore", "Singapore"],
        ["bangkok", "Bangkok"],
        ["jakarta", "Jakarta"],
        ["manila", "Manila"],
        ["kuala lumpur", "KualaLumpur"],
        ["mumbai", "Mumbai"],
        ["delhi", "Delhi"],
        ["karachi", "Karachi"],
        ["dhaka", "Dhaka"],

        ["sydney", "Sydney"],
        ["melbourne", "Melbourne"],
        ["perth", "Perth"],
        ["brisbane", "Brisbane"],

        ["johannesburg", "Johannesburg"],
        ["cape town", "CapeTown"],
        ["cairo", "Cairo"],
        ["accra", "Accra"],
        ["lagos", "Lagos"],
        ["addis ababa", "AddisAbaba"],
        ["kampala", "Kampala"],
        ["dar es salaam", "DarEsSalaam"],
        ["kigali", "Kigali"],
        ["lusaka", "Lusaka"],
        ["harare", "Harare"],
        ["maputo", "Maputo"],

        ["san jose", "San Jose"],
        ["guatemala city", "GuatemalaCity"],
        ["panama city", "PanamaCity"],
        ["mexico city", "MexicoCity"],
        ["havana", "Havana"],

        ["sao paulo", "SaoPaulo"],
        ["buenos aires", "BuenosAires"],
        ["santiago", "Santiago"],
        ["lima", "Lima"],
        ["bogota", "Bogota"],
        ["caracas", "Caracas"],

        ["moscow", "Moscow"],
        ["istanbul", "Istanbul"],
        ["riyadh", "Riyadh"],
        ["doha", "Doha"],
        ["kuwait city", "KuwaitCity"],
        ["muscat", "Muscat"],

        ["auckland", "Auckland"],
        ["wellington", "Wellington"]

    ];


    for (
        const [alias, key] of cityAliases
    ) {

        if (
            text.includes(alias)
        ) {

            return locationCoordinates[key];

        }

}

   /* =====================================================
       SPECIAL REGIONAL LOCATIONS
       ===================================================== */

    if (
        text.includes("scotland")
    ) {

        return [56.4907, -4.2026];

    }


    if (
        text.includes("wales")
    ) {

        return [52.1307, -3.7837];

    }


    if (
        text.includes("northern ireland")
    ) {

        return [54.7877, -6.4923];

    }


    if (
        text.includes("england")
    ) {

        return [52.3555, -1.1743];

    }


    /* =====================================================
       COUNTRY ALIASES
       ===================================================== */

    const countryAliases = [

        ["afghanistan", "Afghanistan"],
        ["albania", "Albania"],
        ["algeria", "Algeria"],
        ["andorra", "Andorra"],
        ["angola", "Angola"],
        ["antigua and barbuda", "AntiguaAndBarbuda"],
        ["argentina", "Argentina"],
        ["armenia", "Armenia"],
        ["australia", "Australia"],
        ["austria", "Austria"],
        ["azerbaijan", "Azerbaijan"],

        ["bahamas", "Bahamas"],
        ["bahrain", "Bahrain"],
        ["bangladesh", "Bangladesh"],
        ["barbados", "Barbados"],
        ["belarus", "Belarus"],
        ["belgium", "Belgium"],
        ["belize", "Belize"],
        ["benin", "Benin"],
        ["bhutan", "Bhutan"],
        ["bolivia", "Bolivia"],
        ["bosnia", "BosniaHerzegovina"],
        ["botswana", "Botswana"],
        ["brazil", "Brazil"],
        ["brunei", "Brunei"],
        ["bulgaria", "Bulgaria"],
        ["burkina faso", "BurkinaFaso"],
        ["burundi", "Burundi"],

        ["cabo verde", "CaboVerde"],
        ["cape verde", "CaboVerde"],
        ["cambodia", "Cambodia"],
        ["cameroon", "Cameroon"],
        ["canada", "Canada"],
        ["central african republic", "CentralAfricanRepublic"],
        ["chad", "Chad"],
        ["chile", "Chile"],
        ["china", "China"],
        ["colombia", "Colombia"],
        ["comoros", "Comoros"],
        ["congo", "Congo"],
        ["costa rica", "CostaRica"],
        ["costa", "CostaRica"],
        ["croatia", "Croatia"],
        ["cuba", "Cuba"],
        ["cyprus", "Cyprus"],
        ["czech republic", "Czechia"],
        ["czechia", "Czechia"],

        ["denmark", "Denmark"],
        ["djibouti", "Djibouti"],
        ["dominica", "Dominica"],
        ["dominican republic", "DominicanRepublic"],

        ["ecuador", "Ecuador"],
        ["egypt", "Egypt"],
        ["el salvador", "ElSalvador"],
        ["equatorial guinea", "EquatorialGuinea"],
        ["eritrea", "Eritrea"],
        ["estonia", "Estonia"],
        ["eswatini", "Eswatini"],
        ["ethiopia", "Ethiopia"],

        ["fiji", "Fiji"],
        ["finland", "Finland"],
        ["france", "France"],

        ["gabon", "Gabon"],
        ["gambia", "Gambia"],
        ["georgia", "Georgia"],
        ["germany", "Germany"],
        ["ghana", "Ghana"],
        ["greece", "Greece"],
        ["grenada", "Grenada"],
        ["guatemala", "Guatemala"],
        ["guinea", "Guinea"],
        ["guinea bissau", "GuineaBissau"],
        ["guyana", "Guyana"],

        ["haiti", "Haiti"],
        ["honduras", "Honduras"],
        ["hungary", "Hungary"],

        ["iceland", "Iceland"],
        ["india", "India"],
        ["indonesia", "Indonesia"],
        ["iran", "Iran"],
        ["iraq", "Iraq"],
        ["ireland", "Ireland"],
        ["israel", "Israel"],
        ["italy", "Italy"],

        ["jamaica", "Jamaica"],
        ["japan", "Japan"],
        ["jordan", "Jordan"],

        ["kazakhstan", "Kazakhstan"],
        ["kenya", "Kenya"],
        ["kiribati", "Kiribati"],
        ["kuwait", "Kuwait"],
        ["kyrgyzstan", "Kyrgyzstan"],

        ["laos", "Laos"],
        ["latvia", "Latvia"],
        ["lebanon", "Lebanon"],
        ["lesotho", "Lesotho"],
        ["liberia", "Liberia"],
        ["libya", "Libya"],
        ["liechtenstein", "Liechtenstein"],
        ["lithuania", "Lithuania"],
        ["luxembourg", "Luxembourg"],

        ["madagascar", "Madagascar"],
        ["malawi", "Malawi"],
        ["malaysia", "Malaysia"],
        ["maldives", "Maldives"],
        ["mali", "Mali"],
        ["malta", "Malta"],
        ["marshall islands", "MarshallIslands"],
        ["mauritania", "Mauritania"],
        ["mauritius", "Mauritius"],
        ["mexico", "Mexico"],
        ["micronesia", "Micronesia"],
        ["moldova", "Moldova"],
        ["monaco", "Monaco"],
        ["mongolia", "Mongolia"],
        ["montenegro", "Montenegro"],
        ["morocco", "Morocco"],
        ["mozambique", "Mozambique"],
        ["myanmar", "Myanmar"],

        ["namibia", "Namibia"],
        ["nauru", "Nauru"],
        ["nepal", "Nepal"],
        ["netherlands", "Netherlands"],
        ["new zealand", "NewZealand"],
        ["nicaragua", "Nicaragua"],
        ["niger", "Niger"],
        ["nigeria", "Nigeria"],
        ["north korea", "NorthKorea"],
        ["north macedonia", "NorthMacedonia"],
        ["norway", "Norway"],

        ["oman", "Oman"],

        ["pakistan", "Pakistan"],
        ["palau", "Palau"],
        ["panama", "Panama"],
        ["papua new guinea", "PapuaNewGuinea"],
        ["paraguay", "Paraguay"],
        ["peru", "Peru"],
        ["philippines", "Philippines"],
        ["poland", "Poland"],
        ["portugal", "Portugal"],

        ["qatar", "Qatar"],

        ["romania", "Romania"],
        ["russia", "Russia"],
        ["rwanda", "Rwanda"],

        ["saint kitts and nevis", "SaintKittsAndNevis"],
        ["saint lucia", "SaintLucia"],
        ["saint vincent", "SaintVincent"],
        ["samoa", "Samoa"],
        ["san marino", "SanMarino"],
        ["sao tome", "SaoTome"],
        ["saudi arabia", "SaudiArabia"],
        ["senegal", "Senegal"],
        ["serbia", "Serbia"],
        ["seychelles", "Seychelles"],
        ["sierra leone", "SierraLeone"],
        ["singapore", "Singapore"],
        ["slovakia", "Slovakia"],
        ["slovenia", "Slovenia"],
        ["solomon islands", "SolomonIslands"],
        ["somalia", "Somalia"],
        ["south africa", "SouthAfrica"],
        ["south korea", "SouthKorea"],
        ["south sudan", "SouthSudan"],
        ["spain", "Spain"],
        ["sri lanka", "SriLanka"],
        ["sudan", "Sudan"],
        ["suriname", "Suriname"],
        ["sweden", "Sweden"],
        ["switzerland", "Switzerland"],
        ["syria", "Syria"],

        ["taiwan", "Taiwan"],
        ["tajikistan", "Tajikistan"],
        ["tanzania", "Tanzania"],
        ["thailand", "Thailand"],
        ["timor leste", "TimorLeste"],
        ["togo", "Togo"],
        ["tonga", "Tonga"],
        ["trinidad and tobago", "TrinidadAndTobago"],
        ["tunisia", "Tunisia"],
        ["turkey", "Turkey"],
        ["turkmenistan", "Turkmenistan"],
        ["tuvalu", "Tuvalu"],

        ["uganda", "Uganda"],
        ["ukraine", "Ukraine"],
        ["uruguay", "Uruguay"],
        ["uzbekistan", "Uzbekistan"],

        ["vanuatu", "Vanuatu"],
        ["vatican city", "VaticanCity"],
        ["venezuela", "Venezuela"],
        ["vietnam", "Vietnam"],

        ["yemen", "Yemen"],

        ["zambia", "Zambia"],
        ["zimbabwe", "Zimbabwe"]

    ];


    for (
        const [alias, key] of countryAliases
    ) {

        if (
            text.includes(alias)
        ) {

            return countryCoordinates[key];

        }

    }


    /* =====================================================
       COMMON SHORT NAMES
       ===================================================== */

    if (
        text === "uk" ||
        text.includes("united kingdom") ||
        text.includes("great britain")
    ) {

        return countryCoordinates.UnitedKingdom;

    }


    if (
        text === "usa" ||
        text === "us" ||
        text.includes("united states")
    ) {

        return countryCoordinates.UnitedStates;

    }


    if (
        text === "uae" ||
        text.includes("united arab emirates")
    ) {

        return countryCoordinates.UnitedArabEmirates;

    }


    if (
        text === "drc" ||
        text.includes("democratic republic of congo")
    ) {

        return [ -2.8797, 23.6560 ];

    }


    /* =====================================================
       AGL WAREHOUSE
       ===================================================== */

    if (
        text.includes("american global logistics") ||
        text.includes("agl warehouse") ||
        text.includes("warehouse")
    ) {

        return locationCoordinates.Nairobi;

    }


    /* =====================================================
       FINAL FALLBACK
       ===================================================== */

    console.error(
        "NO COORDINATES FOUND FOR LOCATION:",
        place
    );

    return null;

}


/* =========================================================
   DISPLAY MAP
   ========================================================= */

function displayMap(
    origin,
    current,
    destination
) {

    console.log(
        "MAP ORIGIN:",
        origin
    );

    console.log(
        "MAP CURRENT:",
        current
    );

    console.log(
        "MAP DESTINATION:",
        destination
    );


    const mapElement =
        getElement(
            "shipmentMap"
        );


    if (!mapElement) {

        console.error(
            "shipmentMap element not found."
        );

        return;

    }


    /* =====================================================
       FIND COORDINATES
       ===================================================== */

    const originCoords =
        findCoordinates(origin);


    const destinationCoords =
        findCoordinates(destination);


    const currentCoords =
        findCoordinates(current);


    console.log(
        "ORIGIN COORDINATES:",
        originCoords
    );

    console.log(
        "DESTINATION COORDINATES:",
        destinationCoords
    );

    console.log(
        "CURRENT COORDINATES:",
        currentCoords
    );

   /* =====================================================
       CHECK ROUTE
       ===================================================== */

    if (
        !originCoords ||
        !destinationCoords
    ) {

        console.warn(
            "Map coordinates not found:",
            origin,
            destination
        );


        mapElement.innerHTML = `
            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                padding:20px;
                font-family:Arial,sans-serif;
            ">

                <div>

                    <i
                        class="fa-solid fa-location-dot"
                        style="
                            font-size:34px;
                            color:#0b4ea2;
                            margin-bottom:12px;
                        ">
                    </i>

                    <br>

                    <strong>
                        Shipment route map is unavailable.
                    </strong>

                </div>

            </div>
        `;

        return;

    }


    /* =====================================================
       REMOVE PREVIOUS MAP
       ===================================================== */

    if (shipmentMap) {

        shipmentMap.remove();

        shipmentMap = null;

    }


    /* =====================================================
       CREATE LEAFLET MAP
       ===================================================== */

    shipmentMap =
        L.map(
            "shipmentMap",
            {
                zoomControl: false,
                attributionControl: false
            }
        );


    /* =====================================================
       OPEN STREET MAP
       ===================================================== */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19
        }
    ).addTo(
        shipmentMap
    );


    /* =====================================================
       ORIGIN MARKER
       ===================================================== */

    L.marker(
        originCoords
    )
        .addTo(
            shipmentMap
        )
        .bindPopup(
            "<strong>Origin</strong><br>" +
            escapeHTML(
                String(
                    origin || ""
                )
            )
        );


    /* =====================================================
       DESTINATION MARKER
       ===================================================== */

    L.marker(
        destinationCoords
    )
        .addTo(
            shipmentMap
        )
        .bindPopup(
            "<strong>Destination</strong><br>" +
            escapeHTML(
                String(
                    destination || ""
                )
            )
        );


    /* =====================================================
       CURRENT LOCATION
       ===================================================== */

    if (
        currentCoords &&
        current &&
        current !== "-"
    ) {

        L.circleMarker(
            currentCoords,
            {
                radius: 8,
                weight: 3,
                fillOpacity: 1
            }
        )
            .addTo(
                shipmentMap
            )
            .bindPopup(
                "<strong>Current Location</strong><br>" +
                escapeHTML(
                    String(
                        current
                    )
                )
            );

    }


    /* =====================================================
       DASHED ROUTE
       ===================================================== */

    routeLine =
        L.polyline(
            [
                originCoords,
                destinationCoords
            ],
            {
                color: "#0b4ea2",
                weight: 4,
                opacity: 0.9,
                dashArray: "10, 10"
            }
        ).addTo(
            shipmentMap
        );


    /* =====================================================
       STATIONARY AIRPLANE
       ===================================================== */

    const airplaneIcon =
        L.divIcon({

            className:
                "stationary-airplane",

            html: `
                <div class="airplane-wrapper">
                    <i class="fa-solid fa-plane"></i>
                </div>
            `,

            iconSize: [
                42,
                42
            ],

            iconAnchor: [
                21,
                21
            ]

        });


    airplaneMarker =
        L.marker(
            originCoords,
            {
                icon:
                    airplaneIcon,

                zIndexOffset:
                    1000,

                interactive:
                    false
            }
        ).addTo(
            shipmentMap
        );


    /* =====================================================
       CENTER AIRPLANE BETWEEN ORIGIN & DESTINATION
       NO ANIMATION
       ===================================================== */

    placeStationaryAirplane(
        originCoords,
        destinationCoords
    );


    /* =====================================================
       FIT MAP TO ROUTE
       ===================================================== */

    const bounds =
        L.latLngBounds(
            [
                originCoords,
                destinationCoords
            ]
        );


    shipmentMap.fitBounds(
        bounds,
        {
            padding: [
                40,
                40
            ]
        }
    );


    /* =====================================================
       REFRESH MAP SIZE
       ===================================================== */

    requestAnimationFrame(
        function () {

            if (!shipmentMap) {
                return;
            }


            shipmentMap.invalidateSize();


            shipmentMap.fitBounds(
                bounds,
                {
                    padding: [
                        40,
                        40
                    ]
                }
            );

        }
    );

}


/* =========================================================
   STATIONARY AIRPLANE
   ========================================================= */

function placeStationaryAirplane(
    origin,
    destination
) {

    if (
        !airplaneMarker
    ) {

        return;

    }


    const latitude =
        (
            origin[0] +
            destination[0]
        ) / 2;


    const longitude =
        (
            origin[1] +
            destination[1]
        ) / 2;


    airplaneMarker.setLatLng(
        [
            latitude,
            longitude
        ]
    );

}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    text,
    type
) {

    const message =
        getElement(
            "message"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.style.display =
        "block";


    message.className =
        "message " +
        (type || "");

}


/* =========================================================
   NEW SEARCH
   ========================================================= */

function newSearch() {

    const input =
        getElement(
            "trackingNumber"
        );


    const result =
        getElement(
            "trackingResult"
        );


    if (input) {

        input.value = "";

        input.focus();

    }


    if (result) {

        result.style.display =
            "none";

    }


    const message =
        getElement(
            "message"
        );


    if (message) {

        message.style.display =
            "none";

    }


    if (shipmentMap) {

        shipmentMap.remove();

        shipmentMap =
            null;

    }


    routeLine =
        null;


    airplaneMarker =
        null;

}


/* =========================================================
   COPY TRACKING NUMBER
   ========================================================= */

function copyTrackingNumber() {

    const element =
        getElement(
            "displayTracking"
        );


    if (!element) {
        return;
    }


    const text =
        element.textContent.trim();


    if (
        !text ||
        text === "-"
    ) {

        return;

    }


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(text)
            .then(
                function () {

                    showMessage(
                        "Tracking number copied.",
                        "success"
                    );

                }
            )
            .catch(
                function () {

                    fallbackCopy(
                        text
                    );

                }
            );

    } else {

        fallbackCopy(
            text
        );

    }

}


/* =========================================================
   FALLBACK COPY
   ========================================================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showMessage(
            "Tracking number copied.",
            "success"
        );

    } catch (error) {

        showMessage(
            "Unable to copy tracking number.",
            "error"
        );

    }


    document.body.removeChild(
        textarea
    );

}


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            getElement(
                "trackingNumber"
            );


        /* -----------------------------------------
           ENTER KEY
           ----------------------------------------- */

        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        trackShipment();

                    }

                }
            );

        }


        /* -----------------------------------------
           TRACKING NUMBER FROM URL
           ----------------------------------------- */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const tracking =
            params.get(
                "tracking"
            ) ||
            params.get(
                "trackingNumber"
            );


        if (
            tracking &&
            input
        ) {

            input.value =
                tracking;


            trackShipment();

        }

    }
);
  
