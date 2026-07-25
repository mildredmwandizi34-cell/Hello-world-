// ======================================================
// American Global Logistics
// Admin Dashboard v2.0
// ======================================================

alert("American Global Logistics Admin Dashboard Loaded");

// ------------------------------
// Local Storage
// ------------------------------

let shipments =
JSON.parse(localStorage.getItem("shipments")) || [];

let currentShipmentIndex = -1;

// ------------------------------
// Dashboard Map Variables
// ------------------------------

let adminMap;
let routeLine = null;
let originMarker = null;
let destinationMarker = null;
let movingVehicle = null;

let selectingOrigin = true;

// ------------------------------
// Dashboard Icons
// ------------------------------

const airportIcon = L.AwesomeMarkers.icon({
    icon: "plane",
    prefix: "fa",
    markerColor: "blue"
});

const warehouseIcon = L.AwesomeMarkers.icon({
    icon: "warehouse",
    prefix: "fa",
    markerColor: "green"
});

const seaportIcon = L.AwesomeMarkers.icon({
    icon: "ship",
    prefix: "fa",
    markerColor: "cadetblue"
});

const truckIcon = L.AwesomeMarkers.icon({
    icon: "truck",
    prefix: "fa",
    markerColor: "orange"
});

const destinationIcon = L.AwesomeMarkers.icon({
    icon: "location-dot",
    prefix: "fa",
    markerColor: "red"
});

const vehicleIcon = L.AwesomeMarkers.icon({
    icon: "plane",
    prefix: "fa",
    markerColor: "blue"
});
// ======================================================
// WORLD LOGISTICS HUBS
// ======================================================

const cities = {

    // ===== NORTH AMERICA =====
    "New York":[40.7128,-74.0060],
    "Los Angeles":[34.0522,-118.2437],
    "Chicago":[41.8781,-87.6298],
    "Miami":[25.7617,-80.1918],
    "Houston":[29.7604,-95.3698],
    "Atlanta":[33.7490,-84.3880],
    "Seattle":[47.6062,-122.3321],
    "Toronto":[43.6532,-79.3832],
    "Vancouver":[49.2827,-123.1207],
    "Montreal":[45.5019,-73.5674],
    "Mexico City":[19.4326,-99.1332],
    "Panama City":[8.9824,-79.5199],

    // ===== SOUTH AMERICA =====
    "Bogota":[4.7110,-74.0721],
    "Lima":[-12.0464,-77.0428],
    "Sao Paulo":[-23.5505,-46.6333],
    "Rio de Janeiro":[-22.9068,-43.1729],
    "Buenos Aires":[-34.6037,-58.3816],
    "Santiago":[-33.4489,-70.6693],

    // ===== EUROPE =====
    "London":[51.5074,-0.1278],
    "Manchester":[53.4808,-2.2426],
    "Paris":[48.8566,2.3522],
    "Amsterdam":[52.3676,4.9041],
    "Rotterdam":[51.9244,4.4777],
    "Frankfurt":[50.1109,8.6821],
    "Hamburg":[53.5511,9.9937],
    "Madrid":[40.4168,-3.7038],
    "Barcelona":[41.3874,2.1686],
    "Rome":[41.9028,12.4964],
    "Warsaw":[52.2297,21.0122],

    // ===== AFRICA =====
    "Nairobi":[-1.2864,36.8172],
    "Mombasa":[-4.0435,39.6682],
    "Johannesburg":[-26.2041,28.0473],
    "Cape Town":[-33.9249,18.4241],
    "Lagos":[6.5244,3.3792],
    "Cairo":[30.0444,31.2357],
    "Casablanca":[33.5731,-7.5898],
    "Addis Ababa":[8.9806,38.7578],

    // ===== MIDDLE EAST =====
    "Dubai":[25.2048,55.2708],
    "Abu Dhabi":[24.4539,54.3773],
    "Doha":[25.2854,51.5310],
    "Riyadh":[24.7136,46.6753],
    "Jeddah":[21.4858,39.1925],

    // ===== ASIA =====
    "Singapore":[1.3521,103.8198],
    "Hong Kong":[22.3193,114.1694],
    "Tokyo":[35.6762,139.6503],
    "Osaka":[34.6937,135.5023],
    "Seoul":[37.5665,126.9780],
    "Beijing":[39.9042,116.4074],
    "Shanghai":[31.2304,121.4737],
    "Shenzhen":[22.5431,114.0579],
    "Guangzhou":[23.1291,113.2644],
    "Bangkok":[13.7563,100.5018],
    "Mumbai":[19.0760,72.8777],
    "Delhi":[28.6139,77.2090],
    "Chennai":[13.0827,80.2707],
    "Kuala Lumpur":[3.1390,101.6869],

    // ===== OCEANIA =====
    "Sydney":[-33.8688,151.2093],
    "Melbourne":[-37.8136,144.9631],
    "Perth":[-31.9505,115.8605],
    "Auckland":[-36.8509,174.7645]

};
