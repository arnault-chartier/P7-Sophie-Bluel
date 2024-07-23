// Importation des fonctions getWorks et getCategories de script.js
import { getWorks } from "./script.js";
import { getCategories } from "./script.js";

// Constantes générales
const token = window.localStorage.getItem("token");
const modal = document.getElementById("modal");
const backButton = document.getElementById("back-button");
const modalHeaderTitle = document.getElementById("modal-header_title");
const modalBody = document.getElementById("modal-body");
const modalFooter = document.getElementById("modal-footer");
const modalFooterButton = document.getElementById("modal-footer_button");

// Fonction de réinitialisation de la modale
function resetModal() {
    backButton.style = "";
    modalHeaderTitle.innerText = "";
    modalBody.innerHTML = "";
    modalBody.className = "";
    modalFooter.className = "";
    modalFooterButton.className = "";
}

// Event listener sur le bouton "fermer"
const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", () => {
    modal.close();
    resetModal();
});

// Event listener pour fermeture modale si clic en dehors de la modale
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.close();
        resetModal();
    }
});

// Event listener sur le bouton "modifier"
const modifyButton = document.getElementById("modify-button");
modifyButton.addEventListener("click", () => {
    // Affichage de la modale
    modal.showModal();
    // Appel de la fonction de mise en page de la modale "Galerie photo"
    displayGalleryModal();

});

// Event listener sur le bouton de retour
backButton.addEventListener("click", () => {
    resetModal();
    displayGalleryModal();
})

// Fonction de mise en page de la modale "Galerie photo"
function displayGalleryModal() {
    // Ajout du titre
    modalHeaderTitle.innerText = "Galerie photo";
    // Application de la mise en page du body 
    modalBody.classList.add("modal-gallery");
    // Appel de la fonction d'affichage des projets
    displayModalWorks();
    // Ajout du bouton "Ajouter une photo"
    modalFooterButton.innerText = "Ajouter une photo";
    modalFooterButton.classList.add("add-picture_button");
}

// Fonction d'affichage des projets sur la modale "Galerie photo"
async function displayModalWorks() {
    // Récupération de la constante "works" par appel de la fonction "getWorks"
    const works = await getWorks();
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
        modalBody.appendChild(workElement);
        workElement.appendChild(workImage);
    }
}

// Event listener sur le bouton "Ajouter une photo"
modalFooterButton.addEventListener("click", () => {
    if (modalFooterButton.className === "add-picture_button") {
        // Appel de la fonction de mise en page de la modale "Ajout photo"
        displayAddWorkModal();
    }
});

// Fonction de mise en page de la modale "Ajout photo"
function displayAddWorkModal() {
    // Appel de la fonction de réinitialisation de la modale
    resetModal();
    // Affichage du bouton de retour
    backButton.style.visibility = "visible";
    // Ajout du titre
    modalHeaderTitle.innerText = "Ajout photo";
    // Ajout du body
    // Création du formulaire
    const addWorkForm = document.createElement("form");
    addWorkForm.action = "#";
    addWorkForm.method = "post";
    addWorkForm.classList.add("modal-form");
    // Création de la <div> d'upload d'image
    const addWorkElement = document.createElement("div");
    addWorkElement.classList.add("add-work_element");
    // Création de l'icône d'image
    const addWorkPicture = document.createElement("img");
    addWorkPicture.src = "./assets/icons/picture.svg";
    addWorkPicture.alt = "icône d'ajout d'une photo";
    // Création du <label> et du bouton d'upload (qui sera caché)
    const addworkLabel = document.createElement("label");
    addworkLabel.htmlFor = "work-upload_button";
    addworkLabel.innerText = "+ Ajouter photo";
    addworkLabel.id = "work-upload_label";
    const addWorkButton = document.createElement("input");
    addWorkButton.type = "file";
    addWorkButton.accept = ".jpg, .jpeg, .png"
    addWorkButton.name = "work-upload_button";
    addWorkButton.id = "work-upload_button";
    addWorkButton.required = true;
    addWorkButton.style = "display: none";
    // Création de la légende
    const addWorkCaption = document.createElement("p");
    addWorkCaption.innerText = "jpg, png : 4mo max";
    // Création du <label> et du champ "Titre"
    const workTitleLabel = document.createElement("label");
    workTitleLabel.htmlFor = "work-title";
    workTitleLabel.innerText = "Titre";
    const workTitleInput = document.createElement("input");
    workTitleInput.type = "text";
    workTitleInput.name = "work-title";
    workTitleInput.id = "work-title";
    workTitleInput.required = true;
    // Création du <label> et du champ <select> "Catégories"
    const workCategoryLabel = document.createElement("label");
    workCategoryLabel.htmlFor = "work-category";
    workCategoryLabel.innerText = "Catégorie";
    const workCategorySelect = document.createElement("select");
    workCategorySelect.name = "work-category";
    workCategorySelect.id = "work-category";
    // Affichage des <option> du champs <select> par appel de la fonction displayWorkCategory
    displayWorkCategory();
    // Rattachement des éléments aux parents
    modalBody.appendChild(addWorkForm);
    addWorkForm.appendChild(addWorkElement)
    addWorkElement.appendChild(addWorkPicture);
    addWorkElement.appendChild(addworkLabel);
    addWorkElement.appendChild(addWorkButton);
    addWorkElement.appendChild(addWorkCaption);
    addWorkForm.appendChild(workTitleLabel);
    addWorkForm.appendChild(workTitleInput);
    addWorkForm.appendChild(workCategoryLabel);
    addWorkForm.appendChild(workCategorySelect);
    // Ajout du bouton "Valider"
    modalFooterButton.innerText = "Valider";
    modalFooterButton.classList.add("greyed");

    // Fonction d'affichage des <option> de catégories pour le champs <select>
    async function displayWorkCategory() {
        // Récupération de la constante "categories" par appel de la fonction "getCategories"
        const categories = await getCategories();
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

    // Event listener sur le bouton d'upload de l'image pour afficher la prévisualisation
    addWorkButton.addEventListener("change", displayWorkPreview);

    // Fonction d'affichage de la prévisualisation de l'image sélectionnée
    function displayWorkPreview() {
        // Récupération de la <div> d'upload d'image
        const workPreviewElement = document.querySelector(".add-work_element");
        // Changement de classe de la <div>
        workPreviewElement.classList.replace("add-work_element", "work-preview_element");
        // Effaçage du contenu de la <div>
        workPreviewElement.innerHTML = "";
        // Création de la balise <img> pour la preview
        const workPreview = document.createElement("img");
        // Récupération de l'image sélectionée en tant que source pour la balise <img>
        workPreview.src = URL.createObjectURL(addWorkButton.files[0]);
        // Rattachement de l'élement au parent
        workPreviewElement.appendChild(workPreview);
    }

    // Event listener sur le bouton "Valider" pour envoi du formulaire à l'API
    modalFooterButton.addEventListener("click", async () => {
        const formData = new FormData();
        formData.append("image", addWorkButton.files[0]);
        formData.append("title", workTitleInput.value);
        formData.append("category", workCategorySelect.value);
        await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
        });
    })
}