R.A.Y.B — installation de la mise à jour

1) Remplace les fichiers de ton dépôt GitHub par ceux de ce dossier.

Fichiers importants modifiés :
- style.css : présentation du footer, vraies icônes Instagram/TikTok, section Prochainement, message avis envoyé.
- catalogue.html : ajout des cases Prochainement en bas du catalogue.
- avis.html : le formulaire d'avis envoie maintenant vers Apps Script, pas vers FormSubmit.
- apps-script.gs : envoie aussi les mails internes vers nur.commerce120@gmail.com + gère les avis clients.
- images/social-instagram.png et images/social-tiktok.png : vraies icônes à mettre dans le dossier images.

2) Pour les mails admin que tu ne recevais plus :
Le script envoie maintenant la notification interne à :
- contact@rayb.fr
- nur.commerce120@gmail.com

Le client continue à voir R.A.Y.B/contact@rayb.fr si ton alias Gmail est bien configuré.

3) Pour que les avis fonctionnent :
- Ouvre ton projet Google Apps Script.
- Remplace le contenu de apps-script.gs par le nouveau fichier.
- Clique sur Déployer > Gérer les déploiements > Modifier > Nouvelle version > Déployer.
- L'URL du formulaire avis.html utilise déjà l'URL actuelle de ton script.

Quand un client laisse un avis, tu reçois un mail.
Pour le publier sur le site, ouvre avis.js et ajoute l'avis dans le tableau AVIS_CLIENTS.
Exemple :
const AVIS_CLIENTS = [
  { nom: "Amine", note: 5, texte: "Produit reçu rapidement, qualité propre." },
];

4) Pour le stock :
Le fichier apps-script.gs garde le système de baisse du stock à chaque commande.
Si tu modifies Apps Script, pense toujours à redéployer une nouvelle version.
