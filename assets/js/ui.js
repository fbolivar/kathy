// assets/js/ui.js — Shared UI logic

// ── PRODUCT CARD BUILDER ──
function buildProductCard(product) {
  return `
    <article class="product-card">
      <a href="${product.url}" class="product-img-wrap">
        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
        ${product.destacado ? '<span class="product-badge">Destacado</span>' : ''}
      </a>
      <div class="product-info">
        <div class="product-brand">${product.marca} · ${product.categoria}</div>
        <div class="product-name">${product.nombre}</div>
        <div class="product-desc">${product.descripcionCorta}</div>
        <div class="product-tags">
          ${product.tags.slice(0, 3).map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">$${product.precio} <small>USD</small></div>
          <a href="${product.url}" class="btn-card">Ver más</a>
        </div>
      </div>
    </article>`;
}

// ── CHAT WIDGET HTML ──
function chatWidgetHTML() {
  return `
    <button class="chat-float-btn" id="chat-float-btn" aria-label="Abrir asistente">
      💬
      <span class="chat-badge" id="chat-badge">1</span>
    </button>

    <div class="chat-panel" id="chat-panel" role="dialog" aria-label="Asistente Valentina">
      <div class="chat-header">
        <div class="chat-avatar-main">✨</div>
        <div class="chat-header-info">
          <div class="chat-header-name">Valentina</div>
          <div class="chat-header-status">Asesora Capilar · En línea</div>
        </div>
        <button class="chat-close-btn" id="chat-close-btn" aria-label="Cerrar chat">✕</button>
      </div>

      <div class="chat-messages" id="chat-messages" role="log" aria-live="polite"></div>

      <div class="quick-replies" id="quick-replies"></div>

      <div class="chat-input-area">
        <textarea
          class="chat-input"
          id="chat-input"
          placeholder="Escribe tu consulta capilar..."
          rows="1"
          aria-label="Mensaje para Valentina"
        ></textarea>
        <button class="chat-send-btn" id="chat-send" aria-label="Enviar">➤</button>
      </div>
    </div>`;
}

// ── INJECT CHAT WIDGET ──
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = chatWidgetHTML();
  document.body.appendChild(wrapper);
});
