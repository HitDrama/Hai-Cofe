import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SVG_DIR = join(ROOT, 'public/assets/svg');
const ICON_DIR = join(ROOT, 'public/assets/icons');
const CUP_DIR = join(ROOT, 'public/assets/img/cups');
const GARNISH_DIR = join(ROOT, 'public/assets/img/garnish');
const SCENE_DIR = join(ROOT, 'public/assets/img/scenes');

for (const dir of [SVG_DIR, ICON_DIR, CUP_DIR, GARNISH_DIR, SCENE_DIR]) {
  mkdirSync(dir, { recursive: true });
}

// 1. Brand Monogram Logo (&HAI / HAI COFE) - path-based for fill-to-stroke hover
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185 276" fill="none">
  <g class="brand-amp">
    <path d="M126.4 150.2c-9.2 9.4-21.5 14.8-36.2 14.8-24.8 0-43.6-16.4-43.6-38.9 0-17.8 11.4-30.5 31.2-40.8l-9.8-12.4c-7.6-9.6-11.8-18.8-11.8-29.2 0-18.6 14.8-31.7 35.4-31.7 18.8 0 32.2 11.4 32.2 27.6 0 14.9-9.8 25.8-27.8 34.4l28.8 36.2c6.2-8.8 11.2-19.6 14.2-31.4l12.6 3.4c-4.2 15.2-10.8 28.4-19.2 38.8l14.6 18.2c5.4 6.6 11.6 9.8 19.2 9.8 5.2 0 9.8-1.6 13.8-4.8l5.6 8.8c-6.8 6.4-15.6 9.8-25.8 9.8-12.4 0-22.4-5.2-30.6-15.4l-2.8-3.2zm-34.2-10.2c10.8 0 20.2-4.6 27.2-12.8L86.8 86.6c-14.6 8.2-22.6 18.2-22.6 32.2 0 15.8 11.4 26.2 28 26.2zm-1.2-116c-11.8 0-19.8 7.8-19.8 19.2 0 8.2 3.6 15.8 10.6 24.6l6.8 8.6c13.6-7.2 20.6-15.6 20.6-28.2 0-10.4-7.4-18.2-18.2-18.2z" fill="#000000" stroke-width="2.2"/>
    <path d="M142 36c8.5-9.5 22-11 28-4-4 11-15.5 16.5-28 4z" fill="#DDBB99" stroke-width="1.5"/>
  </g>
  <g class="brand-word">
    <path d="M22 208h10.2v24.4h23.6V208H66v56H55.8v-23.2H32.2V264H22v-56z" fill="#000000" stroke-width="1.8"/>
    <path d="M95.4 207.2h7.2L124.8 264h-10.8l-5.2-13.8H88.6L83.4 264H73.2l22.2-56.8zm3.4 14.8l-7.2 19.2h14.4l-7.2-19.2z" fill="#000000" stroke-width="1.8"/>
    <path d="M142.6 208h10.4v56h-10.4v-56z" fill="#000000" stroke-width="1.8"/>
  </g>
</svg>`;

writeFileSync(join(SVG_DIR, 'logo.svg'), logoSvg);
writeFileSync(join(SVG_DIR, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="32" fill="#F8F8F8"/>
  <ellipse cx="32" cy="32" rx="26" ry="18" transform="rotate(-18 32 32)" fill="none" stroke="#DDBB99" stroke-width="2"/>
  <text x="32" y="39" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#181818">&amp;H</text>
</svg>`);

// 2. Organic Hand-drawn Horizontal & Vertical Arrow Lines
let horiPath = 'M0,2.5 ';
for (let x = 0; x < 640; x += 16) {
  horiPath += `Q${x + 4},${(x % 32 === 0) ? 1.1 : 3.9} ${x + 8},2.5 T${x + 16},2.5 `;
}
writeFileSync(join(SVG_DIR, 'arrow_line.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 5" preserveAspectRatio="none">
  <path d="${horiPath.trim()}" fill="none" stroke="#000000" stroke-width="1.2" stroke-linecap="round"/>
</svg>`);

let verPath = 'M3,0 ';
for (let y = 0; y < 672; y += 16) {
  verPath += `Q${(y % 32 === 0) ? 1.5 : 4.5},${y + 4} 3,${y + 8} T3,${y + 16} `;
}
writeFileSync(join(SVG_DIR, 'arrow_line_ver.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 672" preserveAspectRatio="none">
  <path d="${verPath.trim()}" fill="none" stroke="#000000" stroke-width="1.2" stroke-linecap="round"/>
</svg>`);

// 3. 15 Minimal Editorial Craft Feature Icons
const featureIcons = {
  'cream-1': `<circle cx="12" cy="14" r="6" stroke="#C1A387" stroke-width="1.4"/><path d="M8 11c2-4 6-4 8 0" stroke="#282828" stroke-width="1.4" stroke-linecap="round"/>`,
  'cream-2': `<ellipse cx="12" cy="13" rx="8" ry="4.5" stroke="#282828" stroke-width="1.4"/><path d="M9 9.5c1.5-2.5 4.5-2.5 6 0" stroke="#C1A387" stroke-width="1.4" stroke-linecap="round"/>`,
  'cream-3': `<ellipse cx="12" cy="12" rx="5.5" ry="8" transform="rotate(-20 12 12)" stroke="#282828" stroke-width="1.4"/><path d="M10 6c2 4 1 8 3 12" stroke="#C1A387" stroke-width="1.3" stroke-linecap="round"/>`,
  'brew-1': `<path d="M6 17c2-8 8-11 13-11 0 6-4 11-13 11z" stroke="#282828" stroke-width="1.4"/><path d="M6 17l8-7" stroke="#C1A387" stroke-width="1.3" stroke-linecap="round"/>`,
  'brew-2': `<circle cx="12" cy="12" r="8" stroke="#C1A387" stroke-width="1.4"/><path d="M8.5 12.5l2.3 2.3 4.8-5" stroke="#282828" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  'brew-3': `<path d="M12 4v4M9 6l3 2 3-2M7 14c0 3 2.2 5 5 5s5-2 5-5c0-2.5-5-6-5-6s-5 3.5-5 6z" stroke="#282828" stroke-width="1.4" stroke-linecap="round"/>`,
  'fruit-1': `<circle cx="12" cy="13" r="7" stroke="#282828" stroke-width="1.4"/><path d="M12 6c1-2.5 3.5-3 5-2M12 13l4.5-4.5M12 13l-4.5 3.5" stroke="#C1A387" stroke-width="1.3" stroke-linecap="round"/>`,
  'fruit-2': `<rect x="7" y="5" width="10" height="14" rx="3" stroke="#282828" stroke-width="1.4"/><circle cx="10.5" cy="14.5" r="1.2" fill="#C1A387"/><circle cx="13.5" cy="12" r="1.2" fill="#C1A387"/><circle cx="11" cy="9.5" r="1" fill="#C1A387"/>`,
  'fruit-3': `<path d="M7 14a5 5 0 0 0 10 0H7z" stroke="#282828" stroke-width="1.4"/><path d="M12 5v5M9 7l3 3 3-3" stroke="#C1A387" stroke-width="1.4" stroke-linecap="round"/>`,
  'milk-1': `<path d="M8 14c2-2 4 2 6 0s3-2 4-1" stroke="#C1A387" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="8" stroke="#282828" stroke-width="1.3"/>`,
  'milk-2': `<path d="M9 5h6l1.5 4v9a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 18V9L9 5z" stroke="#282828" stroke-width="1.4"/><path d="M7.5 12h9" stroke="#C1A387" stroke-width="1.3"/>`,
  'milk-3': `<path d="M6 16c3-7 7-10 12-10-1 6-5 10-12 10z" stroke="#282828" stroke-width="1.4"/><circle cx="15" cy="15" r="2.5" stroke="#C1A387" stroke-width="1.3"/>`,
  'seasonal-1': `<path d="M12 4l1.8 4.6L18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.4L12 4z" stroke="#282828" stroke-width="1.3" stroke-linejoin="round"/><circle cx="17.5" cy="17.5" r="1.5" fill="#C1A387"/>`,
  'seasonal-2': `<path d="M5 13c3-3 5 3 8 0s4-3 6 0" stroke="#282828" stroke-width="1.4" stroke-linecap="round"/><path d="M5 17c3-3 5 3 8 0s4-3 6 0" stroke="#C1A387" stroke-width="1.4" stroke-linecap="round"/>`,
  'seasonal-3': `<circle cx="12" cy="12" r="7.5" stroke="#282828" stroke-width="1.4"/><path d="M12 4.5v15M4.5 12h15" stroke="#C1A387" stroke-width="1.2"/>`,
};

for (const [name, inner] of Object.entries(featureIcons)) {
  writeFileSync(
    join(ICON_DIR, `${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${inner}</svg>`
  );
}

// 4. Studio Transparent-Background Beverage Cups (High-detail layered SVG renders)
function createCupSvg({
  id,
  liquidTop,
  liquidMid,
  liquidBottom,
  foamColor = '#FAF5EA',
  foamAccent = '#6B442A',
  foamStyle = 'cream', // 'cream' | 'clear' | 'fruit' | 'swirl' | 'salt'
  garnish = 'cacao',   // 'cacao' | 'leaf' | 'citrus' | 'latte' | 'yuzu' | 'oreo' | 'pearl'
  labelSub = 'BREWED DAILY',
}) {
  const garnishMarkup = {
    cacao: `
      <ellipse cx="210" cy="126" rx="108" ry="22" fill="${foamColor}"/>
      <ellipse cx="210" cy="123" rx="96" ry="16" fill="#EFE4D2" opacity="0.7"/>
      <g fill="${foamAccent}" opacity="0.82">
        <circle cx="165" cy="120" r="2.2"/><circle cx="182" cy="126" r="1.6"/><circle cx="198" cy="117" r="2.5"/>
        <circle cx="214" cy="124" r="2"/><circle cx="232" cy="119" r="2.8"/><circle cx="248" cy="125" r="1.8"/>
        <circle cx="176" cy="115" r="1.4"/><circle cx="222" cy="114" r="1.7"/><circle cx="205" cy="129" r="1.5"/>
        <circle cx="258" cy="120" r="2.1"/><circle cx="152" cy="124" r="1.9"/><circle cx="239" cy="128" r="1.4"/>
      </g>`,
    cream: `
      <ellipse cx="210" cy="126" rx="108" ry="22" fill="#FFFDF8"/>
      <path d="M122 126c24-14 58-18 92-12 28 5 56 2 84-6" stroke="#EFE5D4" stroke-width="5" stroke-linecap="round" fill="none"/>`,
    leaf: `
      <ellipse cx="210" cy="128" rx="106" ry="19" fill="${liquidTop}" opacity="0.85"/>
      <path d="M206 118c12-18 32-22 44-16-4 16-18 24-44 16z" fill="#6F8A5E"/>
      <path d="M206 118c-10-12-26-14-35-8 4 12 16 17 35 8z" fill="#88A376"/>`,
    citrus: `
      <ellipse cx="210" cy="128" rx="106" ry="19" fill="#FFE6B8" opacity="0.9"/>
      <g transform="translate(232 118) rotate(-18)">
        <circle cx="0" cy="0" r="34" fill="#F49D37"/>
        <circle cx="0" cy="0" r="29" fill="#FFD17A"/>
        <path d="M0 -27v54M-27 0h54M-19 -19l38 38M-19 19l38-38" stroke="#FFF6E5" stroke-width="2"/>
      </g>
      <circle cx="175" cy="245" r="26" fill="#F27D52" opacity="0.45"/>`,
    latte: `
      <ellipse cx="210" cy="126" rx="108" ry="21" fill="#FCF9F2"/>
      <path d="M130 190c35 28 62-18 98 12 24 20 48-8 66 8v120H126V190z" fill="#FAF6EE" opacity="0.62"/>
      <path d="M138 255c32-22 72 26 112-4 18-13 30-4 40 6v95H138v-97z" fill="#F7F1E5" opacity="0.42"/>`,
    yuzu: `
      <ellipse cx="210" cy="126" rx="108" ry="21" fill="#FFFDF7"/>
      <g fill="#E6B84C">
        <circle cx="184" cy="122" r="2.3"/><circle cx="198" cy="118" r="2"/><circle cx="215" cy="125" r="2.4"/>
        <circle cx="229" cy="120" r="1.8"/><circle cx="242" cy="124" r="2.1"/>
      </g>
      <g fill="#FFFFFF" opacity="0.95">
        <rect x="172" y="121" width="3.5" height="3.5" transform="rotate(22 172 121)"/>
        <rect x="206" y="119" width="3.5" height="3.5" transform="rotate(15 206 119)"/>
        <rect x="235" y="122" width="3.5" height="3.5" transform="rotate(38 235 122)"/>
      </g>`,
    oreo: `
      <ellipse cx="210" cy="125" rx="109" ry="23" fill="#F5EBDD"/>
      <g fill="#2E211B">
        <polygon points="168,118 180,113 185,123 172,127"/>
        <polygon points="204,114 218,111 222,122 208,125"/>
        <polygon points="236,118 249,115 252,125 239,128"/>
        <circle cx="192" cy="125" r="3"/><circle cx="227" cy="126" r="2.6"/><circle cx="158" cy="124" r="2.4"/>
      </g>`,
    pearl: `
      <ellipse cx="210" cy="126" rx="108" ry="20" fill="#F8EFE2"/>
      <g fill="#2B1B14" opacity="0.88">
        <circle cx="164" cy="448" r="11"/><circle cx="189" cy="454" r="11.5"/><circle cx="215" cy="450" r="11"/>
        <circle cx="240" cy="453" r="11"/><circle cx="261" cy="445" r="10.5"/>
        <circle cx="176" cy="432" r="10.5"/><circle cx="203" cy="434" r="11"/><circle cx="229" cy="433" r="10.5"/><circle cx="251" cy="427" r="10"/>
      </g>`,
  }[garnish] || '';

  const foamBand = foamStyle === 'clear'
    ? ''
    : `<path d="M103 128h214l-6 66c-38 10-72-8-106 4-34 11-66-4-96 2l-6-72z" fill="${foamColor}" opacity="0.96"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560" fill="none">
  <defs>
    <linearGradient id="liq-${id}" x1="210" y1="125" x2="210" y2="475" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${liquidTop}"/>
      <stop offset="52%" stop-color="${liquidMid}"/>
      <stop offset="100%" stop-color="${liquidBottom}"/>
    </linearGradient>
    <linearGradient id="glass-${id}" x1="96" y1="120" x2="324" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.52"/>
      <stop offset="18%" stop-color="#FFFFFF" stop-opacity="0.14"/>
      <stop offset="82%" stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.38"/>
    </linearGradient>
    <radialGradient id="shadow-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1E1610" stop-opacity="0.22"/>
      <stop offset="65%" stop-color="#1E1610" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#1E1610" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="cupClip-${id}">
      <path d="M102 126h216l-29 332c-2 20-19 35-39 35H170c-20 0-37-15-39-35L102 126z"/>
    </clipPath>
  </defs>

  <!-- Soft studio ground shadow -->
  <ellipse cx="210" cy="502" rx="112" ry="22" fill="url(#shadow-${id})"/>

  <!-- Cup body clipped -->
  <g clip-path="url(#cupClip-${id})">
    <rect x="96" y="124" width="228" height="375" fill="url(#liq-${id})"/>

    <!-- Translucent ice cubes -->
    <g fill="#FFFFFF" opacity="0.22" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.2">
      <rect x="138" y="205" width="46" height="42" rx="9" transform="rotate(-11 138 205)"/>
      <rect x="218" y="196" width="50" height="44" rx="10" transform="rotate(14 218 196)"/>
      <rect x="172" y="256" width="48" height="44" rx="10" transform="rotate(7 172 256)"/>
    </g>

    ${foamBand}
    ${garnish === 'latte' || garnish === 'pearl' ? garnishMarkup : ''}

    <!-- Minimalist Editorial Cup Label -->
    <g transform="translate(210 326)">
      <rect x="-48" y="-44" width="96" height="88" rx="2" fill="#FBF9F5" opacity="0.92"/>
      <ellipse cx="0" cy="-6" rx="28" ry="17" transform="rotate(-15)" fill="none" stroke="#DDBB99" stroke-width="1"/>
      <text x="0" y="-1" text-anchor="middle" font-family="Georgia, 'Bellefair', serif" font-size="16" letter-spacing="2" fill="#181818">&amp;HAI</text>
      <line x1="-18" y1="15" x2="18" y2="15" stroke="#C1A387" stroke-width="0.8"/>
      <text x="0" y="28" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="6.5" letter-spacing="1.6" fill="#6E6256">${labelSub}</text>
    </g>

    <!-- Specular glass sheen -->
    <rect x="96" y="120" width="228" height="380" fill="url(#glass-${id})"/>
    <path d="M118 145l24 328" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.38"/>
    <path d="M300 148l-22 322" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.24"/>
  </g>

  <!-- Cup Rim & Top Surface -->
  ${garnish !== 'latte' && garnish !== 'pearl' ? garnishMarkup : `<ellipse cx="210" cy="126" rx="108" ry="20" fill="${foamColor}"/>`}
  <ellipse cx="210" cy="126" rx="110" ry="22" stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="3"/>
  <ellipse cx="210" cy="126" rx="112" ry="23.5" stroke="#D9CFC3" stroke-opacity="0.65" stroke-width="1.2"/>
  <path d="M102 126l29 332c2 20 19 35 39 35h80c20 0 37-15 39-35l29-332" stroke="#E5DDD2" stroke-opacity="0.7" stroke-width="1.4"/>
</svg>`;
}

const cups = [
  {
    file: 'hero-cacao-earl.svg',
    id: 'hero',
    liquidTop: '#C58B59',
    liquidMid: '#8C4F2B',
    liquidBottom: '#4A2512',
    foamColor: '#FBF6EC',
    foamAccent: '#4B2E1E',
    foamStyle: 'cream',
    garnish: 'cacao',
    labelSub: 'CACAO EARL CREAM',
  },
  {
    file: 'cup-1-salted-cream.svg',
    id: 'c1',
    liquidTop: '#DFB66E',
    liquidMid: '#C28E42',
    liquidBottom: '#8C5B20',
    foamColor: '#FFFDF8',
    foamStyle: 'cream',
    garnish: 'cream',
    labelSub: 'SALTED CREAM',
  },
  {
    file: 'cup-2-pure-brew.svg',
    id: 'c2',
    liquidTop: '#D49A56',
    liquidMid: '#9B5B27',
    liquidBottom: '#592E10',
    foamColor: '#E5B275',
    foamStyle: 'clear',
    garnish: 'leaf',
    labelSub: 'COLD BREW OOLONG',
  },
  {
    file: 'cup-3-fruit-tea.svg',
    id: 'c3',
    liquidTop: '#F7C654',
    liquidMid: '#EB8B38',
    liquidBottom: '#C9562B',
    foamColor: '#FFE8B8',
    foamStyle: 'clear',
    garnish: 'citrus',
    labelSub: 'TROPICAL POMELO',
  },
  {
    file: 'cup-4-cloud-latte.svg',
    id: 'c4',
    liquidTop: '#D6A97A',
    liquidMid: '#B88456',
    liquidBottom: '#8A5A36',
    foamColor: '#FCF8F0',
    foamStyle: 'cream',
    garnish: 'latte',
    labelSub: 'CLOUD MILK COFE',
  },
  {
    file: 'cup-5-sea-salt-yuzu.svg',
    id: 'c5',
    liquidTop: '#F2D57E',
    liquidMid: '#DDA94B',
    liquidBottom: '#B57B28',
    foamColor: '#FFFDF6',
    foamStyle: 'cream',
    garnish: 'yuzu',
    labelSub: 'FLEUR DE SEL YUZU',
  },
  {
    file: 'cup-6-cacao-whisky.svg',
    id: 'c6',
    liquidTop: '#9A6848',
    liquidMid: '#683E26',
    liquidBottom: '#3A1F12',
    foamColor: '#F5EBDD',
    foamStyle: 'cream',
    garnish: 'oreo',
    labelSub: 'CACAO MACCHIATO',
  },
  {
    file: 'cup-7-buckwheat-pearl.svg',
    id: 'c7',
    liquidTop: '#CFA374',
    liquidMid: '#9E7047',
    liquidBottom: '#694324',
    foamColor: '#F8EFE2',
    foamStyle: 'cream',
    garnish: 'pearl',
    labelSub: 'BUCKWHEAT PEARL',
  },
];

for (const c of cups) {
  writeFileSync(join(CUP_DIR, c.file), createCupSvg(c));
}

// Wide Close-up Cream Rim Cups for Drinks Page (.cream_bigcup)
function createWideCreamCup({ id, baseColor, swirlColor, toppingMarkup }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 340" fill="none">
  <defs>
    <linearGradient id="wbody-${id}" x1="320" y1="80" x2="320" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFDF9"/>
      <stop offset="55%" stop-color="${baseColor}"/>
      <stop offset="100%" stop-color="${swirlColor}"/>
    </linearGradient>
  </defs>
  <path d="M130 118h380l-28 222H158L130 118z" fill="url(#wbody-${id})"/>
  <ellipse cx="320" cy="118" rx="190" ry="52" fill="#FFFDF8"/>
  <ellipse cx="320" cy="115" rx="172" ry="42" fill="${baseColor}" opacity="0.55"/>
  <path d="M185 116c45-24 105-28 165-14 38 9 72 4 102-8" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.85"/>
  ${toppingMarkup}
  <ellipse cx="320" cy="118" rx="192" ry="54" stroke="#E8DFD3" stroke-width="3"/>
  <path d="M130 118l28 222M510 118l-28 222" stroke="#DFD5C7" stroke-width="2"/>
</svg>`;
}

writeFileSync(join(CUP_DIR, 'cream-1-salted.svg'), createWideCreamCup({
  id: 'cr1',
  baseColor: '#F7EFE0',
  swirlColor: '#C8965E',
  toppingMarkup: `<g fill="#FFFFFF" opacity="0.95">
    <rect x="255" y="104" width="6" height="6" transform="rotate(20 255 104)"/>
    <rect x="312" y="98" width="5" height="5" transform="rotate(35 312 98)"/>
    <rect x="368" y="110" width="6" height="6" transform="rotate(12 368 110)"/>
    <rect x="285" y="122" width="5" height="5" transform="rotate(42 285 122)"/>
  </g>`,
}));

writeFileSync(join(CUP_DIR, 'cream-2-cheese-lime.svg'), createWideCreamCup({
  id: 'cr2',
  baseColor: '#FAF2D6',
  swirlColor: '#D1A04E',
  toppingMarkup: `<g stroke="#6B9E48" stroke-width="2.6" stroke-linecap="round">
    <path d="M245 106c6-4 12-2 16 3"/><path d="M295 96c8-3 14 1 17 6"/><path d="M352 108c7-5 13-3 18 2"/>
    <path d="M275 124c6-3 11 0 14 5"/><path d="M332 122c7-2 12 2 14 7"/>
  </g>
  <g fill="#F0C965" opacity="0.85">
    <circle cx="268" cy="110" r="3"/><circle cx="318" cy="112" r="3.5"/><circle cx="375" cy="118" r="2.8"/>
  </g>`,
}));

writeFileSync(join(CUP_DIR, 'cream-3-brulee.svg'), createWideCreamCup({
  id: 'cr3',
  baseColor: '#F3DEC0',
  swirlColor: '#A66A38',
  toppingMarkup: `<ellipse cx="320" cy="116" rx="150" ry="34" fill="#D58E43" opacity="0.45"/>
  <path d="M210 112c38-12 88 14 136-4 28-10 54 2 76 6" stroke="#8C4A19" stroke-width="5" stroke-linecap="round" opacity="0.55"/>`,
}));

writeFileSync(join(CUP_DIR, 'cream-4-cacao.svg'), createWideCreamCup({
  id: 'cr4',
  baseColor: '#DFCBB8',
  swirlColor: '#694028',
  toppingMarkup: `<ellipse cx="320" cy="116" rx="156" ry="36" fill="#5A3521" opacity="0.72"/>
  <g fill="#381E10">
    <circle cx="250" cy="110" r="3.5"/><circle cx="288" cy="102" r="3"/><circle cx="326" cy="118" r="4"/>
    <circle cx="364" cy="108" r="3.2"/><circle cx="395" cy="118" r="2.8"/><circle cx="298" cy="126" r="2.6"/>
  </g>`,
}));

// 5. Animated Floating Garnishes (.cir_gifimg)
const garnishes = {
  'garnish-cream.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" fill="none">
    <style>
      @keyframes floatSlow { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(4deg); } }
      @keyframes floatAlt { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(8px) rotate(-5deg); } }
      .g1 { animation: floatSlow 3.6s ease-in-out infinite; transform-origin: center; }
      .g2 { animation: floatAlt 4.2s ease-in-out infinite; transform-origin: center; }
    </style>
    <g class="g1">
      <path d="M88 128c14-26 48-28 62-4 10 18-10 32-32 30-20-2-38-12-30-26z" fill="#FFFDF8" stroke="#E6D6C3" stroke-width="1.5"/>
      <circle cx="158" cy="76" r="5" fill="#DDBB99"/>
      <circle cx="74" cy="88" r="3.5" fill="#C1A387"/>
    </g>
    <g class="g2">
      <path d="M148 56l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8z" fill="#DDBB99"/>
      <circle cx="116" cy="64" r="4" fill="#FFFDF8" stroke="#DDBB99" stroke-width="1.2"/>
      <circle cx="182" cy="126" r="3" fill="#C1A387"/>
    </g>
  </svg>`,
  'garnish-brew.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" fill="none">
    <style>
      @keyframes driftA { 0%,100% { transform: translateY(0px) rotate(-6deg); } 50% { transform: translateY(-12px) rotate(6deg); } }
      @keyframes driftB { 0%,100% { transform: translateY(0px) rotate(8deg); } 50% { transform: translateY(9px) rotate(-6deg); } }
      .b1 { animation: driftA 3.8s ease-in-out infinite; transform-origin: 110px 110px; }
      .b2 { animation: driftB 4.4s ease-in-out infinite; transform-origin: 165px 90px; }
    </style>
    <g class="b1">
      <ellipse cx="96" cy="112" rx="14" ry="20" transform="rotate(-28 96 112)" fill="#5C3822"/>
      <path d="M89 98c6 9 5 18 13 27" stroke="#DDBB99" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M132 146c14-22 38-26 52-18-6 18-22 28-52 18z" fill="#6D865C"/>
    </g>
    <g class="b2">
      <ellipse cx="166" cy="76" rx="12" ry="17" transform="rotate(24 166 76)" fill="#4A2B18"/>
      <path d="M168 62c-4 9-2 17-5 27" stroke="#C1A387" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="126" cy="64" r="3" fill="#DDBB99"/>
    </g>
  </svg>`,
  'garnish-fruit.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" fill="none">
    <style>
      @keyframes citrusFloat { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-11px) rotate(8deg); } }
      .f1 { animation: citrusFloat 3.5s ease-in-out infinite; transform-origin: 130px 110px; }
    </style>
    <g class="f1">
      <circle cx="118" cy="108" r="32" fill="#F29B38"/>
      <circle cx="118" cy="108" r="27" fill="#FFD482"/>
      <path d="M118 81v54M91 108h54M99 89l38 38M99 127l38-38" stroke="#FFF9EC" stroke-width="2"/>
      <circle cx="172" cy="76" r="10" fill="#E86F52"/>
      <path d="M158 142c12-16 28-18 38-10-4 13-16 19-38 10z" fill="#779862"/>
    </g>
  </svg>`,
  'garnish-milk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" fill="none">
    <style>
      @keyframes dropFloat { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-9px) scale(1.04); } }
      .m1 { animation: dropFloat 3.9s ease-in-out infinite; transform-origin: center; }
    </style>
    <g class="m1">
      <path d="M130 58c0 0-24 30-24 46a24 24 0 0 0 48 0c0-16-24-46-24-46z" fill="#FFFDF9" stroke="#E2D4C3" stroke-width="1.6"/>
      <circle cx="84" cy="126" r="8" fill="#FFFDF9" stroke="#DDBB99" stroke-width="1.4"/>
      <circle cx="176" cy="96" r="6" fill="#FFFDF9" stroke="#DDBB99" stroke-width="1.4"/>
    </g>
  </svg>`,
  'garnish-yuzu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" fill="none">
    <style>
      @keyframes saltFloat { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-6deg); } }
      .s1 { animation: saltFloat 3.7s ease-in-out infinite; transform-origin: center; }
    </style>
    <g class="s1">
      <circle cx="136" cy="108" r="24" fill="#F2C957"/>
      <circle cx="136" cy="108" r="19" fill="#FFF1B8"/>
      <rect x="82" y="84" width="9" height="9" transform="rotate(28 82 84)" fill="#FFFFFF" stroke="#DDBB99" stroke-width="1.2"/>
      <rect x="176" y="76" width="8" height="8" transform="rotate(15 176 76)" fill="#FFFFFF" stroke="#DDBB99" stroke-width="1.2"/>
      <path d="M96 146l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#DDBB99"/>
    </g>
  </svg>`,
};

for (const [file, svg] of Object.entries(garnishes)) {
  writeFileSync(join(GARNISH_DIR, file), svg);
}

// 6. Editorial Botanical & Architectural Scene Artworks (SVG high-craft compositions for banners/cards + fallbacks)
function createEditorialScene({ bg, accent1, accent2, dark, motif, width = 1200, height = 900 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${accent1}"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="72%" cy="24%" r="58%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#sunGlow)"/>
  <!-- Architectural shadow blinds -->
  <g fill="${dark}" opacity="0.045">
    <polygon points="0,120 ${width},0 ${width},90 0,210"/>
    <polygon points="0,310 ${width},190 ${width},280 0,400"/>
    <polygon points="0,500 ${width},380 ${width},470 0,590"/>
  </g>
  ${motif}
</svg>`;
}

const sceneDefs = {
  'fruit-harvest.svg': createEditorialScene({
    bg: '#F4EFE6',
    accent1: '#E6D5BE',
    accent2: '#D99B52',
    dark: '#3A2A1D',
    motif: `
      <ellipse cx="600" cy="490" rx="340" ry="210" transform="rotate(-12 600 490)" fill="#FBF8F3" stroke="#DDBB99" stroke-width="2"/>
      <circle cx="510" cy="460" r="96" fill="#E89A48" opacity="0.88"/>
      <circle cx="510" cy="460" r="80" fill="#F9CF86"/>
      <circle cx="675" cy="505" r="74" fill="#DF6E4B" opacity="0.82"/>
      <path d="M560 340c40-65 118-78 164-48-18 58-72 86-164 48z" fill="#6E875D" opacity="0.85"/>
      <ellipse cx="600" cy="450" rx="410" ry="250" transform="rotate(-16 600 450)" stroke="#C1A387" stroke-width="1.4"/>`,
  }),
  'banner-terroir.svg': createEditorialScene({
    bg: '#EAE3D7',
    accent1: '#D5C3AC',
    accent2: '#8C6D4F',
    dark: '#231B14',
    width: 1600,
    height: 900,
    motif: `
      <path d="M0 640 Q420 470 860 590 T1600 510 L1600 900 L0 900 Z" fill="#C9B398" opacity="0.45"/>
      <path d="M0 720 Q520 560 1040 680 T1600 630 L1600 900 L0 900 Z" fill="#B09476" opacity="0.42"/>
      <circle cx="1180" cy="270" r="130" fill="#FFFDF8" opacity="0.65"/>
      <ellipse cx="800" cy="450" rx="520" ry="210" transform="rotate(-8 800 450)" stroke="#FFFDF8" stroke-width="1.5" opacity="0.7"/>`,
  }),
  'store-arch.svg': createEditorialScene({
    bg: '#ECEAE4',
    accent1: '#DCD6CA',
    accent2: '#C1A387',
    dark: '#28231E',
    width: 900,
    height: 1100,
    motif: `
      <path d="M190 980 V410 A260 260 0 0 1 710 410 V980 Z" fill="#F8F6F1" stroke="#D5C5B2" stroke-width="2"/>
      <rect x="260" y="650" width="380" height="220" fill="#E2D6C5"/>
      <ellipse cx="450" cy="650" rx="190" ry="26" fill="#EFE7DB" stroke="#C1A387" stroke-width="1.5"/>
      <line x1="450" y1="150" x2="450" y2="360" stroke="#C1A387" stroke-width="1.5"/>
      <circle cx="450" cy="380" r="24" fill="#FFFDF8" stroke="#DDBB99" stroke-width="1.5"/>`,
  }),
  'news-1-winter-menu.svg': createEditorialScene({
    bg: '#F3ECE2', accent1: '#DFCBB3', accent2: '#8C5A36', dark: '#2A1D15',
    motif: `<ellipse cx="600" cy="450" rx="280" ry="190" transform="rotate(-14 600 450)" fill="#FBF8F3" stroke="#C1A387" stroke-width="2"/>
      <circle cx="600" cy="450" r="115" fill="#6E4429"/><circle cx="600" cy="450" r="92" fill="#F7EFE2"/>`,
  }),
  'news-2-osmanthus.svg': createEditorialScene({
    bg: '#F7F1E3', accent1: '#E9D9B8', accent2: '#D9A84E', dark: '#2E2416',
    motif: `<circle cx="600" cy="450" r="180" fill="#FFFDF7" stroke="#DDBB99" stroke-width="2"/>
      <g fill="#E3AE42"><circle cx="550" cy="420" r="12"/><circle cx="615" cy="395" r="10"/><circle cx="645" cy="465" r="14"/><circle cx="575" cy="485" r="11"/></g>`,
  }),
  'news-3-pomelo.svg': createEditorialScene({
    bg: '#EEF5F2', accent1: '#D5E6DF', accent2: '#E58F56', dark: '#1E2D28',
    motif: `<circle cx="580" cy="450" r="150" fill="#F4A259" opacity="0.85"/><circle cx="580" cy="450" r="126" fill="#FFE0A3"/>
      <ellipse cx="650" cy="470" rx="260" ry="150" transform="rotate(-18 650 470)" stroke="#C1A387" stroke-width="2"/>`,
  }),
  'news-4-summer-cream.svg': createEditorialScene({
    bg: '#FDF7EC', accent1: '#EFE0C6', accent2: '#C1A387', dark: '#2B2219',
    motif: `<rect x="440" y="230" width="320" height="440" rx="160" fill="#FFFDF9" stroke="#DDBB99" stroke-width="2"/>
      <circle cx="600" cy="390" r="88" fill="#F2C572" opacity="0.75"/>`,
  }),
  'news-5-malt-reserve.svg': createEditorialScene({
    bg: '#EFE8E1', accent1: '#D4C2B2', accent2: '#6E4228', dark: '#22160F',
    motif: `<ellipse cx="600" cy="450" rx="310" ry="180" transform="rotate(12 600 450)" stroke="#8C6D4F" stroke-width="2"/>
      <circle cx="600" cy="450" r="120" fill="#5A3520" opacity="0.88"/><circle cx="635" cy="420" r="36" fill="#F5E9D8" opacity="0.75"/>`,
  }),
  'dna-1.svg': createEditorialScene({
    bg: '#EFEBE4', accent1: '#DDD3C5', accent2: '#C1A387', dark: '#282828', width: 300, height: 300,
    motif: `<circle cx="150" cy="150" r="84" fill="#FBF9F5" stroke="#DDBB99" stroke-width="2"/><ellipse cx="150" cy="150" rx="28" ry="42" transform="rotate(-24 150 150)" fill="#6B442A"/>`,
  }),
  'dna-2.svg': createEditorialScene({
    bg: '#F4EFE6', accent1: '#E4D5BF', accent2: '#8C6D4F', dark: '#282828', width: 300, height: 300,
    motif: `<path d="M85 205c22-72 78-96 130-88-12 64-56 98-130 88z" fill="#6F8A5E"/><ellipse cx="150" cy="150" rx="110" ry="72" transform="rotate(-18 150 150)" stroke="#C1A387" stroke-width="2"/>`,
  }),
  'dna-3.svg': createEditorialScene({
    bg: '#F7F3EC', accent1: '#E6DAC8', accent2: '#DDBB99', dark: '#282828', width: 300, height: 300,
    motif: `<circle cx="128" cy="150" r="56" stroke="#282828" stroke-width="1.8"/><circle cx="172" cy="150" r="56" stroke="#C1A387" stroke-width="1.8"/>`,
  }),
  'dna-4.svg': createEditorialScene({
    bg: '#EFEAE2', accent1: '#DFD2C0', accent2: '#C1A387', dark: '#282828', width: 300, height: 300,
    motif: `<rect x="92" y="74" width="116" height="152" rx="58" fill="#FFFDF9" stroke="#DDBB99" stroke-width="2"/><circle cx="150" cy="136" r="28" fill="#D49A56"/>`,
  }),
};

for (const [file, svg] of Object.entries(sceneDefs)) {
  writeFileSync(join(SCENE_DIR, file), svg);
}

// Also create fallback SVG scenes if AI pngs aren't ready yet
for (const fallback of ['hero-craft.svg', 'craft-roast.svg', 'craft-cream.svg', 'store-interior.svg']) {
  if (!existsSync(join(SCENE_DIR, fallback))) {
    writeFileSync(join(SCENE_DIR, fallback), sceneDefs['store-arch.svg']);
  }
}

console.log('Generated all SVG logos, arrows, icons, cups, garnishes, and editorial scenes.');

