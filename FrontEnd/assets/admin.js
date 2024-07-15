// Fonction "mode Admin" qui s'active quand utilisateur connecté
function adminMode() {
    // Récupération du token éventuellement stocké dans le localStorage
    const token = window.localStorage.getItem("token");
    // Passage en "mode Admin" si token existant dans le localStorage
    if (token != null) {
        // Décalage du header pour le rendre visible malgré le bandeau du "mode Admin"
        document.querySelector("header").classList.add("admin-mode");
        // Affichage des éléments cachés du "mode Admin" (bandeau noir et bouton modifier")
        const adminElements = document.querySelectorAll(".admin-element");
        adminElements.forEach(function (adminElement) {
            adminElement.classList.remove("hidden");
        });
        // Masquage de la barre de filtres
        document.getElementById("filterbar").style.visibility = "hidden";
        // Changement du lien de la nav "login" en "logout"
        const logInOut = document.querySelectorAll("header a")[2];
        logInOut.innerText = "logout";
        logInOut.href = "#";
        // Event listener sur le lien "logout"
        logInOut.addEventListener("click", () => {
            // Suppression du token dans le localStorage
            window.localStorage.removeItem("token");
            // Redirection dur la page d'accueil
            window.location.href = "./index.html";
        })
    }
}
// Appel de la fonction "mode édition"
adminMode();
