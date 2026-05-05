// assets/js/chat.js

function buildSystemPrompt(productContext) {
  const catalogSummary = CATALOG.map(p => ({
    id: p.id,
    nombre: p.nombre,
    marca: p.marca,
    sitioMarca: p.sitioMarca,
    categoria: p.categoria,
    precio: p.precio + ' USD',
    cueroType: p.cueroType,
    anticaspa: p.anticaspa,
    tiposCabello: p.tiposCabello,
    beneficios: p.beneficios,
    descripcion: p.descripcionLarga,
    tags: p.tags
  }));

  let extra = '';
  if (productContext) {
    extra = `\n\nCONTEXTO ACTUAL: La clienta está viendo el producto "${productContext.nombre}" de ${productContext.marca} ($${productContext.precio} USD). Puedes hacer referencia a este producto en tu primera respuesta si es relevante.`;
  }

  return `Eres Valentina, asesora capilar experta de Katheryn Boutique (ekaboutique.com).
Somos distribuidores autorizados en EE.UU. de las mejores marcas colombianas de cuidado capilar.

MARCAS DISPONIBLES: Milagros, Anyeluz, Kaba, La Poción, Duveshi, La Receta Natural, Origen Botánico.

CATÁLOGO COMPLETO (productos reales de ekaboutique.com):
${JSON.stringify(catalogSummary, null, 2)}

═══════════════════════════════════════
FLUJO DIAGNÓSTICO OBLIGATORIO:
═══════════════════════════════════════

SIEMPRE que una clienta llegue por primera vez o tenga una consulta nueva, haz ESTAS DOS PREGUNTAS en este orden ANTES de recomendar cualquier producto:

PREGUNTA 1: "¿Qué tipo de cuero cabelludo tienes?"
  Opciones a ofrecer: Seco · Graso · Mixto · Normal · No sé

PREGUNTA 2: "¿Tienes caspa?"
  Opciones a ofrecer: Sí, tengo caspa · No tengo caspa · A veces

Con esas dos respuestas, usa el campo "cueroType" y "anticaspa" del catálogo para filtrar los productos correctos.

ÁRBOL DE RECOMENDACIÓN según respuestas:
- Cuero SECO + SIN caspa → productos con cueroType: seco, anticaspa: false → enfocados en hidratación y nutrición
- Cuero SECO + CON caspa → productos con anticaspa: true, cueroType incluye seco o mixto
- Cuero GRASO + SIN caspa → productos con cueroType: graso, anticaspa: false → control de sebo
- Cuero GRASO + CON caspa → productos con anticaspa: true, cueroType incluye graso o mixto → PRIORITARIOS: Shampoo Anticaspa Milagros (mil-s1), Ritual Control Caspa Origen Botánico (ori-s1), Shampoo Control Caspa La Poción (poc-sh-caspa), Bioterapia Romero Anyeluz (any-s3), Shampoo Romero La Receta (rec-s1)
- Cuero MIXTO → productos que incluyan 'mixto' en cueroType
- No sabe → pregunta si el cabello se engrasa rápido (graso/mixto) o se reseca (seco/normal)

═══════════════════════════════════════
REGLAS DE COMPORTAMIENTO:
═══════════════════════════════════════

1. DIAGNÓSTICO PRIMERO: Antes de recomendar, reúne información:
   - Tipo de cabello (seco, graso, mixto, rizado, liso, ondulado)
   - Principal problema o necesidad
   - ¿Ha tenido procesos químicos? (tinte, decoloración, keratina, permanente)
   - ¿Usa calor frecuente? (plancha, secador)
   - Presupuesto aproximado (opcional)

2. No lances preguntas todas juntas. Máximo 2 preguntas a la vez.

3. RECOMENDACIONES: Solo productos del catálogo real. Máximo 3 por consulta.

4. Explica ESPECÍFICAMENTE por qué cada producto sirve para su caso.

5. Si hay un kit que soluciona la necesidad, menciónalo con el precio total.

6. Siempre incluye el precio en USD.

7. Tono: cálido, cercano, experto. Como una amiga que sabe mucho de cabello.

8. Responde SIEMPRE en español.

9. Al recomendar, escribe al final una línea especial (invisible para la clienta):
   PRODUCTOS_IDS:["id1","id2","id3"]

10. Cierra siempre ofreciendo resolver más dudas.

INFORMACIÓN ADICIONAL DE LA TIENDA:
- Envío gratis en EE.UU. para compras mayores a $70
- Distribuidores autorizados de marcas colombianas premium
- Página web: ekaboutique.com${extra}`;
}

class ChatAssistant {
  constructor(productContext) {
    this.history = [];
    this.isTyping = false;
    this.productContext = productContext || null;
    this.messagesEl = document.getElementById('chat-messages');
    this.inputEl = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send');
    this.quickRepliesEl = document.getElementById('quick-replies');
    this.init();
  }

  init() {
    this.sendBtn.addEventListener('click', () => this.send());
    this.inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
    });
    this.inputEl.addEventListener('input', () => this.autoResize());
    this.showWelcome();
  }

  autoResize() {
    this.inputEl.style.height = 'auto';
    this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 100) + 'px';
  }

  showWelcome() {
    setTimeout(() => {
      let msg;
      if (this.productContext) {
        msg = `¡Hola! Soy **Valentina**, tu asesora capilar de Katheryn Boutique.\n\nVeo que estás mirando el **${this.productContext.nombre}** de ${this.productContext.marca}. Para asegurarme de que es el ideal para ti, necesito hacerte dos preguntas rápidas.\n\n**¿Qué tipo de cuero cabelludo tienes?**`;
        this.history.push({ role: 'assistant', content: msg });
        this.renderMessage('bot', msg);
        this.setQuickReplies(['Seco', 'Graso', 'Mixto', 'Normal', 'No sé']);
      } else {
        msg = `¡Hola! Soy **Valentina**, tu asesora capilar de Katheryn Boutique.\n\nTrabajamos con las mejores marcas colombianas de cuidado capilar. Para recomendarte los productos perfectos para ti, necesito hacerte dos preguntas.\n\n**¿Qué tipo de cuero cabelludo tienes?**`;
        this.history.push({ role: 'assistant', content: msg });
        this.renderMessage('bot', msg);
        this.setQuickReplies(['Seco', 'Graso', 'Mixto', 'Normal', 'No sé']);
      }
    }, 500);
  }

  async send() {
    const text = this.inputEl.value.trim();
    if (!text || this.isTyping) return;
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';
    this.clearQuickReplies();
    this.isTyping = true;
    this.sendBtn.disabled = true;
    this.renderMessage('user', text);
    this.showTyping();

    try {
      const reply = await this.callAPI(text);
      this.hideTyping();
      const products = this.extractProducts(reply);
      this.renderMessage('bot', reply, products);
      this.updateQuickReplies(products.length > 0);
    } catch (err) {
      this.hideTyping();
      this.renderError('Ocurrió un error al conectar con el asistente. Verifica que el servidor esté corriendo.');
      console.error(err);
    }
    this.isTyping = false;
    this.sendBtn.disabled = false;
  }

  async callAPI(userMessage) {
    this.history.push({ role: 'user', content: userMessage });
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: this.history,
        system: buildSystemPrompt(this.productContext)
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Error ${response.status}: ${err}`);
    }
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    this.history.push({ role: 'assistant', content: text });
    return text;
  }

  extractProducts(text) {
    const m = text.match(/PRODUCTOS_IDS:(\[[\s\S]*?\])/);
    if (!m) return [];
    try {
      const ids = JSON.parse(m[1]);
      return ids.map(id => CATALOG.find(p => p.id === id)).filter(Boolean);
    } catch { return []; }
  }

  renderMessage(role, text, products = []) {
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg--${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = role === 'bot' ? '✨' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    const cleanText = text.replace(/PRODUCTOS_IDS:\[[\s\S]*?\]/g, '').trim();
    bubble.innerHTML = this.formatText(cleanText);

    products.forEach(p => bubble.appendChild(this.renderProductCard(p)));

    const ts = document.createElement('span');
    ts.className = 'chat-ts';
    ts.textContent = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(ts);

    div.appendChild(avatar);
    div.appendChild(bubble);
    this.messagesEl.appendChild(div);
    this.scrollBottom();
  }

  renderProductCard(p) {
    const card = document.createElement('div');
    card.className = 'chat-product-card';
    card.innerHTML = `
      <div class="cp-brand">${p.marca} · ${p.categoria}</div>
      <div class="cp-name">${p.nombre}</div>
      <div class="cp-desc">${p.descripcionCorta}</div>
      <div class="cp-tags">${p.tags.slice(0,3).map(t => `<span>${t}</span>`).join('')}</div>
      <div class="cp-footer">
        <strong class="cp-price">$${p.precio} USD</strong>
        <a href="${p.urlTienda}" target="_blank" class="cp-link">Ver en tienda →</a>
      </div>`;
    return card;
  }

  formatText(text) {
    return '<p>' + text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br>') + '</p>';
  }

  showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--bot';
    div.id = 'typing-indicator';
    div.innerHTML = `
      <div class="chat-avatar">✨</div>
      <div class="chat-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>`;
    this.messagesEl.appendChild(div);
    this.scrollBottom();
  }

  hideTyping() {
    document.getElementById('typing-indicator')?.remove();
  }

  renderError(msg) {
    const p = document.createElement('p');
    p.className = 'chat-error';
    p.textContent = '⚠️ ' + msg;
    this.messagesEl.appendChild(p);
    this.scrollBottom();
  }

  setQuickReplies(replies) {
    this.quickRepliesEl.innerHTML = '';
    replies.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = r;
      btn.onclick = () => { this.inputEl.value = r; this.send(); };
      this.quickRepliesEl.appendChild(btn);
    });
  }

  updateQuickReplies(hasProducts) {
    if (hasProducts) {
      this.setQuickReplies([
        '¿Cuánto tarda el envío?',
        '¿Hay algo más económico?',
        '¿Tienen kits?',
        '¿Cómo uso estos productos?',
        'Hacer nueva consulta'
      ]);
    } else {
      // Detectar si la IA está preguntando por caspa
      const lastMsg = this.history[this.history.length - 1]?.content?.toLowerCase() || '';
      if (lastMsg.includes('caspa')) {
        this.setQuickReplies(['Sí, tengo caspa', 'No tengo caspa', 'A veces tengo']);
      } else if (lastMsg.includes('cuero cabelludo') || lastMsg.includes('tipo')) {
        this.setQuickReplies(['Seco', 'Graso', 'Mixto', 'Normal', 'No sé']);
      } else {
        this.setQuickReplies([
          'Quiero empezar de nuevo',
          'Tengo más preguntas',
          '¿Envían a todo EE.UU.?',
          'Ver todos los productos'
        ]);
      }
    }
  }

  clearQuickReplies() { this.quickRepliesEl.innerHTML = ''; }
  scrollBottom() {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  }
}

// ── CHAT PANEL TOGGLE ──
function initChatToggle() {
  const btn = document.getElementById('chat-float-btn');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close-btn');
  const badge = document.getElementById('chat-badge');
  let opened = false;
  let assistant = null;

  function openChat() {
    panel.classList.add('open');
    badge && (badge.style.display = 'none');
    if (!opened) {
      opened = true;
      const productContext = window.__PRODUCT_CONTEXT__ || null;
      assistant = new ChatAssistant(productContext);
    }
  }

  function closeChat() { panel.classList.remove('open'); }

  btn.addEventListener('click', () => panel.classList.contains('open') ? closeChat() : openChat());
  closeBtn?.addEventListener('click', closeChat);

  // Auto-open on product pages after 3s
  if (window.__PRODUCT_CONTEXT__) {
    setTimeout(openChat, 2500);
  }
}

document.addEventListener('DOMContentLoaded', initChatToggle);
