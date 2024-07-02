// Récupération des projets depuis l'API
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const works = await worksResponse.json();

// Fonction  de suppression des projets existants du HTML
function deleteHTMLWorks() {
    document.querySelector(".gallery").innerHTML = "";
}

// Fonction d'affichage des projets récupérés depuis l'API
function displayWorks() {
    // Appel de la fonction de suppression des projets HTML
    deleteHTMLWorks();
    // Boucle qui permet de générer les projets
    for (let worksObject = 0; worksObject < works.length; worksObject++) {
        const work = works[worksObject];
        // Récupération de l'élément du DOM qui affichera les projets
        const gallerySection = document.querySelector(".gallery");
        // Création de la balise figure dédiée à un projet
        const workElement = document.createElement("figure");
        workElement.id = work.id;
        // Création des balises img et figcaption
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        const workName = document.createElement("figcaption");
        workName.innerText = work.title;
        // Rattachement des balises
        gallerySection.appendChild(workElement);
        workElement.appendChild(workImage);
        workElement.appendChild(workName);
    }
}

// Appel de la fonction d'affichage des projets
displayWorks()