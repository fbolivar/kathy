# Ekaboutique Simulator

Simulación local del sitio Katheryn Boutique con asistente de IA integrado (Valentina).

## Requisitos

- Node.js 18+
- API Key de Anthropic (Claude)

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar API key
cp .env.example .env
# Editar .env y agregar tu ANTHROPIC_API_KEY

# 3. Iniciar servidor
npm run dev
```

## Abrir en el navegador

```
http://localhost:3000
```

## Páginas disponibles

| URL | Descripción |
|-----|-------------|
| `/index.html` | Home principal |
| `/colecciones.html` | Catálogo con filtros |
| `/colecciones.html?cat=Kit` | Solo kits |
| `/producto.html?id=s1` | Detalle de producto |

### IDs de productos de ejemplo

| ID | Producto |
|----|---------|
| `s1` | Shampoo Milagro Herbal |
| `s2` | Shampoo Anyeluz Rizos |
| `t1` | Bio Repolarizador Milagros |
| `t2` | Mascarilla Anyeluz Rizos |
| `o1` | Óleo Duveshi Brillo |
| `o2` | Óleo Arana Anti-caída |
| `ton1` | Tónico Milagros Crecimiento |
| `tp1` | Termoprotector Multibeneficios |
| `k1` | Kit Milagros Herbal |
| `k2` | Kit Anyeluz Rizos |

## Probar el asistente Valentina

1. Hacer clic en el botón 💬 (esquina inferior derecha)
2. Ejemplos de consultas:
   - "Tengo el cabello muy seco y se me cae mucho"
   - "Busco algo para definir mis rizos"
   - "Mi cabello está dañado por decoloración"
   - "¿Qué me recomiendas para cuero cabelludo graso?"
   - "¿Cuáles son los kits disponibles?"

## Notas de seguridad

- La API key **NUNCA** va en archivos `.html` o `.js` del cliente
- El servidor actúa como proxy seguro entre el navegador y la API de Anthropic
- El archivo `.env` está en `.gitignore` por defecto

## Estructura

```
ekaboutique-sim/
├── index.html          ← Home
├── colecciones.html    ← Catálogo con filtros
├── producto.html       ← Detalle de producto
├── assets/
│   ├── css/
│   │   ├── main.css    ← Estilos globales
│   │   └── chat.css    ← Estilos del asistente
│   ├── js/
│   │   ├── catalog.js  ← Base de datos de productos
│   │   ├── chat.js     ← Lógica del asistente IA
│   │   └── ui.js       ← Componentes compartidos
│   └── images/
│       └── placeholder.svg
├── server.js           ← Servidor Express + proxy API
├── package.json
└── .env.example
```
