// Importation de fonctions
import { getWorks, getCategories, displayWorks } from "./script.js";

// Constantes générales
const token = window.localStorage.getItem("token");
const modal = document.getElementById("modal");
const galleryModalElements = document.querySelectorAll(".gallery_modal");
const addWorkModalElements = document.querySelectorAll(".add-work_modal");
const galleryElement = document.getElementById("gallery_element");
const addWorkForm = document.getElementById("add-work_form");
const addWorkButton = document.getElementById("work-upload_button");
const workPreviewElement = document.getElementById("work-preview_element");
const workTitleInput = document.getElementById("work-title");
const workCategorySelect = document.getElementById("work-category");
const validateButton = document.getElementById("validate_button");
const errorMessage = document.getElementById("error-message");

// Event listener sur le bouton "modifier"
document.getElementById("modify-button").addEventListener("click", openModal);

// Event listener sur le bouton "fermer"
document.getElementById("close-button").addEventListener("click", closeModal);

// Event listener pour clic en dehors de la modale
modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
});

// Event listener sur le bouton de retour
document.getElementById("back-button").addEventListener("click", () => {
    closeModal();
    openModal();
});

// Event listener sur le bouton "Ajouter une photo"
document.getElementById("add-picture_button").addEventListener("click", displayAddWorkModal);

// Event listener sur le bouton d'upload de l'image pour afficher la prévisualisation
addWorkButton.addEventListener("change", displayWorkPreview);

// Event listeners sur les champs pour vérifier les changements
addWorkButton.addEventListener("change", checkFormCompletion);
workTitleInput.addEventListener("input", checkFormCompletion);
workCategorySelect.addEventListener("change", checkFormCompletion);

// Event listener sur le bouton "Valider" pour envoi du formulaire à l'API
validateButton.addEventListener("click", async () => {
    const formData = new FormData();
    formData.append("image", addWorkButton.files[0]);
    formData.append("title", workTitleInput.value);
    formData.append("category", workCategorySelect.value);

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
    });

    // Si la réponse de l'API est positive (projet créé)
    if (response.status === 201) {
        closeModal();
    } else { // Sinon message d'erreur dans les autres cas
        errorMessage.style.display = "block";
    }
})

// Fonction de réinitialisation des éléments de la modale
function resetModalElements() {
    // Réinitialisation de la galerie
    galleryElement.innerHTML = "";
    // Réinitialisation du formulaire
    addWorkForm.reset();
    // Réinitialisation de la prévisualisation
    workPreviewElement.innerHTML = "";
    // Réinitialisation des catégories
    workCategorySelect.innerHTML = "";
    // Réinitialisation du bouton "Valider"
    validateButton.disabled = true;
    validateButton.classList.add("greyed");
    // Réinitialisation du message d'erreur
    errorMessage.style.display = "none";
}

// Fonction d'ouverture de la modale
function openModal() {
    // Ouverture de la modale
    modal.showModal();
    // Affichage de la modale "Galerie photo"
    displayGalleryModal();
}

// Fonction de fermeture de la modale
function closeModal() {
    // Réinitialisation des éléments de la modale
    resetModalElements();
    // Fermerture de la modale
    modal.close();
    // Affichage des travaux sur la page
    displayWorks();
}

// Fonction de mise en page de la modale "Galerie photo"
function displayGalleryModal() {
    // Masquage du bouton de retour
    document.getElementById("back-button").style.visibility = "hidden";
    // Affichage des éléments de la modale "Galerie photo"
    galleryModalElements.forEach(element => element.style.display = "block");
    // Masquage des éléments de la modale "Ajout photo"
    addWorkModalElements.forEach(element => element.style.display = "none");
    // Affichage de la galerie
    galleryElement.style.display = "grid";
    // Masquage du formulaire
    addWorkForm.style.display = "none";
    // Appel de la fonction d'affichage des projets
    displayModalWorks();
}

// Fonction d'affichage des projets sur la modale "Galerie photo"
async function displayModalWorks() {
    // Récupération de la constante "works" par appel de la fonction "getWorks"
    const works = await getWorks();
    // Initialisation de la chaîne HTML pour les projets
    let worksHTML = "";
    // Boucle qui permet de générer les projets
    for (const work of works) {
        // Insertion et concaténation de la chaîne HTML pour chaque itération
        worksHTML += `
            <figure>
                <img class="work-picture" src="${work.imageUrl}" alt="${work.title}">
                <img id="${work.id}" class="delete-button" src="./assets/icons/trash.svg" alt="icône de suppression de l'image">
            </figure>
        `;
    }
    // Injection du contenu HTML généré dans la galerie
    galleryElement.innerHTML = worksHTML;

    // Event listener sur les boutons "supprimer un projet"
    galleryElement.querySelectorAll('.delete-button').forEach(deleteButton => {
        deleteButton.addEventListener("click", async () => {
            // Fetch pour supression d'un projet
            const response = await fetch(`http://localhost:5678/api/works/${deleteButton.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            // Si la réponse de l'API est positive (projet supprimé)
            if (response.status === 204) {
                // Fermeture de la modale
                closeModal();
                // Ouverture de la modale
                openModal();
            } else { // Sinon message d'erreur dans les autres cas
                errorMessage.style.display = "block";
            }
        });
    });
}

// Fonction de mise en page de la modale "Ajout photo"
function displayAddWorkModal() {
    // Affichage du bouton de retour
    document.getElementById("back-button").style.visibility = "visible";
    // Masquage des éléments de la modale "Galerie photo"
    galleryModalElements.forEach(element => element.style.display = "none");
    // Affichage des éléments de la modale "Ajout photo"
    addWorkModalElements.forEach(element => element.style.display = "block");
    // Masquage de la galerie
    galleryElement.style.display = "none";
    // Affichage du formulaire
    addWorkForm.style.display = "flex";
    // Affichage de la <div> d'upload
    document.getElementById("add-work_element").style.display = "flex";
    // Masquage de la <div> de preview
    workPreviewElement.style.display = "none";
    // Affichage des <option> de catégories
    displayWorkCategory();
}

// Fonction d'affichage des <option> de catégories pour le champs <select>
async function displayWorkCategory() {
    // Récupération de la constante "categories" par appel de la fonction "getCategories"
    const categories = await getCategories();
    // Initialisation de la chaîne HTML pour les options, avec option par défaut 
    let optionsHTML = '<option value="default">-- Sélectionnez une catégorie --</option>';
    // Boucle qui permet de générer les options de catégories
    for (const category of categories) {
        // Insertion et concaténation de la chaîne HTML pour chaque itération
        optionsHTML += `<option value="${category.id}">${category.name}</option>`;
    }
    // Injection du contenu HTML généré dans le select
    workCategorySelect.innerHTML = optionsHTML;
}

// Fonction d'affichage de la prévisualisation de l'image sélectionnée
function displayWorkPreview() {
    // Masquage de la <div> d'upload
    document.getElementById("add-work_element").style.display = "none";
    // Affichage de la <div> de preview
    workPreviewElement.style.display = "flex";
    // Création de la balise <img> pour la preview
    const workPreview = document.createElement("img");
    // Récupération de l'image sélectionnée en tant que source pour la balise <img>
    workPreview.src = URL.createObjectURL(addWorkButton.files[0]);
    // Réinitialisation de l'ancienne preview si elle existe
    workPreviewElement.innerHTML = "";
    // Rattachement de l'élement au parent
    workPreviewElement.appendChild(workPreview);
}

// Fonction d'activation/désactivation du bouton "Valider"
function checkFormCompletion() {
    // Vérifie si les trois champs sont remplis
    if (addWorkButton.files.length > 0 && workTitleInput.value.trim() !== "" && workCategorySelect.value !== "default") {
        // Active le bouton
        validateButton.disabled = false;
        validateButton.classList.remove("greyed");
    } else {
        // Désactive le bouton
        validateButton.disabled = true;
        validateButton.classList.add("greyed");
    }
}