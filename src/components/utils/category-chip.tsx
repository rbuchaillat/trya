"use client";

import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeTransitionCategory } from "@/features/category/category.action";

const colors: Record<string, string> = {
  "Abonnements - Autres": "bg-orange-400",
  Internet: "bg-orange-400",
  "Téléphone mobile": "bg-orange-400",
  Multimédia: "bg-orange-400",

  "Achats & Shopping - Autres": "bg-red-400",
  Cadeaux: "bg-red-400",
  "High Tech": "bg-red-400",
  Musique: "bg-red-400",
  "Vêtements / Chaussures": "bg-red-400",

  "Alimentation - Autres": "bg-amber-400",
  Café: "bg-amber-400",
  "Fast Foods": "bg-amber-400",
  Restaurants: "bg-amber-400",
  "Supermarché / Épicerie": "bg-amber-400",

  "Assurance véhicule": "bg-blue-400",
  "Auto & Transports - Autres": "bg-blue-400",
  "Billets d'avion": "bg-blue-400",
  "Billets de train": "bg-blue-400",
  Carburant: "bg-blue-400",
  "Entretien véhicule": "bg-blue-400",
  "Location de véhicule": "bg-blue-400",
  Péage: "bg-blue-400",
  Stationnement: "bg-blue-400",
  "Transport en commun": "bg-blue-400",

  "Banque - Autres": "bg-indigo-400",
  "Débit mensuel carte": "bg-indigo-400",
  Epargne: "bg-indigo-400",
  "Frais bancaires": "bg-indigo-400",
  Hypothèque: "bg-indigo-400",
  "Incidents de paiement": "bg-indigo-400",
  "Remboursement emprunt": "bg-indigo-400",
  "Services bancaires": "bg-indigo-400",

  "A catégoriser": "bg-slate-400",
  Assurance: "bg-slate-400",
  "Autres dépenses": "bg-slate-400",
  Dons: "bg-slate-400",
  Pressing: "bg-slate-400",
  Tabac: "bg-slate-400",

  Coiffeur: "bg-pink-400",
  Cosmétique: "bg-pink-400",
  Esthétique: "bg-pink-400",
  "Esthétique & Soins - Autres": "bg-pink-400",
  "Spa & Massage": "bg-pink-400",

  Amendes: "bg-green-400",
  "Impôts & Taxes - Autres": "bg-green-400",
  "Impôts fonciers": "bg-green-400",
  "Impôts sur le revenu": "bg-green-400",
  Taxes: "bg-green-400",

  "Assurance habitation": "bg-stone-400",
  "Charges diverses": "bg-stone-400",
  Décoration: "bg-stone-400",
  Eau: "bg-stone-400",
  Electricité: "bg-stone-400",
  Entretien: "bg-stone-400",
  "Extérieur et jardin": "bg-stone-400",
  Gaz: "bg-stone-400",
  "Logement - Autres": "bg-stone-400",
  Loyer: "bg-stone-400",

  "Bars / Clubs": "bg-yellow-400",
  Divertissements: "bg-yellow-400",
  "Frais Animaux": "bg-yellow-400",
  Hobbies: "bg-yellow-400",
  Hôtels: "bg-yellow-400",
  "Loisirs & Sorties - Autres": "bg-yellow-400",
  Sport: "bg-yellow-400",
  "Voyages / Vacances": "bg-yellow-400",

  Chèques: "bg-neutral-400",
  Retraits: "bg-neutral-400",
  Virements: "bg-neutral-400",
  "Virements internes": "bg-neutral-400",

  Dentiste: "bg-teal-400",
  Médecin: "bg-teal-400",
  Mutuelle: "bg-teal-400",
  "Opticien / Ophtalmo.": "bg-teal-400",
  Pharmacie: "bg-teal-400",
  "Santé - Autres": "bg-teal-400",

  "Baby-sitters & Crèches": "bg-rose-400",
  Ecole: "bg-rose-400",
  "Fournitures scolaires": "bg-rose-400",
  Jouets: "bg-rose-400",
  "Logement étudiant": "bg-rose-400",
  Pensions: "bg-rose-400",
  "Prêt étudiant": "bg-rose-400",
  "Scolarité & Enfants - Autres": "bg-rose-400",
};

export const CategoryChip = ({ label, id }: { label?: string; id: number }) => {
  if (!label) {
    const handleClick = async () => {
      console.log("handleClick");
    };

    return (
      <div>
        <button
          className="cursor-pointer hidden w-fit shadow-[0_0_6px_#47638840] p-1 bg-green-400 text-xs h-6 group-hover/transaction:flex gap-x-1 items-center rounded-full"
          onClick={handleClick}
        >
          <div className="size-4 rounded-full text-base text-green-400 bg-white flex items-center justify-center shrink-0 font-bold">
            +
          </div>
          <span className="text-white font-bold">Ajouter une catégorie</span>
        </button>
        <div className="text-slate-400 italic group-hover/transaction:hidden">
          Ajouter une catégorie...
        </div>
      </div>
    );
  }

  const handleClick = async () => {
    await removeTransitionCategory(id);
  };

  return (
    <div className="group/chip max-w-48 w-fit shadow-[0_0_6px_#47638840] p-1 bg-white uppercase text-xs h-6 flex gap-x-1 items-center rounded-full">
      <div
        className={cn(
          "size-4 rounded-full text-10 text-white flex items-center justify-center shrink-0 font-black",
          colors[label]
        )}
      >
        {label.charAt(0)}
      </div>
      <span className="line-clamp-1 text-slate-600 font-semibold">{label}</span>
      <button
        className="cursor-pointer size-3.5 bg-slate-100 rounded-full flex items-center justify-center opacity-0 group-hover/chip:opacity-100 transition-opacity duration-75"
        onClick={handleClick}
      >
        <XIcon
          width={10}
          height={10}
          strokeWidth={4}
          className="text-slate-400"
        />
      </button>
    </div>
  );
};
