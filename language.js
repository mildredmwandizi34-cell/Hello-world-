const translations = {

    en: {
        mainTitle: "American Global Logistics",
        heroSubtitle: "Reliable Logistics Solutions Across the Globe"
    },

    es: {
        mainTitle: "Logística Global Americana",
        heroSubtitle: "Soluciones logísticas confiables en todo el mundo"
    },

    fr: {
        mainTitle: "Logistique Mondiale Américaine",
        heroSubtitle: "Des solutions logistiques fiables dans le monde entier"
    }

};

function changeLanguage(){

    const lang = document.getElementById("languageSelect").value;

    document.getElementById("mainTitle").textContent =
        translations[lang].mainTitle;

    document.getElementById("heroSubtitle").textContent =
        translations[lang].heroSubtitle;

    localStorage.setItem("language", lang);

}

window.onload = function(){

    const savedLanguage =
        localStorage.getItem("language") || "en";

    document.getElementById("languageSelect").value =
        savedLanguage;

    changeLanguage();

};
