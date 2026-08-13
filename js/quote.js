document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("quoteForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        alert(
            "Thank you for requesting a shipping quote!\n\nOur logistics team has received your request and will contact you within 24 hours."
        );

        form.reset();

    });

});

<script src="js/main.js"></script>
<script src="js/quote.js"></script>

</body>
</html>
