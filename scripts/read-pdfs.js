// scripts/read-pdfs.js — Lee todos los PDFs y extrae texto
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '../docs');
const files = fs.readdirSync(DOCS).filter(f => f.endsWith('.pdf'));

async function readPDF(filename, maxPages = 15) {
  const buf = fs.readFileSync(path.join(DOCS, filename));
  const data = await pdf(buf, { max: maxPages });
  return { pages: data.numpages, text: data.text };
}

async function main() {
  for (const file of files) {
    if (file === 'CANALES MAYORISTAS 2026_MARZO.pdf') continue; // ya leído
    console.log('\n' + '='.repeat(60));
    console.log('PDF:', file);
    console.log('='.repeat(60));
    try {
      const { pages, text } = await readPDF(file, 12);
      console.log('Páginas totales:', pages);
      console.log(text.substring(0, 8000));
    } catch (e) {
      console.log('ERROR:', e.message);
    }
  }
}

main().catch(console.error);
