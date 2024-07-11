// Event listener sur le bouton d'envoi du formulaire
const loginForm = document.querySelector("#login form");
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Création de l'objet "login" qui récupère les valeurs entrées dans les champs "email" et "password"
    const login = {
        email: event.target.querySelector("[name=login-email]").value,
        password: event.target.querySelector("[name=login-password]").value
    };
    // Création de la charge utile au format JSON
    const loginPayload = JSON.stringify(login);
    // Fonction fetch pour envoi du login à l'API
    async function postLogin() {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: loginPayload
        });
        return response;
    }
    // Récupération de la constante "response" par appel de la fonction "postLogin"
    const apiResponse = await postLogin();
    // Si la réponse de l'API est positive (email et mot de passe corrects)
    if (apiResponse.status === 200) {
        // Sérialisation de la réponse
        const responseBody = await apiResponse.json();
        // Stockage du token dans le localStorage
        window.localStorage.setItem("token", responseBody.token);
        // Redirection sur la page d'accueil
        window.location.href = "./index.html";
    } else { // Si la réponse de l'API est négative (email et/ou mot de passe incorrects)
        // Création de la balise <p> pour afficher le message d'erreur
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
        // Rattachement de la balise au parent
        document.getElementById("login").appendChild(errorMessage);
    }
});