/* ══════════════════════════════════════════════
   ANNONCES R.A.Y.B — annonces.js
   Modifie le tableau ANNONCES pour ajouter
   ou supprimer des annonces sur tout le site.
   Format : { icon, name, text, date }
══════════════════════════════════════════════ */
const ANNONCES = [
  // Exemples — décommente ou modifie :
  // { icon:"🔥", name:"R.A.Y.B", text:"Nouvelle collection disponible maintenant !", date:"10 mai 2026" },
  // { icon:"📦", name:"Livraison", text:"Expéditions reprises à partir du 12 mai.", date:"9 mai 2026" },
];

function initAnnonces() {
  const bar       = document.getElementById("annBar");
  const textEl    = document.getElementById("annTextCenter");
  const badgeEl   = document.getElementById("annCountBadge");
  const panel     = document.getElementById("annPanel");
  const overlay   = document.getElementById("annOverlay");
  const listEl    = document.getElementById("annPanelList");

  if (!bar) return;

  // Texte central
  if (textEl) {
    if (ANNONCES.length === 0) {
      textEl.textContent = "Aucune annonce pour le moment.";
      textEl.classList.add("empty");
    } else {
      // Afficher la dernière annonce en rotation
      let idx = 0;
      function showNext() {
        textEl.classList.remove("empty");
        textEl.textContent = ANNONCES[idx].text;
        idx = (idx + 1) % ANNONCES.length;
      }
      showNext();
      if (ANNONCES.length > 1) setInterval(showNext, 4000);
    }
  }

  // Badge compteur
  if (badgeEl) {
    badgeEl.textContent = ANNONCES.length;
    badgeEl.style.display = ANNONCES.length > 0 ? "flex" : "none";
  }

  // Panneau historique
  if (listEl) {
    if (ANNONCES.length === 0) {
      listEl.innerHTML = '<p class="ann-panel-empty">Aucune annonce pour le moment.</p>';
    } else {
      listEl.innerHTML = ANNONCES.map(a => `
        <div class="ann-panel-item">
          <div class="ann-panel-item-header">
            <span class="ann-panel-item-name">${a.icon} ${a.name}</span>
            <span class="ann-panel-item-date">${a.date || ""}</span>
          </div>
          <div class="ann-panel-item-text">${a.text}</div>
        </div>
      `).join("");
    }
  }

  // Ouvrir/fermer panneau
  const iconBtn = document.getElementById("annIconBtn");
  if (iconBtn && panel && overlay) {
    iconBtn.addEventListener("click", () => {
      panel.classList.add("open");
      overlay.classList.add("open");
    });
    overlay.addEventListener("click", closeAnnPanel);
  }
}

function closeAnnPanel() {
  const panel   = document.getElementById("annPanel");
  const overlay = document.getElementById("annOverlay");
  if (panel)   panel.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", initAnnonces);
