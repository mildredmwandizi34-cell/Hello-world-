/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   SHIPMENT RECEIPT
   A4 LANDSCAPE — HORIZONTAL PROFESSIONAL LAYOUT
   ========================================================= */

@page {
    size: A4 landscape;
    margin: 0;
}

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #dfe5ec;
    color: #17212b;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

body {
    padding: 8px;
}


/* =========================================================
   A4 PAGE
   ========================================================= */

.receipt-page {
    width: 297mm;
    height: 210mm;
    margin: 0 auto;
    padding: 4mm;
    background: #ffffff;
    overflow: hidden;
}


/* =========================================================
   HEADER
   ========================================================= */

.receipt-header {
    width: 100%;
    height: 27mm;
    display: grid;
    grid-template-columns: 1fr 72mm;
    gap: 3mm;
    margin-bottom: 2.5mm;
}

.brand-area {
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 3mm 4mm;
    background: #0b4ea2;
    border: 2px solid #083b80;
}

.receipt-logo {
    width: 23mm;
    height: 23mm;
    object-fit: contain;
    flex-shrink: 0;
    margin-right: 4mm;
}

.brand-text {
    min-width: 0;
    color: #ffffff;
}

.brand-text h1 {
    margin: 0 0 2mm;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.brand-text p {
    margin: 0;
    font-size: 8.5px;
    font-weight: 700;
    white-space: nowrap;
}

.receipt-heading {
    min-width: 0;
    padding: 2.5mm;
    border: 2px solid #0b4ea2;
    background: #eaf3ff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.official-label {
    font-size: 6.5px;
    font-weight: 900;
    color: #0b4ea2;
    letter-spacing: 0.6px;
}

.receipt-title {
    margin: 1mm 0 2mm;
    font-size: 14px;
    font-weight: 900;
    color: #083b80;
    letter-spacing: 0.5px;
}

.document-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1mm;
}

.document-meta div {
    min-width: 0;
    padding: 1.2mm;
    background: #ffffff;
    border: 1px solid #a9c4e0;
}

.document-meta span {
    display: block;
    font-size: 5px;
    font-weight: 900;
    color: #0b4ea2;
}

.document-meta strong {
    display: block;
    margin-top: 0.6mm;
    font-size: 6px;
    overflow-wrap: anywhere;
}


/* =========================================================
   SUMMARY BAR
   ========================================================= */

.summary-bar {
    width: 100%;
    height: 13mm;
    display: grid;
    grid-template-columns:
        1fr
        0.9fr
        0.9fr
        1fr
        0.8fr
        1.35fr
        0.9fr
        0.9fr;
    border: 2px solid #0b4ea2;
    background: #eaf3ff;
    margin-bottom: 2.5mm;
}

.summary-item {
    min-width: 0;
    padding: 1.5mm 2mm;
    border-right: 1px solid #b4cbe3;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.summary-item:last-child {
    border-right: 0;
}

.summary-item label {
    font-size: 5.5px;
    font-weight: 900;
    color: #0b4ea2;
    letter-spacing: 0.4px;
    margin-bottom: 0.8mm;
}

.summary-item strong {
    font-size: 7.5px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#summaryPayment,
#summaryVerify {
    color: #16803c;
}


/* =========================================================
   THREE MAIN HORIZONTAL BOXES
   ========================================================= */

.information-grid {
    width: 100%;
    height: 52mm;
    display: grid;
    grid-template-columns: 1fr 1fr 1.12fr;
    gap: 2.5mm;
    margin-bottom: 2.5mm;
}

.info-card {
    min-width: 0;
    height: 52mm;
    border: 2px solid #0b4ea2;
    background: #f4f9ff;
    overflow: hidden;
}

.section-heading {
    height: 8mm;
    padding: 1.8mm 2.5mm;
    display: flex;
    align-items: center;
    background: #0b4ea2;
    color: #ffffff;
    font-size: 7.5px;
    font-weight: 900;
    letter-spacing: 0.4px;
}


/* =========================================================
   SENDER / RECEIVER
   ========================================================= */

.person-details {
    padding: 2mm 2.5mm;
}

.person-details div {
    min-width: 0;
    display: grid;
    grid-template-columns: 18mm 1fr;
    gap: 2mm;
    padding: 1.1mm 0;
    border-bottom: 1px solid #d4e1ee;
}

.person-details label {
    font-size: 5.5px;
    font-weight: 900;
    color: #0b4ea2;
}

.person-details strong {
    min-width: 0;
    font-size: 7px;
    line-height: 1.1;
    overflow-wrap: anywhere;
}

.person-details div:first-child strong {
    color: #083b80;
    font-size: 8px;
}


/* =========================================================
   SHIPMENT DETAILS
   ========================================================= */

.shipment-detail-grid {
    padding: 1.8mm 2.5mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 3mm;
    row-gap: 1mm;
}

.shipment-detail-grid > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.9mm;
    border-bottom: 1px solid #d4e1ee;
}

.shipment-detail-grid label {
    font-size: 5px;
    font-weight: 900;
    color: #0b4ea2;
}

.shipment-detail-grid strong {
    margin-top: 0.5mm;
    font-size: 6.5px;
    line-height: 1.05;
    overflow-wrap: anywhere;
}

.shipment-detail-grid .wide-detail {
    grid-column: 1 / -1;
}


/* =========================================================
   ROUTE + CHARGES
   ========================================================= */

.route-charges-grid {
    width: 100%;
    height: 43mm;
    display: grid;
    grid-template-columns: 2.05fr 0.95fr;
    gap: 2.5mm;
    margin-bottom: 2.5mm;
}

.route-card,
.charges-card {
    min-width: 0;
    height: 43mm;
    border: 2px solid #0b4ea2;
    background: #f4f9ff;
    overflow: hidden;
}


/* =========================================================
   ROUTE INFORMATION
   ========================================================= */

.route-information {
    height: 10mm;
    padding: 1.5mm 2.5mm;
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: center;
    gap: 2mm;
}

.route-location {
    min-width: 0;
}

.route-location label {
    display: block;
    font-size: 5px;
    font-weight: 900;
    color: #0b4ea2;
    margin-bottom: 0.6mm;
}

.route-location strong {
    display: block;
    font-size: 6.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.route-arrow {
    color: #ff9800;
    font-size: 13px;
    font-weight: 900;
}


/* =========================================================
   MAP
   ========================================================= */

.map-wrapper {
    position: relative;
    height: 21mm;
    margin: 0 2.5mm 2.5mm;
    border: 1px solid #9dbbd9;
    overflow: hidden;
    background: #dcecff;
}

#receiptMap {
    width: 100%;
    height: 100%;
}

.leaflet-control-attribution {
    display: none !important;
}

.leaflet-control-zoom {
    transform: scale(0.7);
    transform-origin: top left;
}

.agl-airplane {
    position: absolute;
    z-index: 1000;
    left: 48%;
    top: 42%;
    color: #ff9800;
    font-size: 18px;
    font-weight: 900;
    pointer-events: none;
    animation: aglPlane 4s ease-in-out infinite;
}

@keyframes aglPlane {

    0% {
        transform: translateX(-30px) translateY(7px) rotate(-8deg);
    }

    50% {
        transform: translateX(0) translateY(-3px) rotate(0deg);
    }

    100% {
        transform: translateX(30px) translateY(7px) rotate(8deg);
    }
}


/* =========================================================
   CHARGES
   ========================================================= */

.charges-content {
    padding: 2mm 2.5mm;
}

.charge-row {
    display: flex;
    justify-content: space-between;
    padding: 1.7mm 0;
    border-bottom: 1px solid #d4e1ee;
    font-size: 7px;
    font-weight: 700;
}

.charge-row strong {
    color: #083b80;
}

.charge-line {
    height: 1px;
    background: #0b4ea2;
    margin: 2mm 0;
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2mm;
    background: #e3f1ff;
    border: 1px solid #9dbbd9;
}

.total-row span {
    font-size: 6px;
    font-weight: 900;
    color: #083b80;
}

.total-row strong {
    font-size: 11px;
    font-weight: 900;
    color: #0b4ea2;
}

.payment-result {
    display: flex;
    justify-content: space-between;
    padding-top: 2mm;
    font-size: 6.5px;
    font-weight: 900;
}

.payment-result strong {
    color: #16803c;
}


/* =========================================================
   VERIFICATION
   ========================================================= */

.verification-section {
    width: 100%;
    height: 43mm;
    border: 2px solid #0b4ea2;
    background: #f4f9ff;
    overflow: hidden;
    margin-bottom: 2.5mm;
}

.verification-top {
    height: 8mm;
    padding: 1.2mm 2.5mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #c8d9e9;
}

.verified-status {
    display: flex;
    align-items: center;
    gap: 2mm;
}

.verified-circle {
    width: 5.5mm;
    height: 5.5mm;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #16803c;
    color: #ffffff;
    font-size: 9px;
    font-weight: 900;
}

.verified-status div:last-child {
    display: flex;
    flex-direction: column;
}

.verified-status strong {
    font-size: 7px;
    color: #16803c;
}

.verified-status span {
    font-size: 5.5px;
}

.authorized-status {
    padding: 1.2mm 3mm;
    border: 1px solid #16803c;
    background: #edf9f1;
    color: #16803c;
    font-size: 6.5px;
    font-weight: 900;
}


/* =========================================================
   VERIFICATION IDENTIFIERS
   ========================================================= */

.verification-identifiers {
    height: 9mm;
    padding: 1.2mm 2.5mm;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2mm;
}

.verification-identifiers > div {
    min-width: 0;
    padding: 1mm 1.5mm;
    background: #ffffff;
    border: 1px solid #b7cee5;
}

.verification-identifiers label {
    display: block;
    font-size: 4.5px;
    font-weight: 900;
    color: #0b4ea2;
}

.verification-identifiers strong {
    display: block;
    margin-top: 0.5mm;
    font-size: 6.5px;
    overflow-wrap: anywhere;
}


/* =========================================================
   VERIFICATION TOOLS
   ========================================================= */

.verification-tools {
    height: 22mm;
    padding: 0 2.5mm 2mm;
    display: grid;
    grid-template-columns: 1.5fr 0.7fr 1fr;
    gap: 2.5mm;
}

.barcode-area,
.qr-area,
.officer-area {
    min-width: 0;
    background: #ffffff;
    border: 1px solid #b7cee5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.barcode-area {
    flex-direction: column;
    padding: 1mm 2mm;
}

.barcode-area label,
.qr-area label {
    align-self: flex-start;
    font-size: 4.5px;
    font-weight: 900;
    color: #0b4ea2;
}

#barcodeLarge {
    width: 100%;
    height: 14mm;
}

.qr-area {
    flex-direction: column;
    gap: 0.5mm;
}

#qrcode {
    width: 15mm;
    height: 15mm;
}

#qrcode img,
#qrcode canvas {
    width: 15mm !important;
    height: 15mm !important;
}

.qr-area span {
    font-size: 4.5px;
    font-weight: 900;
    color: #0b4ea2;
}

.officer-area {
    position: relative;
    flex-direction: column;
    gap: 1mm;
    padding: 1mm;
}

.officer-title {
    font-size: 5px;
    font-weight: 900;
    color: #0b4ea2;
}

.officer-signature {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2mm;
    height: 13mm;
}

.officer-signature img:first-child {
    width: 30mm;
    max-height: 10mm;
    object-fit: contain;
}

.officer-signature img:last-child {
    width: 14mm;
    height: 14mm;
    object-fit: contain;
}

.officer-area > strong {
    font-size: 5.5px;
    color: #16803c;
}


/* =========================================================
   FOOTER
   ========================================================= */

.receipt-footer {
    width: 100%;
    height: 17mm;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.2fr;
    background: #0b4ea2;
    color: #ffffff;
    border: 2px solid #083b80;
}

.footer-company,
.footer-official,
.footer-receipt {
    min-width: 0;
    padding: 2mm 3mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.footer-official {
    align-items: center;
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.35);
    border-right: 1px solid rgba(255,255,255,0.35);
}

.footer-receipt {
    align-items: flex-end;
    text-align: right;
}

.receipt-footer strong {
    font-size: 7px;
    margin-bottom: 0.7mm;
}

.receipt-footer span {
    font-size: 5.5px;
    line-height: 1.3;
}

.footer-receipt strong {
    font-size: 7px;
    margin: 0 0 0.5mm;
}


/* =========================================================
   PRINT
   ========================================================= */

@media print {

    html,
    body {
        width: 297mm;
        height: 210mm;
        margin: 0;
        padding: 0;
        background: #ffffff;
    }

    body {
        overflow: hidden;
    }

    .receipt-page {
        width: 297mm;
        height: 210mm;
        min-height: 210mm;
        margin: 0;
        padding: 4mm;
        overflow: hidden;
    }
}


/* =========================================================
   SCREEN
   ========================================================= */

@media screen and (max-width: 1000px) {

    body {
        overflow-x: auto;
    }

    .receipt-page {
        margin-left: 0;
        margin-right: 0;
    }
    }
