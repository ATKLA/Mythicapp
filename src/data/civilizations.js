const CIVILIZATIONS = [
  { id: "todas", label: "Todas" },
  { id: "egipcia", label: "Egipcia" },
  { id: "griega", label: "Griega" },
  { id: "romana", label: "Romana" },
  { id: "vikinga", label: "Vikinga" },
];

const CIV_ORDER = ["egipcia", "griega", "romana", "vikinga"];

const CIV_SIGILS = {
  egipcia: "𓂀",
  griega: "Ω",
  romana: "⚜",
  vikinga: "ᚱ",
};

// Civilization accent colors live in CSS custom properties so each theme
// (dark/light) can supply contrast-safe values. Components consume the vars.
const CIV_COLORS = {
  egipcia: "var(--civ-egipcia)",
  griega: "var(--civ-griega)",
  romana: "var(--civ-romana)",
  vikinga: "var(--civ-vikinga)",
};

const CIV_META = {
  egipcia: { fullName: "Antiguo Egipto", epoch: "3100 a.C. – 30 a.C.", region: "Valle del Nilo",
    quote: "Yo soy el ayer, el hoy y el mañana.", quoteSource: "Libro de los Muertos" },
  griega: { fullName: "Hélade", epoch: "1200 a.C. – 146 a.C.", region: "Mediterráneo oriental",
    quote: "De los inmortales nacen los héroes, y de los héroes los hombres.", quoteSource: "Tradición homérica" },
  romana: { fullName: "Imperio Romano", epoch: "753 a.C. – 476 d.C.", region: "Lacio y todo el orbe conocido",
    quote: "Tantae molis erat Romanam condere gentem.", quoteSource: "Virgilio, Eneida" },
  vikinga: { fullName: "Mundo nórdico", epoch: "793 – 1066 d.C.", region: "Escandinavia e Islandia",
    quote: "El ganado muere; solo el buen nombre nunca muere.", quoteSource: "Hávamál" },
};

export { CIVILIZATIONS, CIV_ORDER, CIV_SIGILS, CIV_COLORS, CIV_META };
