CORRECTION AVIS R.A.Y.B

Fichiers à remplacer sur GitHub :
- style.css
- produit.html
- avis.html
- apps-script.gs

Ce qui change :
1. Les notes des avis se choisissent avec de vraies étoiles cliquables.
2. Les mails d'avis ne disent plus "Nouvelle commande reçue".
   - Le client reçoit : "Merci pour votre commentaire – R.A.Y.B"
   - Le mail contient le produit, les étoiles et le commentaire écrit.
3. L'onglet Google Sheets "Avis site" est créé automatiquement si le script est bien relié à ton Google Sheet.

IMPORTANT POUR GOOGLE SHEETS :
Si l'onglet "Avis site" ne se crée toujours pas, ouvre apps-script.gs et colle l'ID de ton Google Sheet ici :

const SPREADSHEET_ID = "";

L'ID est dans l'URL de ton Google Sheet :
https://docs.google.com/spreadsheets/d/ICI_CEST_L_ID/edit

Après modification de apps-script.gs :
Apps Script > Déployer > Gérer les déploiements > Modifier > Nouvelle version > Déployer.

Puis garde le même lien /exec dans :
- paiement.html
- produit.html
- avis.html

Si tu ne redéploies pas une nouvelle version, ton site continuera d'utiliser l'ancien code.
