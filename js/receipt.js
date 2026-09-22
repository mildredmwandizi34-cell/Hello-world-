/* =========================================================
   AMERICAN GLOBAL LOGISTICS
   SHIPMENT RECEIPT — A4 LANDSCAPE
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
    background: #dfe5ec;
    font-family: Arial, Helvetica, sans-serif;
    color: #17212b;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

body {
    padding: 8px;
}


/* =========================================================
   MAIN A4 RECEIPT
   ========================================================= */

.receipt-page {
    width: 297mm;
    min-height: 210mm;
    margin: 0 auto;
    padding: 5mm;
    background: #ffffff;
    overflow: hidden;
}


/* =========================================================
   HEADER
   ========================================================= */

.receipt-header {
    width: 100%;
    min-height: 27mm;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 5mm;
    margin-bottom: 3mm;
}

.brand-block {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    padding: 3mm 4mm;
    background: #0b4ea2;
    border: 2px solid #083b80;
}

.receipt-logo {
    width: 25mm;
    height: 25mm;
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
    font-size: 19px;
    font-weight: 800;
    letter-spacing: 0.5px;
}

.brand-text p {
    margin: 0;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}

.document-box {
    width: 76mm;
    flex-shrink: 0;
    border: 2px solid #0b4ea2;
    background: #eaf3ff;
    padding: 3mm;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.document-label {
    font-size: 8px;
    font-weight: 700;
    color: #0b4ea2;
    letter-spacing: 0.7px;
}

.document-title {
    margin: 1mm 0;
    font-size: 16px;
    font-weight: 900;
    color: #083b80;
    letter-spacing: 0.5px;
}

.document-meta {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1mm;
}

.document-meta div {
    padding: 1.5mm 1mm;
    background: #ffffff;
    border: 1px solid #b7cee8;
    font-size: 7px;
    font-weight: 700;
    overflow: hidden;
    word-break: break-word;
}


/* =========================================================
   SUMMARY BAR
   ========================================================= */

.summary-strip {
    width: 100%;
    min-height: 14mm;
    display: grid;
    grid-template-columns: 1.25fr 1.2fr 1fr 1fr 1.1fr;
    border: 2px solid #0b4ea2;
    background: #eaf3ff;
    margin-bottom: 3mm;
}

.summary-item {
    min-width: 0;
    padding: 2mm 2.5mm;
    border-right: 1px solid #aac5e3;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.summary-item:last-child {
    border-right: 0;
}

.summary-label {
    font-size: 7px;
    font-weight: 800;
    color: #0b4ea2;
    letter-spacing: 0.6px;
    margin-bottom: 1mm;
}

.summary-value {
    font-size: 10px;
    font-weight: 800;
    color: #17212b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#receiptPaymentStatus {
    color: #16803c;
}

#verificationCode {
    color: #16803c;
}


/* =========================================================
   THREE HORIZONTAL INFORMATION BOXES
   ========================================================= */

.people-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1.08fr;
    gap: 3mm;
    margin-bottom: 3mm;
    align-items: stretch;
}

.person-card,
.shipment-details {
    min-width: 0;
    min-height: 50mm;
    border: 2px solid #0b4ea2;
    background: #f4f9ff;
    overflow: hidden;
}

.shipment-details {
    margin: 0;
}


/* =========================================================
   SECTION HEADINGS
   ========================================================= */

.section-heading {
    min-height: 9mm;
    padding: 2.2mm 3mm;
    background: #0b4ea2;
    color: #ffffff;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.4px;
    display: flex;
    align-items: center;
}


/* =========================================================
   SENDER / RECEIVER
   ========================================================= */

.person-content {
    padding: 2.5mm 3mm;
    display: flex;
    flex-direction: column;
    gap: 1.3mm;
}

.person-content div {
    min-height: 4mm;
    padding-bottom: 1mm;
    border-bottom: 1px solid #d6e3f0;
    font-size: 8.5px;
    line-height: 1.25;
    overflow-wrap: anywhere;
}

.person-content div:first-child {
    font-size: 10px;
    font-weight: 800;
    color: #083b80;
}

.person-content div:nth-child(2) {
    font-weight: 700;
}


/* =========================================================
   SHIPMENT DETAILS
   ========================================================= */

.details-grid {
    padding: 2.2mm 3mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 3mm;
    row-gap: 1.2mm;
}

.detail-item {
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 1mm;
    border-bottom: 1px solid #d6e3f0;
}

.detail-item label {
    font-size: 6.5px;
    font-weight: 800;
    color: #0b4ea2;
    text-transform: uppercase;
}

.detail-item span {
    margin-top: 0.5mm;
    font-size: 7.5px;
    font-weight: 700;
    line-height: 1.15;
    overflow-wrap: anywhere;
}


/* =========================================================
   ROUTE + CHARGES
   ========================================================= */

.route-charges-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 2.05fr 0.95fr;
    gap: 3mm;
    margin-bottom: 3mm;
    align-items: stretch;
}

.route-panel,
.charges-panel {
    min-width: 0;
    border: 2px solid #0b4ea2;
    background: #f4f9ff;
    overflow: hidden;
}

.route-points {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2mm;
    padding: 2mm 3mm;
}

.route-point {
    min-width: 0;
}

.route-point label {
    display: block;
    margin-bottom: 1mm;
    font-size: 6.5px;
    font-weight: 900;
    color: #0b4ea2;
}

.route-point span {
    display: block;
    font-size: 8px;
    font-weight: 700;
    overflow-wrap: anywhere;
}


/* =========================================================
   MAP
   ========================================================= */

.map-wrapper {
    position: relative;
    height: 31mm;
    margin: 0 3mm 3mm;
    border: 1px solid #9ebbd8;
    background: #dcecff;
    overflow: hidden;
}

#receiptMap {
    width: 100%;
    height: 100%;
}

.leaflet-control-attribution {
    display: none !important;
}

.agl-airplane {
    position: absolute;
    z-index: 999;
    left: 48%;
    top: 43%;
    font-size: 20px;
    color: #ff9800;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    animation: aglFlight 4s linear infinite;
}

@keyframes aglFlight {
    0% {
        transform: translateX(-35px) translateY(8px) rotate(-8deg);
    }

    50% {
        transform: translateX(0) translateY(-3px) rotate(0deg);
    }

    100% {
        transform: translateX(35px) translateY(8px) rotate(8deg);
    }
}


/* =========================================================
   CHARGES
   ========================================================= */

.charges-list {
    padding: 3mm;
}

.charge-row {
    display: flex;
    justify-content: space-between;
    gap: 3mm;
    padding: 2.2mm 0;
    border-bottom: 1px solid #d6e3f0;
    font-size: 8px;
    font-weight: 700;
}

.charge-row span:last-child {
    font-weight: 800;
    text-align: right;
}

.charge-divider {
    height: 1px;
    background: #0b4ea2;
    margin: 3mm 0;
}

.charge-total {
    display: flex;
    flex-direction: column;
    gap: 1.5mm;
    padding: 2.5mm;
    background: #e3f1ff;
    border: 1px solid #9ebbd8;
}

.charge-total span {
    font-size: 7px;
    font-weight: 900;
    color: #083b80;
}

.charge-total strong {
    font-size: 15px;
    color: #0b4ea2;
}


/* =========================================================
   VERIFICATION
   ========================================================= */

.verification-section {
    width: 100%;
    border: 2px solid #0b4ea2;
    background: #f4f9ff;
    margin-bottom: 3mm;
    overflow: hidden;
}

.verification-status {
    display: flex;
    align-items: center;
    gap: 3mm;
    padding: 2mm 3mm;
    border-bottom: 1px solid #c4d8ed;
}

.verification-icon {
    width: 8mm;
    height: 8mm;
    flex-shrink: 0;
    border-radius: 50%;
    background: #16803c;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 900;
}

.verification-status-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1mm;
}

.verification-status-text strong {
    color: #16803c;
    font-size: 9px;
}

.verification-status-text span {
    font-size: 7px;
}

.authorized-badge {
    padding: 2mm 3mm;
    border: 1px solid #16803c;
    color: #16803c;
    background: #edf9f1;
    font-size: 8px;
    font-weight: 900;
}


/* =========================================================
   VERIFICATION MESSAGE
   ========================================================= */

.verification-message {
    display: none;
}

.verification-identifiers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2mm;
    padding: 2mm 3mm;
}

.verification-identifiers > div {
    min-width: 0;
    padding: 1.5mm 2mm;
    background: #ffffff;
    border: 1px solid #b7cee8;
}

.verification-identifiers label {
    display: block;
    font-size: 6px;
    font-weight: 900;
    color: #0b4ea2;
    margin-bottom: 1mm;
}

.verification-identifiers span {
    display: block;
    font-size: 7.5px;
    font-weight: 800;
    overflow-wrap: anywhere;
}


/* =========================================================
   BARCODE / QR / OFFICER
   ========================================================= */

.verification-tools {
    display: grid;
    grid-template-columns: 1.5fr 0.7fr 1fr;
    gap: 3mm;
    padding: 0 3mm 2mm;
    align-items: center;
}

.barcode-box,
.qr-box,
.officer-box {
    min-height: 22mm;
    background: #ffffff;
    border: 1px solid #b7cee8;
    display: flex;
    align-items: center;
    justify-content: center;
}

.barcode-box {
    padding: 2mm;
}

#barcodeLarge {
    width: 100%;
    height: 17mm;
    max-width: 100%;
}

.qr-box {
    flex-direction: column;
    gap: 1mm;
    padding: 1.5mm;
}

#qrcode {
    width: 16mm;
    height: 16mm;
}

#qrcode img,
#qrcode canvas {
    width: 16mm !important;
    height: 16mm !important;
}

.qr-box span {
    font-size: 5.5px;
    font-weight: 900;
    color: #0b4ea2;
}

.officer-box {
    position: relative;
    gap: 2mm;
    padding: 1.5mm;
}

.officer-box img:first-child {
    width: 30mm;
    max-height: 11mm;
    object-fit: contain;
}

.officer-box img:nth-child(2) {
    width: 16mm;
    height: 16mm;
    object-fit: contain;
}

.officer-box #authorizedStatus {
    position: absolute;
    right: 2mm;
    bottom: 1.5mm;
    font-size: 6px;
    font-weight: 900;
    color: #16803c;
}

.verification-footnote {
    padding: 1.5mm 3mm;
    border-top: 1px solid #c4d8ed;
    text-align: center;
    font-size: 6px;
    font-weight: 800;
    color: #0b4ea2;
}


/* =========================================================
   FOOTER
   ========================================================= */

.receipt-footer {
    width: 100%;
    min-height: 18mm;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.2fr;
    gap: 3mm;
    padding: 3mm 4mm;
    background: #0b4ea2;
    color: #ffffff;
    border: 2px solid #083b80;
}

.footer-left,
.footer-center,
.footer-right {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.footer-center {
    align-items: center;
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.3);
    border-right: 1px solid rgba(255,255,255,0.3);
}

.footer-right {
    align-items: flex-end;
    text-align: right;
}

.receipt-footer strong {
    font-size: 8px;
    margin-bottom: 1mm;
}

.receipt-footer span {
    font-size: 6.5px;
    line-height: 1.35;
}


/* =========================================================
   PAID / VERIFIED
   ========================================================= */

.payment-paid,
#paymentStatus,
#receiptPaymentStatus,
#verificationStatus,
#authorizedStatus,
#authorizedStatusTop {
    color: #16803c !important;
    font-weight: 900;
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
        padding: 5mm;
        overflow: hidden;
    }

    .receipt-header,
    .summary-strip,
    .people-grid,
    .route-charges-grid,
    .verification-section,
    .receipt-footer {
        break-inside: avoid;
        page-break-inside: avoid;
    }
}


/* =========================================================
   MOBILE PREVIEW
   ========================================================= */

@media screen and (max-width: 900px) {

    body {
        padding: 0;
        overflow-x: auto;
    }

    .receipt-page {
        margin: 0;
        transform-origin: top left;
    }
}
