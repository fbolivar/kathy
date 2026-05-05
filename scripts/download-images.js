// scripts/download-images.js
// Descarga imágenes reales de ekaboutique.com via Shopify Product JSON API
// Uso: node scripts/download-images.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const STORE = 'ekaboutique.com';
const IMG_DIR = path.join(__dirname, '../assets/images');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

// Todos los handles de productos en ekaboutique.com
const PRODUCTS = [
  // MILAGROS
  { handle: 'shampoo-milagro-herbal',                                           id: 'mil-sh-herbal' },
  { handle: 'acondicionador-milagro-herbal-1',                                  id: 'mil-ac-herbal' },
  { handle: 'biorepolarizador-capilar-1',                                        id: 'mil-biorepol' },
  { handle: 'shampoo-ultranutritivo-milagros',                                   id: 'mil-sh-ultra' },
  { handle: 'shampoo-emergencia-capilar',                                         id: 'mil-sh-emer' },
  { handle: 'shampoo-magia-capilar',                                              id: 'mil-sh-magia' },
  { handle: 'shampoo-anticaspa',                                                  id: 'mil-sh-caspa' },
  { handle: 'shampoo-crecimiento-con-extracto-de-cebolla-y-peptidos',            id: 'mil-sh-cebolla' },
  { handle: 'shampoo-arroz-y-acido-hialuronico-milagros-x-450ml-1',              id: 'mil-sh-arroz' },
  { handle: 'acondicionador-ultra-nutritivo-premium',                             id: 'mil-ac-ultra' },
  { handle: 'acondicionador-arroz-y-linaza-milagros-x-450ml-1',                  id: 'mil-ac-arroz' },
  { handle: 'mascarilla-capilar-milagro-herbal',                                  id: 'mil-mas-herbal' },
  { handle: 'mascarilla-reparacion-intensiva-milagros',                           id: 'mil-mas-rep' },
  { handle: 'mascarilla-capilar-multivitaminica-milagros-x-450g-1',               id: 'mil-mas-multi' },
  { handle: 'mascarilla-capilar-reparadora-intensiva-con-extracto-de-cebolla-y-peptidos', id: 'mil-mas-cebolla' },
  { handle: 'tratamiento-bio-repolarizador-capilar-1-litro-milagros',             id: 'mil-biorepol-1l' },
  { handle: 'tratamiento-de-frutas',                                              id: 'mil-trat-frutas' },
  { handle: 'tonico-milagro-herbal',                                              id: 'mil-tonic' },
  { handle: 'gotas-magicas-capilares-1',                                          id: 'mil-gotas' },
  { handle: 'desenredante-termoprotector-multibeneficios-1',                      id: 'mil-termo' },
  { handle: 'desenredante-termoprotector-multibeneficios-edicion-limitada-martina', id: 'mil-termo-martina' },
  { handle: 'serum-ritual-botanico-revitalizante-1',                              id: 'rb-serum' },
  { handle: 'rizos-terapia-de-nutricion-y-crecimiento-1',                         id: 'mil-rizos-ter' },
  { handle: 'ampolleta-elixir-revitalizante',                                     id: 'mil-ampol-elixir' },
  { handle: 'tratamiento-capilar-rescate-instantaneo-milagros',                   id: 'mil-rescate' },
  { handle: 'hair-wax-stick-cera-cabello-milagros-1',                             id: 'mil-wax' },
  { handle: 'shampoo-en-seco-voluminizador',                                      id: 'mil-sh-seco' },
  { handle: 'shampoo-exfoliante-capilar',                                         id: 'mil-sh-exfol' },
  // ANYELUZ
  { handle: 'shampoo-crecimiento-con-extracto-de-cebolla-y-peptidos',             id: 'any-sh-cebolla' },
  { handle: 'terapia-capilar-de-crecimiento-cebolla-anyeluz',                     id: 'any-ter-cebolla' },
  { handle: 'acondicionador-de-cebolla-anyeluz-500ml-1',                          id: 'any-ac-cebolla' },
  { handle: 'acondicionador-de-romero-anyeluz-500ml-1',                           id: 'any-ac-romero' },
  { handle: 'acondicionador-de-argan-y-aloe-vera-anyeluz-500ml-1',               id: 'any-ac-argan' },
  { handle: 'acondicionador-con-banano-anyeluz',                                  id: 'any-ac-banano' },
  { handle: 'acondicionador-con-ginseng-anyeluz-1',                               id: 'any-ac-ginseng' },
  { handle: 'mascarilla-nutritiva-con-banano-anyeluz',                            id: 'any-mas-banano' },
  { handle: 'bioterapia-capilar-con-romero-y-bioelixir-anyeluz-1',                id: 'any-bioter' },
  { handle: 'oleo-capilar-de-argan-anyeluz',                                      id: 'any-oleo-argan' },
  { handle: 'gomitas-de-biotina-fortificadas-anyeluz',                            id: 'any-gomitas' },
  { handle: 'kit-cebolla-anyeluz',                                                id: 'any-kit-cebolla' },
  { handle: 'shampoo-seco-anyeluz',                                               id: 'any-sh-seco' },
  { handle: 'crema-para-peinar-con-banano-anyeluz',                               id: 'any-crema-banano' },
  { handle: 'coctel-frutal-anyeluz-515ml-1',                                      id: 'any-coctel' },
  // KABA
  { handle: 'shampoo-reparador-sos-kaba-450ml',                                   id: 'kab-sh-sos' },
  { handle: 'acondicionador-reparador-sos-kaba-450ml',                            id: 'kab-ac-sos' },
  { handle: 'mascarilla-reparadora-sos-kaba-450ml',                               id: 'kab-mas-sos' },
  { handle: 'bio-mascarilla-capilar-kaba-500ml',                                  id: 'kab-bio-mas' },
  { handle: 'acondicionador-de-ceramidas-kaba-500-ml',                            id: 'kab-ac-cer' },
  { handle: 'shampoo-de-cebolla-kaba-500ml',                                      id: 'kab-sh-cebolla' },
  { handle: 'kit-kaba-sos',                                                        id: 'kab-kit-sos' },
  { handle: 'pocima-para-pestanas-kaba',                                           id: 'kab-pocima' },
  // KERATINA RB / RITUAL BOTANICO
  { handle: 'keratina-rb-x-120ml-1',                                              id: 'rb-ker-120' },
  { handle: 'keratina-rb-x-250ml-1',                                              id: 'rb-ker-250' },
  { handle: 'keratina-rb-x-1lt-1',                                                id: 'rb-ker-1l' },
  { handle: 'mascarilla-bomba-botanica-s-o-s-ritual-botanico',                    id: 'rb-mas-bomba' },
  { handle: 'ritual-purificante-control-caspa-con-menta-y-aji-1',                 id: 'rb-sh-caspa' },
  { handle: 'ritual-equilibrante-control-grasa-con-romero-y-eucalipto-1',         id: 'rb-sh-grasa' },
  { handle: 'ritual-ultra-reparador-s-o-s-con-cebolla-y-argan-1',                 id: 'rb-sh-sos' },
  { handle: 'termoprotector-con-feromonas-ritual-b-x-120ml',                      id: 'rb-termo' },
  { handle: 'duo-perfume-termoprotector-ritual-botanico',                          id: 'rb-duo-termo' },
  // LA POCION
  { handle: 'shampoo-crecimiento-y-caida-la-pocion-450ml',                        id: 'poc-sh-crec' },
  { handle: 'shampoo-control-caspa-450ml',                                         id: 'poc-sh-caspa' },
  { handle: 'shampoo-control-grasa-la-pocion-450ml',                               id: 'poc-sh-grasa' },
  { handle: 'shampoo-de-reparacion-la-pocion',                                     id: 'poc-sh-rep' },
  { handle: 'shampoo-para-rizos-tongole-la-pocion-450ml',                          id: 'poc-sh-rizos' },
  { handle: 'mascarilla-ancestral-la-pocion-350ml',                                id: 'poc-mas-anc' },
  { handle: 'mascarilla-capilar-para-rizos-tongole-la-pocion-450ml',              id: 'poc-mas-rizos' },
  { handle: 'mascarilla-bite-me-suplemento-capilar-la-pocion',                    id: 'poc-mas-bite' },
  { handle: 'dutonic-la-pocion-2x60ml',                                            id: 'poc-dutonic' },
  { handle: 'oleo-b8-brillo-infinito-la-pocion-30ml',                             id: 'poc-oleo-b8' },
  { handle: 'booster-tratamiento-capilar-reparador-la-pocion-50ml',               id: 'poc-booster' },
  { handle: 'gel-definidor-de-rizos-tongole-la-pocion-500ml',                     id: 'poc-gel-rizos' },
  { handle: 'dual-crema-para-peinar-la-pocion',                                    id: 'poc-dual-crema' },
  { handle: 'crema-para-peina-leave-on-tongole-la-pocion-450ml',                  id: 'poc-leave-on' },
  { handle: 'r3star-plex-pocion-100ml',                                            id: 'poc-r3star' },
  { handle: 'kit-la-pocion',                                                        id: 'poc-kit-rep' },
  { handle: 'kit-para-rizos-tongole-la-pocion',                                    id: 'poc-kit-rizos' },
  { handle: 'duo-control-caspa-pocion',                                            id: 'poc-duo-caspa' },
  // DUVESHI
  { handle: 'shampoo-anticaida-con-romero-y-jengibre-500ml-duveshi-1',            id: 'duv-sh-anticaida' },
  { handle: 'acondicionador-de-coco-duveshi-500ml-1',                             id: 'duv-ac-coco' },
  { handle: 'oro-liquido-50ml-duveshi-1',                                          id: 'duv-oro' },
  // LA RECETA
  { handle: 'aceite-reparador-de-puntas-la-receta-30ml',                          id: 'rec-aceite' },
  { handle: 'shampoo-de-romero-para-cabello-graso-la-receta-450ml',               id: 'rec-sh-romero' },
  // KITS
  { handle: 'kit-milagro-herbal',                                                   id: 'kit-milagro-h' },
  { handle: 'kit-crecimiento-y-anti-frizz-milagros',                               id: 'kit-crec-frizz' },
  { handle: 'duo-milagro-herbal',                                                   id: 'kit-duo-herbal' },
  { handle: 'duo-magia-capilar-milagros',                                           id: 'kit-duo-magia' },
  { handle: 'kit-menos-grasa-menos-caida',                                          id: 'kit-menos-grasa' },
  { handle: 'sport-tratamiento-de-ultra-proteccion',                               id: 'sport-trat' },
  { handle: 'kit-sin-enredos-kids-la-pocion',                                       id: 'poc-kit-kids' },
];

async function fetchProductJSON(handle) {
  return new Promise((resolve) => {
    const url = `https://${STORE}/products/${handle}.json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.product || null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadImage(url, filename) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const cleanUrl = url.startsWith('//') ? 'https:' + url : url;
    const dest = path.join(IMG_DIR, filename);
    if (fs.existsSync(dest)) return resolve(true); // ya descargada
    const file = fs.createWriteStream(dest);
    https.get(cleanUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        downloadImage(res.headers.location, filename).then(resolve);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', () => { file.close(); fs.unlink(dest, () => {}); resolve(false); });
  });
}

async function main() {
  const results = {};
  console.log(`\n📦 Descargando imágenes de ${PRODUCTS.length} productos...\n`);

  // Procesar en lotes de 5 para no saturar
  const BATCH = 5;
  for (let i = 0; i < PRODUCTS.length; i += BATCH) {
    const batch = PRODUCTS.slice(i, i + BATCH);
    await Promise.all(batch.map(async ({ handle, id }) => {
      const product = await fetchProductJSON(handle);
      if (!product) {
        console.log(`  ❌ No encontrado: ${handle}`);
        results[id] = { handle, precio: null, imagen: 'assets/images/placeholder.svg', nombre: handle };
        return;
      }
      const precio = product.variants?.[0]?.price
        ? parseFloat(product.variants[0].price)
        : null;
      const imgSrc = product.images?.[0]?.src || null;
      const ext = imgSrc ? (imgSrc.split('?')[0].split('.').pop().toLowerCase() || 'jpg') : 'jpg';
      const imgFile = `${id}.${ext}`;
      const ok = await downloadImage(imgSrc, imgFile);
      results[id] = {
        handle,
        nombre: product.title,
        precio,
        imagen: ok ? `assets/images/${imgFile}` : 'assets/images/placeholder.svg',
        imgSrc
      };
      console.log(`  ✅ ${product.title} — $${precio} — img: ${ok ? '✓' : '✗'}`);
    }));
  }

  // Guardar mapa de resultados
  fs.writeFileSync(
    path.join(__dirname, '../assets/js/product-data.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\n✅ Listo. Datos guardados en assets/js/product-data.json');
  const found = Object.values(results).filter(r => r.precio).length;
  const imgs = Object.values(results).filter(r => !r.imagen.includes('placeholder')).length;
  console.log(`   ${found}/${PRODUCTS.length} precios · ${imgs}/${PRODUCTS.length} imágenes`);
}

main().catch(console.error);
