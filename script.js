const PRODUCTS = [
  { id: 'wood50', name: 'Bûches 50 cm en vrac', category: 'bois', badge: '50 cm', price: 89, unit: 'stère', image: 'images/chene.jpg', featured: false },
  { id: 'wood40', name: 'Bûches 40 cm en vrac', category: 'bois', badge: '40 cm', price: 95, unit: 'stère', image: 'images/hetre.webp', featured: false },
  { id: 'wood33', name: 'Bûches 33 cm en vrac', category: 'bois', badge: '33 cm', price: 102, unit: 'stère', image: 'images/charme.webp', featured: true },
  { id: 'wood25', name: 'Bûches 25 cm en vrac', category: 'bois', badge: '25 cm', price: 115, unit: 'stère', image: 'images/frene.jpg', featured: false },
  { id: 'wood-palette', name: 'Palette de bois rangé', category: 'bois', badge: 'Sur demande', price: null, unit: 'palette', image: 'images/pallettes.jpg', featured: false },
  { id: 'pellet-sac', name: 'Sac de granulés 15 kg', category: 'granules', badge: '15 kg', price: 5.90, unit: 'sac', image: 'images/05c69ff2-a266-4863-8eaf-58d30fbf2f75.jfif', featured: false },
  { id: 'pellet-palette', name: 'Palette de granulés', category: 'granules', badge: 'ENplus A1', price: 385, unit: 'palette', image: 'images/10f257ce-9b29-49ee-a8a4-07ee7c95473d.jfif', featured: true },
  { id: 'pellet-premium', name: 'Palette de granulés Premium', category: 'granules', badge: 'Premium', price: 425, unit: 'palette', image: 'images/05a12da0-f29b-4afc-813c-e6c41bcba3c2.jfif', featured: false },
  { id: 'day-logs', name: 'Bûches densifiées de jour', category: 'densifie', badge: 'Jour', price: 5.50, unit: 'pack', image: 'images/images (9).jfif', featured: true },
  { id: 'night-logs', name: 'Bûches densifiées de nuit', category: 'densifie', badge: 'Nuit', price: 6.50, unit: 'pack', image: 'images/images (9).jfif', featured: false },
  { id: 'kindling', name: "Bois d'allumage extra-sec", category: 'allumage', badge: 'Extra-sec', price: 7.50, unit: 'filet', image: 'images/0f726f19-8251-444e-8aa5-f65d324781d1.jfif', featured: true },
  { id: 'firelighters', name: 'Allume-feux écologiques', category: 'allumage', badge: 'Naturels', price: 6.90, unit: 'boîte', image: 'images/22b988fe-d9bf-4c1c-a3a1-19ed65007de3.jfif', featured: false },
  { id: 'cover', name: 'Housse de protection pour palette', category: 'allumage', badge: 'Protection', price: 24.90, unit: 'pièce', image: 'images/bbbcc.webp', featured: false }
];
const CATEGORY_LABELS = { bois: 'Bois de chauffage', granules: 'Granulés de bois', densifie: 'Bûches densifiées', allumage: 'Allumage & accessoires' };
const CART_STORAGE_KEY = 'flammeche_request_v1';
const CONTACT_EMAIL = 'boischauffage3fr@gmail.com';
const WHATSAPP_PHONE = '+33759134427';
let activeCategory = 'tout';
let maxPrice = 450;
let activeTranslationLanguage = 'fr';
let visitorTranslationLanguage = 'fr';

const euro = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
function displayProductName(product) { return product.name; }
function displayProductUnit(product) { return product.unit; }
function displayCategory(category) { return CATEGORY_LABELS[category] || category; }
function displayProductBadge(product) { return product.badge; }
function translateText(value) { return value; }
function translateDocument(doc) { if (doc.documentElement) doc.documentElement.lang = 'fr'; return doc; }
function translateGeneratedSubtree() {}

const LANGUAGE_OPTIONS = [
  ['fr', 'Français'], ['it', 'Italiano'], ['de', 'Deutsch'], ['en', 'English'],
  ['es', 'Español'], ['pt', 'Português'], ['nl', 'Nederlands']
];
function detectVisitorLanguage() {
  const supported = new Set(LANGUAGE_OPTIONS.map(([code]) => code));
  for (const locale of navigator.languages || [navigator.language || 'fr']) {
    const language = locale.toLowerCase().split('-')[0];
    if (supported.has(language)) return language;
  }
  return 'fr';
}
function applyGoogleTranslation(language, attempt = 0) {
  const selector = document.querySelector('.goog-te-combo');
  if (!selector) {
    if (attempt < 40) window.setTimeout(() => applyGoogleTranslation(language, attempt + 1), 250);
    return;
  }
  selector.value = language === 'fr' ? '' : language;
  selector.dispatchEvent(new Event('change', { bubbles: true }));
}
function initLanguageTranslator() {
  if (!document.querySelector('.site-header') || document.querySelector('#google_translate_element')) return;
  visitorTranslationLanguage = detectVisitorLanguage();
  if (visitorTranslationLanguage === 'fr') return;
  const translatorRoot = document.createElement('div');
  translatorRoot.id = 'google_translate_element';
  translatorRoot.setAttribute('aria-hidden', 'true');
  translatorRoot.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;overflow:hidden';
  document.body.append(translatorRoot);
  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    new google.translate.TranslateElement({
      pageLanguage: 'fr',
      includedLanguages: LANGUAGE_OPTIONS.map(([code]) => code).join(','),
      autoDisplay: false
    }, 'google_translate_element');
    applyGoogleTranslation(visitorTranslationLanguage, 1);
  };
  const translateScript = document.createElement('script');
  translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  translateScript.async = true;
  translateScript.onerror = () => toast('Traduction automatique non disponible : vérifiez la connexion internet.');
  document.head.append(translateScript);
}

const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}'); } catch { return {}; } };
const writeCart = cart => { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); updateCartUI(); };
const cartEntries = () => Object.entries(readCart()).filter(([, qty]) => qty > 0);
const cartCount = () => cartEntries().reduce((sum, [, qty]) => sum + qty, 0);
const cartTotal = () => cartEntries().reduce((sum, [id, qty]) => sum + ((PRODUCTS.find(product => product.id === id)?.price || 0) * qty), 0);

function changeQty(id, delta) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product || product.price === null) return;
  const cart = readCart();
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (!cart[id]) delete cart[id];
  writeCart(cart);
  renderProductQuantities();
  renderRequestLines();
}
function addQty(id, quantity = 1) { for (let i = 0; i < quantity; i += 1) changeQty(id, 1); }

function updateCartUI() {
  document.querySelectorAll('[data-cart-count]').forEach(node => { node.textContent = cartCount(); });
  document.querySelectorAll('[data-cart-total]').forEach(node => { node.textContent = euro(cartTotal()); });
  const bar = document.querySelector('.request-bar');
  if (bar) {
    bar.classList.toggle('visible', cartCount() > 0 && document.body.dataset.page === 'catalogue');
    const summary = bar.querySelector('[data-request-summary]');
    if (summary) summary.textContent = `${cartCount()} produit${cartCount() > 1 ? 's' : ''} · total estimé ${euro(cartTotal())}`;
  }
}
function renderProductQuantities() {
  document.querySelectorAll('[data-product-id]').forEach(card => {
    const productId = card.dataset.productId;
    const qty = readCart()[productId] || 0;
    const add = card.querySelector('.add-product');
    const controls = card.querySelector('.card-quantity');
    if (add) { add.hidden = qty > 0; }
    if (controls) { controls.classList.toggle('visible', qty > 0); controls.querySelector('[data-qty-value]').textContent = qty; }
  });
}
function productCard(product) {
  const name = displayProductName(product);
  const unit = displayProductUnit(product);
  const category = displayCategory(product.category);
  const price = product.price === null ? 'Prix sur demande' : `${euro(product.price)} <small>/ ${unit}</small>`;
  return `<article class="product-card" data-product-id="${product.id}"><div class="product-photo"><img src="${product.image}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='images/melange.jpg'"><span class="product-badge">${displayProductBadge(product)}</span></div><div class="product-info"><h3>${name}</h3><div class="product-meta">${category}</div><div class="product-bottom"><span class="product-price">${price}</span>${product.price === null ? `<a class="add-product" href="contact.html">Demander le prix</a>` : `<button class="add-product" data-add="${product.id}">Ajouter à ma demande</button><div class="card-quantity"><button aria-label="Retirer une unité" data-qty-change="-1" data-id="${product.id}">−</button><span data-qty-value>0</span><button aria-label="Ajouter une unité" data-qty-change="1" data-id="${product.id}">+</button></div>`}</div></div></article>`;
}
function renderFeatured() {
  const container = document.querySelector('[data-featured]');
  if (!container) return;
  const featured = ['wood33', 'pellet-palette', 'day-logs', 'kindling'].map(id => PRODUCTS.find(item => item.id === id));
  container.innerHTML = featured.map(product => `<a class="feature-card" href="catalogue.html"><div class="feature-image"><img src="${product.image}" alt="${displayProductName(product)}" loading="lazy" onerror="this.onerror=null;this.src='images/melange.jpg'"></div><div class="feature-card-info"><div><h3>${displayProductName(product)}</h3><p>${displayCategory(product.category)}</p></div><span class="feature-price">${euro(product.price)} <small>/ ${displayProductUnit(product)}</small></span></div></a>`).join('');
}
function renderCatalogue() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const queryCategory = params.get('categorie');
  if (queryCategory && CATEGORY_LABELS[queryCategory]) activeCategory = queryCategory;
  const categoryButtons = [...document.querySelectorAll('[data-filter-category]')];
  categoryButtons.forEach(button => button.classList.toggle('active', button.dataset.filterCategory === activeCategory));
  const sort = document.querySelector('[data-sort]')?.value || 'recommended';
  let filtered = PRODUCTS.filter(product => (activeCategory === 'tout' || product.category === activeCategory) && (product.price === null ? maxPrice === 450 : product.price <= maxPrice));
  if (sort === 'price-asc') filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === 'price-desc') filtered.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  grid.innerHTML = filtered.length ? filtered.map(productCard).join('') : `<p class="catalogue-empty">Aucun produit ne correspond à ces critères.</p>`;
  const count = document.querySelector('[data-results-count]');
  if (count) count.textContent = `${filtered.length} produit${filtered.length > 1 ? 's' : ''}`;
  renderProductQuantities();
}
function openRequest() { document.querySelector('.request-overlay')?.classList.add('open'); document.body.classList.add('modal-open'); renderRequestLines(); }
function closeRequest() { document.querySelector('.request-overlay')?.classList.remove('open'); document.body.classList.remove('modal-open'); }
function renderRequestLines() {
  const list = document.querySelector('[data-request-lines]');
  if (!list) return;
  const entries = cartEntries();
  list.innerHTML = entries.length ? entries.map(([id, qty]) => { const product = PRODUCTS.find(item => item.id === id); return `<article class="request-line"><div><h3>${displayProductName(product)}</h3><p>${euro(product.price)} / ${displayProductUnit(product)} · ${euro(product.price * qty)}</p></div><div class="request-line-controls"><button data-qty-change="-1" data-id="${id}" aria-label="Retirer une unité">−</button><span>${qty}</span><button data-qty-change="1" data-id="${id}" aria-label="Ajouter une unité">+</button><button class="remove-line" data-remove-id="${id}">Retirer</button></div></article>`; }).join('') : `<p class="request-empty">Votre sélection est vide. Choisissez des produits pour composer votre demande.</p>`;
  const total = document.querySelector('[data-request-grand-total]');
  if (total) total.textContent = euro(cartTotal());
  document.querySelectorAll('[data-submit-request]').forEach(button => { button.disabled = entries.length === 0; });
}
function toast(message) { const node = document.querySelector('.toast'); if (!node) return; node.textContent = message; node.classList.add('visible'); window.setTimeout(() => node.classList.remove('visible'), 2200); }
function initRequestUI() {
  if (document.querySelector('.request-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'request-overlay';
  overlay.innerHTML = `<section class="request-panel" role="dialog" aria-modal="true" aria-labelledby="request-title"><div class="request-panel-head"><h2 id="request-title">Ma demande</h2><button class="close-request" data-close-request aria-label="Fermer">×</button></div><div class="request-lines" data-request-lines></div><div class="request-summary"><span>Total estimé</span><strong data-request-grand-total>0,00 €</strong></div><div class="request-actions"><button class="clear-request" data-clear-request>Vider ma sélection</button><span class="muted">Le prix et la livraison seront confirmés avec vous.</span></div><form class="contact-form" data-contact-form data-request-form><div class="full"><label for="request-name">Votre nom *</label><input id="request-name" name="name" required placeholder="Marie Dupont"></div><div class="full"><label for="request-phone">Téléphone *</label><input id="request-phone" name="phone" required type="tel" placeholder="06 12 34 56 78"></div><div class="full"><label for="request-email">E-mail</label><input id="request-email" name="email" type="email" placeholder="vous@exemple.fr"></div><div class="full"><label for="request-city">Ville ou code postal</label><input id="request-city" name="city" placeholder="21000 Dijon"></div><div class="full"><label for="request-message">Votre message</label><textarea id="request-message" name="message" placeholder="Précisions sur votre demande..."></textarea></div><button class="button button-yellow" type="submit" data-submit-request data-send-via="gmail">Envoyer via Gmail ↗</button><button class="button button-outline" type="submit" data-submit-request data-send-via="whatsapp">Envoyer via WhatsApp ↗</button><p class="muted full">Aucun paiement en ligne. Nous vous rappelons pour confirmer votre demande.</p></form></section>`;
  document.body.append(overlay);
  const bar = document.createElement('div');
  bar.className = 'request-bar';
  bar.innerHTML = '<div><strong data-request-summary>0 produit · total estimé 0,00 €</strong><br><span>Votre sélection est enregistrée sur cet appareil.</span></div><button data-open-request>Finaliser ma demande</button>';
  document.body.append(bar);
  const toastNode = document.createElement('div'); toastNode.className = 'toast'; toastNode.setAttribute('role', 'status'); document.body.append(toastNode);
  updateCartUI();
}
function setupLengthCalculator() {
  const widthInput = document.querySelector('[data-fireplace-width]');
  const result = document.querySelector('[data-length-result]');
  if (!widthInput || !result) return;
  const update = () => { const width = Number(widthInput.value); if (!width || width < 30) { result.textContent = 'Saisissez une largeur utile d’au moins 30 cm.'; return; } const maxLength = width - 10; const choice = [50, 40, 33, 25].find(length => length <= maxLength) || 25; result.textContent = `Pour ${width} cm de largeur utile, choisissez des bûches de ${choice} cm afin de garder un peu d’espace de chaque côté.`; };
  widthInput.addEventListener('input', update); update();
}
function setupStereCalculator() {
  const form = document.querySelector('[data-stere-calculator]');
  if (!form) return;
  form.addEventListener('submit', event => event.preventDefault());
  const output = form.querySelector('[data-stere-result]');
  const calculate = () => {
    const surface = Math.max(1, Number(form.querySelector('[name="surface"]').value) || 100);
    const usage = form.querySelector('[name="usage"]').value;
    const insulation = form.querySelector('[name="insulation"]').value;
    const length = Number(form.querySelector('[name="length"]').value);
    const usageFactor = { principal: .08, appoint: .04, weekend: .025 }[usage];
    const insulationFactor = { good: .8, average: 1, poor: 1.25 }[insulation];
    const lengthFactor = { 25: 1.1, 33: 1, 40: .94, 50: .88 }[length];
    const estimate = Math.max(1, Math.round(surface * usageFactor * insulationFactor * lengthFactor));
    const low = Math.max(1, estimate - 1); const high = estimate + 1;
    const product = PRODUCTS.find(item => item.id === `wood${length}`) || PRODUCTS.find(item => item.id === 'wood33');
    output.innerHTML = `<strong>${low} à ${high} stères par hiver</strong><br>Soit environ ${euro(product.price * estimate)} pour ${estimate} stères en ${length} cm.`;
    form.querySelector('[data-add-estimate]').dataset.quantity = estimate;
    form.querySelector('[data-add-estimate]').dataset.product = product.id;
  };
  form.addEventListener('input', calculate); form.addEventListener('change', calculate); calculate();
}
function setupFaq() {
  const categoryButtons = [...document.querySelectorAll('[data-faq-category]')];
  const items = [...document.querySelectorAll('[data-faq-item]')];
  if (!items.length) return;
  categoryButtons.forEach(button => button.addEventListener('click', () => { categoryButtons.forEach(item => item.classList.toggle('active', item === button)); items.forEach(item => { item.hidden = button.dataset.faqCategory !== 'tout' && item.dataset.category !== button.dataset.faqCategory; }); }));
  document.querySelectorAll('[data-faq-question]').forEach(button => button.addEventListener('click', () => { const item = button.closest('[data-faq-item]'); item.classList.toggle('open'); button.setAttribute('aria-expanded', item.classList.contains('open')); button.querySelector('span:last-child').textContent = item.classList.contains('open') ? '−' : '+'; }));
}
function setupAdviceFilters() {
  const buttons = [...document.querySelectorAll('[data-advice-filter]')];
  const cards = [...document.querySelectorAll('[data-advice]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => item.classList.toggle('active', item === button));
    cards.forEach(card => { card.hidden = button.dataset.adviceFilter !== 'tout' && card.dataset.advice !== button.dataset.adviceFilter; });
  }));
}
function initView() {
  document.body.classList.remove('menu-open');
  document.querySelector('.main-nav')?.classList.remove('open');
  document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
  renderFeatured(); renderCatalogue(); setupLengthCalculator(); setupStereCalculator(); setupFaq(); setupAdviceFilters(); updateCartUI();
  document.querySelectorAll('[data-filter-category]').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.filterCategory; history.replaceState({}, '', location.pathname); renderCatalogue(); }));
  const range = document.querySelector('[data-price-range]');
  if (range) { range.value = maxPrice; range.addEventListener('input', () => { maxPrice = Number(range.value); document.querySelector('[data-price-value]').textContent = euro(maxPrice); renderCatalogue(); }); document.querySelector('[data-price-value]').textContent = euro(maxPrice); }
  document.querySelector('[data-sort]')?.addEventListener('change', renderCatalogue);
}
async function navigate(url, { push = true } = {}) {
  const target = new URL(url, location.href);
  if (target.origin !== location.origin) return;
  const response = await fetch(target.href);
  if (!response.ok) return;
  const html = await response.text();
  const doc = translateDocument(new DOMParser().parseFromString(html, 'text/html'));
  const nextView = doc.querySelector('#app');
  const currentView = document.querySelector('#app');
  if (!nextView || !currentView) return;
  currentView.innerHTML = nextView.innerHTML;
  document.body.dataset.page = doc.body.dataset.page || 'page';
  document.title = doc.title;
  activeCategory = 'tout'; maxPrice = 450;
  if (push) history.pushState({}, '', target.href);
  document.querySelectorAll('.main-nav [data-route]').forEach(link => link.classList.toggle('active', link.pathname === target.pathname));
  window.scrollTo({ top: 0, behavior: 'instant' });
  initView();
  translateDocument(document);
  applyGoogleTranslation(visitorTranslationLanguage);
}
function handleFormSubmit(form, sendVia = 'gmail') {
  const data = new FormData(form);
  const requestLines = form.hasAttribute('data-request-form') ? cartEntries().map(([id, qty]) => { const product = PRODUCTS.find(item => item.id === id); return `- ${displayProductName(product)}: ${qty} ${displayProductUnit(product)}, ${euro(product.price * qty)}`; }) : [];
  const body = [`Nom : ${data.get('name')}`, `Téléphone : ${data.get('phone')}`, `E-mail : ${data.get('email') || 'non renseigné'}`, `Ville / code postal : ${data.get('city') || 'non renseigné'}`, `Message : ${data.get('message') || 'aucun'}`, ...(requestLines.length ? ['', 'Sélection :', ...requestLines, `Total estimé : ${euro(cartTotal())}`] : [])].join('\n');
  const subject = form.hasAttribute('data-request-form') ? 'Demande de produits Bois & Braise' : 'Message depuis le site Bois & Braise';
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`;
  window.open(sendVia === 'whatsapp' ? whatsappUrl : gmailUrl, '_blank', 'noopener');
  let confirmation = form.parentElement.querySelector('.form-confirm');
  if (!confirmation) {
    confirmation = document.createElement('div');
    confirmation.className = 'form-confirm';
    confirmation.setAttribute('role', 'status');
    form.before(confirmation);
  }
  confirmation.innerHTML = `Votre demande est prête. Aucun paiement ne sera effectué en ligne. <a href="${gmailUrl}" target="_blank" rel="noopener">Ouvrir Gmail ↗</a> · <a href="${whatsappUrl}" target="_blank" rel="noopener">Ouvrir WhatsApp ↗</a>`;
  confirmation.classList.add('visible');
  toast(sendVia === 'whatsapp' ? 'Ouverture de WhatsApp…' : 'Ouverture de Gmail…');
}
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href]');
  if (anchor && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && anchor.origin === location.origin && /\.html$/.test(anchor.pathname) && !anchor.hasAttribute('download')) { event.preventDefault(); navigate(anchor.href); return; }
  const add = event.target.closest('[data-add]'); if (add) { addQty(add.dataset.add); toast('Ajouté à votre demande'); return; }
  const quantity = event.target.closest('[data-qty-change]'); if (quantity) { changeQty(quantity.dataset.id, Number(quantity.dataset.qtyChange)); return; }
  const remove = event.target.closest('[data-remove-id]'); if (remove) { const cart = readCart(); delete cart[remove.dataset.removeId]; writeCart(cart); renderRequestLines(); renderProductQuantities(); return; }
  if (event.target.closest('[data-open-request]')) { openRequest(); return; }
  if (event.target.closest('[data-close-request]')) { closeRequest(); return; }
  if (event.target.matches('.request-overlay')) { closeRequest(); return; }
  if (event.target.closest('[data-clear-request]')) { if (cartCount() && window.confirm('Retirer tous les produits de votre demande ?')) { localStorage.removeItem(CART_STORAGE_KEY); updateCartUI(); renderProductQuantities(); renderRequestLines(); } return; }
  const estimateButton = event.target.closest('[data-add-estimate]'); if (estimateButton) { const product = PRODUCTS.find(item => item.id === estimateButton.dataset.product); const quantityToAdd = Number(estimateButton.dataset.quantity) || 8; if (product && !readCart()[product.id]) { const cart = readCart(); cart[product.id] = quantityToAdd; writeCart(cart); } else if (product) { const cart = readCart(); cart[product.id] += quantityToAdd; writeCart(cart); } renderProductQuantities(); renderRequestLines(); toast(`${quantityToAdd} stères ajoutés à votre demande`); return; }
  if (event.target.closest('[data-article-link]')) { const link = event.target.closest('[data-article-link]'); event.preventDefault(); navigate(link.href); }
});
document.addEventListener('submit', event => { const form = event.target.closest('[data-contact-form]'); if (form) { event.preventDefault(); if (form.reportValidity()) handleFormSubmit(form, event.submitter?.dataset.sendVia || 'gmail'); } });
document.querySelector('.menu-toggle')?.addEventListener('click', event => { const nav = document.querySelector('.main-nav'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeRequest(); });
window.addEventListener('popstate', () => navigate(location.href, { push: false }));
initRequestUI(); initView(); translateDocument(document); initLanguageTranslator();