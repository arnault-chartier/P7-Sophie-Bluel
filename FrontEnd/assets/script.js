// Fonction  de suppression des projets affichés
function deleteWorks() {
    document.querySelector(".gallery").innerHTML = "";
}

// Fonction de récupération des projets depuis l'API
export async function getWorks() {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const works = await worksResponse.json();
    return works;
}

// Fonction d'affichage des projets récupérés depuis l'API
async function displayWorks() {
    // Récupération de la constante "works" par appel de la fonction "getWorks"
    const works = await getWorks();
    // Récupération de l'élément du DOM qui affichera les projets
    const gallery = document.querySelector(".gallery");
    // Appel de la fonction de suppression des projets affichés
    deleteWorks();
    // Boucle qui permet de générer les projets
    for await (const work of works) {
        // Création de la balise <figure> dédiée à un projet
        const workElement = document.createElement("figure");
        workElement.id = work.id;
        workElement.dataset.categoryId = work.categoryId;
        // Création des balises <img> et <figcaption>
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        const workName = document.createElement("figcaption");
        workName.innerText = work.title;
        // Rattachement des balises aux parents
        gallery.appendChild(workElement);
        workElement.appendChild(workImage);
        workElement.appendChild(workName);
    }
}
// Appel de la fonction d'affichage des projets
displayWorks();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction de récupération des catégories depuis l'API
export async function getCategories() {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesResponse.json();
    return categories;
}

// Fonction d'affichage des boutons de filtres selon catégories récupérées depuis l'API
async function displayFilterButtons() {
    // Récupération de la constante "categories" par appel de la fonction "getCategories"
    const categories = await getCategories();
    // Récupération de l'élément du DOM qui affichera la barre de filtres (boutons)
    const filterbar = document.getElementById("filterbar");
    // Bouton "Tous" (toutes les catégories)
    // Création de la balise <button> "Tous"
    const categoriesElement = document.createElement("button");
    categoriesElement.classList.add("filterbar-button");
    categoriesElement.type = "button";
    categoriesElement.innerText = "Tous";
    // Highlight sur le bouton "Tous"
    categoriesElement.classList.add("highlight");
    // Rattachement de la balise au parent
    filterbar.appendChild(categoriesElement);
    // Event listener sur le bouton "Tous"
    categoriesElement.addEventListener("click", () => {
        // Récupération de tous les projets
        const works = document.querySelectorAll(".gallery figure");
        // Affichage de tous les projets
        works.forEach(function (work) {
            work.style.display = "block";
        })
        // Changement du highlight sur le bouton
        document.querySelector(".highlight").classList.remove("highlight");
        categoriesElement.classList.add("highlight");
    })
    // Boutons de filtres (par catégorie)
    // Boucle qui permet de générer les boutons de filtres
    for await (const category of categories) {
        // Création de la balise <button> de filtre
        const categoryElement = document.createElement("button");
        categoryElement.classList.add("filterbar-button");
        categoryElement.type = "button";
        categoryElement.innerText = category.name;
        // Rattachement de la balise au parent
        filterbar.appendChild(categoryElement);
        // Event listener sur le bouton de filtre
        categoryElement.addEventListener("click", () => {
            // Récupération de tous les projets
            const works = document.querySelectorAll(".gallery figure");
            // Affichage des projets correspondant au filtre
            works.forEach(function (work) {
                // Affichage de tous les projets d'abord
                work.style.display = "block";
                // Puis non-affichage des projets ne correspondant pas au filtre
                if (work.dataset.categoryId != category.id) {
                    work.style.display = "none"
                }
            })
            // Changement du highlight sur le bouton
            document.querySelector(".highlight").classList.remove("highlight");
            categoryElement.classList.add("highlight");
        })
    }
}
// Appel de la fonction d'affichage des boutons de filtres
displayFilterButtons();