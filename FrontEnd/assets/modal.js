// Importation de la fonction getWorks de script.js
import { getWorks } from "./script.js";

// Event listener sur le bouton "modifier" pour apparition de la modale "modifier"
const modifyModal = document.getElementById("modify-modal");
const modifyButton = document.querySelector(".modify-button");
modifyButton.addEventListener("click", () => {
    modifyModal.showModal();
});

// Fonction d'affichage des projets sur la modale "modifier"
async function displayModalWorks() {
    // Récupération de la constante "works" par appel de la fonction "getWorks"
    const works = await getWorks();
    // Récupération de l'élément du DOM qui affichera les projets
    const modalGallery = document.getElementById("modal-gallery");
    // Boucle qui permet de générer les projets
    for (const work of works) {
        // Création de la balise <figure> dédiée à un projet
        const workElement = document.createElement("figure");
        workElement.id = work.id;
        // Création de la balise <img>
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        // Rattachement des balises aux parents
        modalGallery.appendChild(workElement);
        workElement.appendChild(workImage);
    }
}
// Appel de la fonction d'affichage des projets sur la modale "modifier"
displayModalWorks();

// Event listener sur le bouton "fermer"
const anyModal = document.querySelector("dialog");
const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", () => {
    anyModal.close();
});

// Event listener pour fermeture modale si clic en dehors de la modale
anyModal.addEventListener("click", function (event) {
    if (event.target === anyModal) {
        anyModal.close();
    }
});