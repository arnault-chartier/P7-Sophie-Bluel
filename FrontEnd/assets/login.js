// Event listener sur le bouton d'envoi du formulaire
const loginForm = document.querySelector("#login form");
loginForm.addEventListener("submit", async function (loginFormSubmit) {
    loginFormSubmit.preventDefault();
    // Création de l'objet "login" qui récupère les valeurs entrées dans les champs "email" et "password"
    const login = {
        email: loginFormSubmit.target.querySelector("[name=login_email]").value,
        password: loginFormSubmit.target.querySelector("[name=login_password]").value
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
        const responseBody = response.json();
        return responseBody;
    }
    // Récupération de la constante "responseBody" par appel de la fonction "postLogin"
    const responseBody = await postLogin();
    // Si la réponse de l'API est positive (email et mot de passe corrects)
    if (responseBody.userId === 1) {
        // Stockage du token dans le localStorage
        window.localStorage.setItem("token", responseBody.token);
        // Redirection sur la page d'accueil
        window.location.href = "./index.html";
    } else { // Si la réponse de l'API est négative (email et/ou mot de passe incorrects)
        alert("L'email et/ou le mot de passe est incorrect.")
    }
});