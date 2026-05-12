/* =========================
   R.A.Y.B — APPS SCRIPT
   Commandes + Avis + Mails
========================= */

const ADMIN_EMAIL = "contact@rayb.fr";
const TECH_EMAIL = "nur.commerce120@gmail.com";
const FROM_ALIAS = "contact@rayb.fr";
const BRAND_NAME = "R.A.Y.B";

// Mets l'ID de ton Google Sheet ici si l'onglet "Avis site" ne se crée pas.
// L'ID est dans l'URL du Sheet, entre /d/ et /edit
const SPREADSHEET_ID = "14LUkAefh3PKA8ysjofg_lkdUvrv7pJ19Rd_qCnKX828";

function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  try {
    const data = e.parameter || {};

    // IMPORTANT :
    // Si le formulaire contient note/commentaire/produitId, on traite comme AVIS.
    // Sinon, on traite comme COMMANDE.
    const isAvis =
      data.type === "avis" ||
     data.action === "avis" ||
     data.note ||
     data.commentaire ||
     data.avis ||
     data.produitId ||
     data.produit_id ||
     data.produit_nom;

    if (isAvis) {
      return handleAvis_(data);
    }

    return handleCommande_(data);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: String(err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* =========================
   COMMANDES
========================= */

function handleCommande_(data) {
  const ss = getSpreadsheet_();
  const sheet = getOrCreateSheet_(ss, "Commandes", [
    "Date",
    "Référence",
    "Nom",
    "Email",
    "Téléphone",
    "Adresse",
    "Ville",
    "Code postal",
    "Produit(s)",
    "Option(s)",
    "Prix",
    "Statut paiement",
    "Mode paiement",
    "Statut livraison",
    "N° suivi",
    "Notes"
  ]);

  const now = new Date();

  const ref = data.reference_commande || data.reference || "Sans référence";
  const nom = data.nom || "";
  const email = data.email || "";
  const telephone = data.telephone || "";
  const adresse = data.adresse || "";
  const ville = data.ville || "";
  const postal = data.code_postal || "";
  const produit = data.produit || "";
  const option = data.taille || data.option || "";
  const prix = data.prix || "";

  sheet.appendRow([
    now,
    ref,
    nom,
    email,
    telephone,
    adresse,
    ville,
    postal,
    produit,
    option,
    prix,
    "En attente",
    "",
    "Commande reçue",
    "",
    ""
  ]);

  const sujet = "Nous avons bien reçu votre commande – R.A.Y.B";

  const recapClient =
`Bonjour ${nom || ""},

Nous avons bien reçu votre commande.

Récapitulatif de votre commande :
Référence : ${ref}
Produit(s) : ${produit}
Option(s) : ${option}
Total : ${prix} €

Informations de livraison :
Nom : ${nom}
Adresse : ${adresse}
Ville : ${ville}
Code postal : ${postal}
Téléphone : ${telephone}

Nous reviendrons vers vous dès que votre commande avancera.

Merci pour votre confiance.

R.A.Y.B
contact@rayb.fr`;

  const recapAdmin =
`Nouvelle commande reçue sur R.A.Y.B.

Récapitulatif :
Référence : ${ref}
Nom : ${nom}
Email : ${email}
Téléphone : ${telephone}

Adresse :
${adresse}
${postal} ${ville}

Produit(s) :
${produit}

Option(s) :
${option}

Total :
${prix} €

Statut : Commande reçue`;

  // Mail client
  if (email) {
    sendRaybMail_(email, sujet, recapClient);
  }

  // Mail pour toi
  sendRaybMail_(ADMIN_EMAIL, sujet, recapAdmin);

  // Copie Gmail technique
  if (TECH_EMAIL && TECH_EMAIL !== ADMIN_EMAIL) {
    sendRaybMail_(TECH_EMAIL, sujet, recapAdmin);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, type: "commande" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =========================
   AVIS CLIENTS
========================= */

function handleAvis_(data) {
  const ss = getSpreadsheet_();
  const sheet = getOrCreateSheet_(ss, "Avis site", [
    "Date",
    "Produit ID",
    "Produit",
    "Nom",
    "Email",
    "Note",
    "Commentaire",
    "Statut"
  ]);

  const now = new Date();

  const produitId = data.produitId || data.produit_id || data.productId || "";
  const produit = data.produit || data.produit_nom || data.productName || data.nom_produit || "";
  const nom = data.nom || data.name || "";
  const email = data.email || "";
  const note = data.note || "";
  const commentaire = data.commentaire || data.message || data.avis || "";

  sheet.appendRow([
    now,
    produitId,
    produit,
    nom,
    email,
    note,
    commentaire,
    "À valider"
  ]);

  const etoiles = stars_(note);

  const sujetClient = "Merci pour votre commentaire – R.A.Y.B";
  const messageClient =
`Bonjour ${nom || ""},

Merci pour votre commentaire.

Nous avons bien reçu votre avis.

Récapitulatif de votre avis :
Produit : ${produit || produitId || "-"}
Note : ${etoiles}
Commentaire :
${commentaire}

Votre avis sera vérifié avant d'être publié sur le site.

Merci pour votre soutien.

R.A.Y.B
contact@rayb.fr`;

  const sujetAdmin = "Nouvel avis client R.A.Y.B";
  const messageAdmin =
`Nouvel avis reçu sur R.A.Y.B.

Produit : ${produit || produitId || "-"}
Produit ID : ${produitId || "-"}
Nom : ${nom}
Email : ${email}
Note : ${etoiles}

Commentaire :
${commentaire}

Statut : À valider

Pour publier l'avis, ajoute-le ensuite dans avis.js.`;

  if (email) {
    sendRaybMail_(email, sujetClient, messageClient);
  }

  sendRaybMail_(ADMIN_EMAIL, sujetAdmin, messageAdmin);

  if (TECH_EMAIL && TECH_EMAIL !== ADMIN_EMAIL) {
    sendRaybMail_(TECH_EMAIL, sujetAdmin, messageAdmin);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, type: "avis" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =========================
   OUTILS
========================= */

function getOrCreateSheet_(ss, name, headers) {
  if (!ss) {
    throw new Error("Aucun Google Sheet trouvé. Mets l'ID du Google Sheet dans SPREADSHEET_ID.");
  }

  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function stars_(note) {
  const n = Math.max(0, Math.min(5, Number(note || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function sendRaybMail_(to, subject, body) {
  try {
    GmailApp.sendEmail(to, subject, body, {
      from: FROM_ALIAS,
      name: BRAND_NAME,
      replyTo: ADMIN_EMAIL
    });
  } catch (err) {
    // Si l'alias bloque, ça envoie quand même le mail avec le Gmail principal.
    GmailApp.sendEmail(to, subject, body, {
      name: BRAND_NAME,
      replyTo: ADMIN_EMAIL
    });
  }
}