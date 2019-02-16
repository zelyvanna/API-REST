// Importation des modules externes
const express = require("express"); // Module JS permettant de créer des endpoints HTTP facilement
const bodyParser = require("body-parser"); // Module JS permettant de tranformer les paramètres en JSON
const auth = require("./auth"); // Module JS permettant d'utiliser l'authentification
/*
  Paramètrage d'Express. Pas besoin de toucher.
  ------------------------------------------------
*/
// Paramètrage de Express
const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    next();
});

// On demande a Express d'utiliser notre module d'authentification
app.use(auth);


/*
  ------------------------------------------------
*/

/*
  Déclaration des données
*/
const data = {
    items: [
        {
            title: "Item de l'index 0",
            content: "Je suis un contenu",
        }, {

            title: "Item de l'index 1",
            content: "Je suis un contenu",
        }, {

            title: "Item de l'index 2",
            content: "Je suis un contenu",
        }, {

            title: "Item de l'index 3",
            content: "Je suis un contenu",
        }, {

            title: "Item de l'index 4",
            content: "Je suis un contenu",
        }, {

            title: "Item de l'index 5",
            content: "Je suis un contenu",
        },
    ],
};

/*
  Déclaration des endpoints (également appelés *routes*)

  req: Contient toutes les données de la requête reçue: headers, paramètres GET, paramètres POST etc..
  res: Contient des fonctions permettant de répondre à la requête

  Obtenir les paramètres GET: req.query
  Obtenir les paramètres POST: req.body
  Obtenir les "paramètres" dans l'URL: req.params
  Répondre un message text: res.send("Okay, bien reçu")
  Répondre avec un object jSON: res.json({message: "Okay, bien reçu"})
*/
// Lorsqu'on reçoit une requête GET
// Exemple: curl localhost:8080/?index=5
// Requete pour Tester : curl -X GET -H secret:7cTcjNyVJyudBqfE localhost:8080/?index=5
// DONE: Retourner l'item correspondant à l'index envoyé dans la requête
app.get("/", (req, res) => {
    const paramsGet = req.query; // {index: "5"} on récupère les paramères GET
    console.log({paramsGet}); // Affichage dans les logs du paramsGet
    const text = data.items[paramsGet.index]; // On enregistre l'index de la requete dans une variable texte
    res.send(text); // On répond à la requête avec la variable texte qui correspond à l'index de notre requete
});

// Lorsqu'on reçoit une requête POST
// Requete pour Tester : curl -X POST -H secret:7cTcjNyVJyudBqfE Content-Type:application/json localhost:8080 -d '{"title":"Mon titre"}'
// Exemple: curl -X POST -H "Content-Type: application/json" localhost:8080 -d '{"title":"Mon titre"}'
// DONE: Sauvegarder l'item reçu dans le tableau des items
app.post("/", (req, res) => {
    const paramsPost = req.body; // {title: "Mon titre"}  on récupère les paramères POST
    console.log({paramsPost}); // Affichage dans les logs du paramsPost
    // Enregistrement avec la méthode push dans le tableau data.item
    // Cette méthode va créer un nouvelle entrée dans le tableau data.item
    // Cette nouvelle entrée se trouve au dernier index + 1
    // Pour tester : curl -X GET -H secret:7cTcjNyVJyudBqfE localhost:8080/?index=6
    data.items.push(paramsPost);
    res.json(paramsPost);
});

// Lorsqu'on reçoit une requête DELETE
// Exemple: curl -X DELETE localhost:8080/6
// Pour tester : curl -X DELETE -H secret:7cTcjNyVJyudBqfE localhost:8080/6
// DONE: Supprimer l'item correspondant à l'index envoyé en paramètre d'URL
app.delete("/:number", (req, res) => {
    const paramsURL = req.params; //  {number: "6"}
    console.log({paramsURL});
    //La méthode SPLICE permet de supprimer x éléments dans un array js
    // On lui passe en parametre l'index de l'élément à supprimer (paramsURL) et le nombre d'élément à supprimer (1)
    data.items.splice(paramsURL, 1);
    res.json(paramsURL);
});

// Lorsqu'on reçoit une requête PUT
// Exemple: curl -X PUT -H "Content-Type: application/json" localhost:8080/?index=2 -d '{"newTitle":"Mon nouveau titre"}'
// Pour tester : curl -X PUT -H secret:7cTcjNyVJyudBqfE Content-Type:application/json localhost:8080/?index=2 -d '{"newTitle":"Mon nouveau titre"}'
// done: Modifier l'item correspondant à l'index reçu en paramètre GET avec les données reçues en paramètre POST
app.put("/", (req, res) => {
    const paramsGet = req.query; // {index: 2}
    const paramsPost = req.body; // {newTitle: "Mon nouveau titre"}
    console.log({paramsPost});
    // Ajout dans les logs des parametres get
    console.log({paramsGet});

    // Changement de la valeur attribuée a l'attribu title de notre enregistrement à l'index paramsGet.index dans notre tableau data.items
    data.items[paramsGet.index].title = paramsPost;
    res.json(paramsPost);
});

/*
  Lancement du serveur sur le port 8080
*/
app.listen(8080, () => console.log(`Listen on port 8080`));
