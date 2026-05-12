MISE À JOUR — Avis directement sur la page produit

Fichiers à remplacer sur GitHub :
- produit.html
- avis.js
- style.css

Fichier à remplacer dans Google Apps Script :
- apps-script.gs

IMPORTANT — Après avoir remplacé apps-script.gs :
1. Ouvre Google Apps Script.
2. Clique sur Déployer > Gérer les déploiements.
3. Clique sur modifier.
4. Choisis Nouvelle version.
5. Clique sur Déployer.
6. Garde le même lien /exec si Google ne le change pas.

Ce qui change :
- Sur chaque page produit, il y a maintenant un espace "Avis clients".
- Le client peut laisser un avis directement sur la page produit.
- L'avis est envoyé vers Apps Script.
- Apps Script crée/remplit un onglet Google Sheets appelé "Avis site".
- Tu peux donc retrouver les avis dans Google Sheets même si tu ne reçois pas le mail.

Comment publier un avis sur le site :
1. Va dans ton Google Sheet.
2. Ouvre l'onglet "Avis site".
3. Vérifie l'avis.
4. Copie-le dans avis.js comme ça :

const AVIS_CLIENTS = [
  { produitId: "veste-violette", nom: "Mohamed", note: 5, texte: "Très bonne qualité, je recommande." },
];

Les ids produits possibles :
- veste-noire
- veste-grise
- veste-violette
- pantalon-noir
- pantalon-gris
- pantalon-violet
- tapis-bordeaux

Pourquoi les avis ne se publient pas automatiquement ?
Sans vrai back-end sécurisé, publier automatiquement tous les avis permettrait à n'importe qui d'afficher n'importe quoi sur ton site. La solution propre est : le client envoie son avis, tu vérifies, puis tu le publies dans avis.js.
