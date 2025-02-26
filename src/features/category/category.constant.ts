import {
  ArrowUpDownIcon,
  CarFrontIcon,
  ChefHatIcon,
  GlobeIcon,
  HandshakeIcon,
  HeartPulseIcon,
  HouseIcon,
  LayersIcon,
  LucideProps,
  PartyPopperIcon,
  PiggyBankIcon,
  PlaneTakeoffIcon,
  ReceiptTextIcon,
  SchoolIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  SparklesIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const ICONS: Record<
  string,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
> = {
  Abonnements: SmartphoneIcon,
  Alimentation: UtensilsIcon,
  Divers: LayersIcon,
  Logement: HouseIcon,
  Restaurant: ChefHatIcon,
  Revenus: WalletIcon,
  Santé: HeartPulseIcon,
  Voyages: PlaneTakeoffIcon,
  "Achats & Shopping": ShoppingBagIcon,
  "Auto & Transports": CarFrontIcon,
  "Dons et charité": HandshakeIcon,
  "Épargne et investissements": PiggyBankIcon,
  "Esthétique & Soins": SparklesIcon,
  "Impôts & Taxes": ReceiptTextIcon,
  "Internet / Téléphone mobile": GlobeIcon,
  "Loisirs & Sorties": PartyPopperIcon,
  "Virement interne": ArrowUpDownIcon,
  "Scolarité & Enfants": SchoolIcon,
};

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
  "Dons et charité",
  "Esthétique & Soins",
  "Loisirs & Sorties",
  "Restaurant",
  "Voyages",
];

export const SAVINGS_CATEGORIES = ["Épargne et investissements"];

export const COLORS: Record<string, { cn: string; oklch: string }> = {
  Abonnements: { cn: "bg-orange-400", oklch: "oklch(.75 .183 55.934)" },
  Alimentation: { cn: "bg-amber-400", oklch: "oklch(.828 .189 84.429)" },
  Divers: { cn: "bg-slate-400", oklch: "oklch(.704 .04 256.788)" },
  Logement: { cn: "bg-stone-400", oklch: "oklch(.709 .01 56.259)" },
  Restaurant: { cn: "bg-amber-400", oklch: "oklch(.828 .189 84.429)" },
  Revenus: { cn: "bg-neutral-400", oklch: "oklch(.708 0 0)" },
  Santé: { cn: "bg-teal-400", oklch: "oklch(.777 .152 181.912)" },
  Voyages: { cn: "bg-yellow-400", oklch: "oklch(.852 .199 91.936)" },
  "Achats & Shopping": { cn: "bg-red-400", oklch: "oklch(.704 .191 22.216)" },
  "Auto & Transports": { cn: "bg-blue-400", oklch: "oklch(.707 .165 254.624)" },
  "Dons et charité": { cn: "bg-cyan-400", oklch: "oklch(.789 .154 211.53)" },
  "Épargne et investissements": {
    cn: "bg-indigo-400",
    oklch: "oklch(.673 .182 276.935)",
  },
  "Esthétique & Soins": {
    cn: "bg-pink-400",
    oklch: "oklch(.718 .202 349.761)",
  },
  "Impôts & Taxes": { cn: "bg-green-400", oklch: "oklch(.792 .209 151.711)" },
  "Internet / Téléphone mobile": {
    cn: "bg-orange-400",
    oklch: "oklch(.75 .183 55.934)",
  },
  "Loisirs & Sorties": {
    cn: "bg-yellow-400",
    oklch: "oklch(.852 .199 91.936)",
  },
  "Virement interne": { cn: "bg-sky-400", oklch: "oklch(.746 .16 232.661)" },
  "Scolarité & Enfants": {
    cn: "bg-rose-400",
    oklch: "oklch(.712 .194 13.428)",
  },
};
