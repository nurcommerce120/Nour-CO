/* Avis clients validés par R.A.Y.B
   Pour publier un avis reçu via le formulaire, ajoute-le dans ce tableau.
   - produitId doit correspondre à l'id du produit : veste-noire, veste-grise, etc.
   - Si tu veux afficher un avis sur la page avis générale seulement, tu peux enlever produitId.
*/

const AVIS_CLIENTS = [
  { produitId: "veste-grise", nom: "Client R.A.Y.B", note: 5, texte: "TEST" },
];

function escapeHtmlAvis(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function reviewCardHtml(a) {
  const note = Math.max(1, Math.min(5, Number(a.note || 5)));
  return `
    <div class="review-card">
      <strong>${escapeHtmlAvis(a.nom || "Client R.A.Y.B")}</strong>
      <span class="review-stars" aria-label="${note} sur 5">${"★".repeat(note)}${"☆".repeat(5-note)}</span>
      <p>${escapeHtmlAvis(a.texte || "")}</p>
    </div>
  `;
}

function renderReviewList(list, reviews, emptyText) {
  if (!list) return;
  if (!reviews.length) {
    list.innerHTML = `<p class="muted review-empty">${emptyText}</p>`;
    return;
  }
  list.innerHTML = reviews.map(reviewCardHtml).join("");
}

function renderAvisClients(){
  const globalList = document.getElementById("reviewList");
  renderReviewList(
    globalList,
    AVIS_CLIENTS,
    "Aucun avis publié pour le moment."
  );

  const productList = document.getElementById("productReviewList");
  if (productList) {
    const productId = productList.dataset.productId || "";
    const productReviews = AVIS_CLIENTS.filter(a => !a.produitId || a.produitId === productId);
    renderReviewList(
      productList,
      productReviews,
      "Aucun avis publié pour ce produit pour le moment."
    );
  }
}

document.addEventListener("DOMContentLoaded", renderAvisClients);
