// Importation de fonctions
import { getWorks } from "./script.js";
import { getCategories } from "./script.js";
import { displayWorks } from "./script.js";

// Constantes générales
const token = window.localStorage.getItem("token");
const modifyButton = document.getElementById("modify-button");
const modal = document.getElementById("modal");
const galleryModalElements = document.querySelectorAll(".gallery_modal");
const addWorkModalElements = document.querySelectorAll(".add-work_modal");
const backButton = document.getElementById("back-button");
const closeButton = document.getElementById("close-button");
const galleryElement = document.getElementById("gallery_element");
const addWorkForm = document.getElementById("add-work_form");
const addWorkElement = document.getElementById("add-work_element");
const addWorkButton = document.getElementById("work-upload_button");
const workPreviewElement = document.getElementById("work-preview_element");
const workTitleInput = document.getElementById("work-title");
const workCategorySelect = document.getElementById("work-category");
const addPictureButton = document.getElementById("add-picture_button");
const validateButton = document.getElementById("validate_button");

// Event listener sur le bouton "modifier"
modifyButton.addEventListener("click", () => {
    // Ouverture de la modale
    openModal();
});

// Event listener sur le bouton "fermer"
closeButton.addEventListener("click", () => {
    // Fermeture de la modale
    closeModal()
});

// Event listener pour clic en dehors de la modale
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Event listener sur le bouton de retour
backButton.addEventListener("click", () => {
    // Fermeture de la modale
    closeModal();
    // Ouverture de la modale
    openModal();
});

// Event listener sur le bouton "Ajouter une photo"
addPictureButton.addEventListener("click", () => {
    // Affichage de la modale "Ajout photo"
    displayAddWorkModal();
});

// Event listener sur le bouton d'upload de l'image pour afficher la prévisualisation
addWorkButton.addEventListener("change", displayWorkPreview);

// Event listeners sur les champs pour vérifier les changements
addPictureButton.addEventListener("change", checkFormCompletion);
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
    }
})

// Fonction de réinitialisation de la galerie
function resetGallery() {
    galleryElement.innerHTML = "";
}

// Fonction de réinitialisation du formulaire
function resetForm() {
    addWorkForm.reset();
}

// Fonction de réinitialisation de la prévisualisation
function resetPreview() {
    workPreviewElement.innerHTML = "";
}

// Fonction de réinitialisation des catégories
function resetCategories() {
    workCategorySelect.innerHTML = "";
}

// Fonction de réinitialisation du bouton "Valider"
function resetValidateButton() {
    validateButton.disabled = true;
    validateButton.classList.add("greyed");
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
    // Réinitialisation de la galerie
    resetGallery();
    // Réinitialisation du formulaire
    resetForm();
    // Réinitialisation de la preview
    resetPreview();
    // Réinitialisation des catégories
    resetCategories();
    // Réinitialisation du bouton "Valider"
    resetValidateButton();
    // Fermerture de la modale
    modal.close();
    // Affichage des travaux sur la page
    displayWorks();
}

// Fonction de mise en page de la modale "Galerie photo"
function displayGalleryModal() {
    // Masquage du bouton de retour
    backButton.style.visibility = "hidden";
    // Affichage des éléments de la modale "Galerie photo"
    galleryModalElements.forEach(function (galleryModalElement) {
        galleryModalElement.style.display = "block";
    });
    // Masquage des éléments de la modale "Ajout photo"
    addWorkModalElements.forEach(function (addWorkModalElement) {
        addWorkModalElement.style.display = "none";
    });
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
    // Boucle qui permet de générer les projets
    for (const work of works) {
        // Création de la balise <figure> dédiée à un projet
        const workElement = document.createElement("figure");
        // Création de la balise <img> pour la photo
        const workPicture = document.createElement("img");
        workPicture.classList.add("work-picture");
        workPicture.src = work.imageUrl;
        workPicture.alt = work.title;
        // Création de la balise <img> pour le bouton "supprimer"
        const deleteButton = document.createElement("img");
        deleteButton.id = work.id;
        deleteButton.classList.add("delete-button");
        deleteButton.src = "./assets/icons/trash.svg";
        deleteButton.alt = "icône de suppression de l'image";
        // Rattachement des balises aux parents
        galleryElement.appendChild(workElement);
        workElement.appendChild(workPicture);
        workElement.appendChild(deleteButton);
        // Event listener sur les boutons "supprimer un projet"
        deleteButton.addEventListener("click", async () => {
            // Fetch pour supression d'un projet
            const response = await fetch("http://localhost:5678/api/works/" + deleteButton.id, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            // Si la réponse de l'API est positive (projet supprimé)
            if (response.status === 204) {
                // Fermeture de la modale
                closeModal();
                // Ouverture de la modale
                openModal();
            }
        })
    }
}

// Fonction de mise en page de la modale "Ajout photo"
function displayAddWorkModal() {
    // Affichage du bouton de retour
    backButton.style.visibility = "visible";
    // Masquage des éléments de la modale "Galerie photo"
    galleryModalElements.forEach(function (galleryModalElement) {
        galleryModalElement.style.display = "none";
    });
    // Affichage des éléments de la modale "Ajout photo"
    addWorkModalElements.forEach(function (addWorkModalElement) {
        addWorkModalElement.style.display = "block";
    });
    // Masquage de la galerie
    galleryElement.style.display = "none";
    // Affichage du formulaire
    addWorkForm.style.display = "flex";
    // Affichage de la <div> d'upload
    addWorkElement.style.display = "flex";
    // Masquage de la <div> de preview
    workPreviewElement.style.display = "none";
    // Affichage des <option> de catégories
    displayWorkCategory();
}

// Fonction d'affichage des <option> de catégories pour le champs <select>
async function displayWorkCategory() {
    // Récupération de la constante "categories" par appel de la fonction "getCategories"
    const categories = await getCategories();
    // Création de l'option par défaut
    const defaultWorkCategoryOption = document.createElement("option");
    defaultWorkCategoryOption.value = "default";
    defaultWorkCategoryOption.innerText = "-- Sélectionnez une catégorie --"
    // Rattachement de la balise au parent
    workCategorySelect.appendChild(defaultWorkCategoryOption);
    // Boucle qui permet de générer les options de catégories
    for (const category of categories) {
        // Création de la balise <option>
        const workCategoryOption = document.createElement("option");
        workCategoryOption.value = category.id;
        workCategoryOption.innerText = category.name;
        // Rattachement de la balise au parent
        workCategorySelect.appendChild(workCategoryOption);
    }
}

// Fonction d'affichage de la prévisualisation de l'image sélectionnée
function displayWorkPreview() {
    // Masquage de la <div> d'upload
    addWorkElement.style.display = "none";
    // Affichage de la <div> de preview
    workPreviewElement.style.display = "flex";
    // Création de la balise <img> pour la preview
    const workPreview = document.createElement("img");
    // Récupération de l'image sélectionée en tant que source pour la balise <img>
    workPreview.src = URL.createObjectURL(addWorkButton.files[0]);
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