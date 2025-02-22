export const INCOME_BRACKETS = [
  { max: 1000, needs: 85, wants: 10, savings: 5 },
  { max: 1300, needs: 80, wants: 12, savings: 8 },
  { max: 1600, needs: 75, wants: 15, savings: 10 },
  { max: 1900, needs: 70, wants: 16, savings: 14 },
  { max: 2300, needs: 65, wants: 17, savings: 18 },
  { max: 2800, needs: 60, wants: 18, savings: 22 },
  { max: 3500, needs: 55, wants: 20, savings: 25 },
  { max: 4500, needs: 50, wants: 22, savings: 28 },
  { max: 5500, needs: 45, wants: 24, savings: 31 },
  { max: 7000, needs: 40, wants: 24, savings: 36 },
  { max: 9000, needs: 35, wants: 28, savings: 39 },
  { max: 12000, needs: 30, wants: 29, savings: 41 },
];

export const NEEDS_CATEGORIES = [
  "Alimentation",
  "Auto & Transports",
  "Impôts & Taxes",
  "Internet / Téléphone mobile",
  "Logement",
  "Santé",
  "Scolarité & Enfants",
];

export const WANTS_CATEGORIES = [
  "Abonnements",
  "Achats & Shopping",
  "Divers",
  "Esthétique & Soins",
  "Loisirs & Sorties",
  "Restaurant",
  "Voyages",
];

export const SAVINGS_CATEGORIES = [
  "Dons et charité",
  "Épargne et investissements",
];

export const COLORS: Record<string, string> = {
  Abonnements: "bg-orange-400",
  Alimentation: "bg-amber-400",
  Divers: "bg-slate-400",
  Logement: "bg-stone-400",
  Restaurant: "bg-amber-400",
  Revenus: "bg-neutral-400",
  Santé: "bg-teal-400",
  Voyages: "bg-yellow-400",
  "Achats & Shopping": "bg-red-400",
  "Auto & Transports": "bg-blue-400",
  "Dons et charité": "bg-cyan-400",
  "Épargne et investissements": "bg-indigo-400",
  "Esthétique & Soins": "bg-pink-400",
  "Impôts & Taxes": "bg-green-400",
  "Internet / Téléphone mobile": "bg-orange-400",
  "Loisirs & Sorties": "bg-yellow-400",
  "Virement interne": "bg-sky-400",
  "Scolarité & Enfants": "bg-rose-400",
};
