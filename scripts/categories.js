import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categoryGroups = [
    {
      name: "Abonnements",
      categories: [
        "Abonnements - Autres",
        "Internet",
        "Téléphone mobile",
        "Multimédia",
      ],
    },
    {
      name: "Achats & Shopping",
      categories: [
        "Achats & Shopping - Autres",
        "Cadeaux",
        "High Tech",
        "Musique",
        "Vêtements / Chaussures",
      ],
    },
    {
      name: "Alimentation & Restaurant",
      categories: [
        "Alimentation - Autres",
        "Café",
        "Fast Foods",
        "Restaurants",
        "Supermarché / Épicerie",
      ],
    },
    {
      name: "Auto & Transports",
      categories: [
        "Assurance véhicule",
        "Auto & Transports - Autres",
        "Billets d'avion",
        "Billets de train",
        "Carburant",
        "Entretien véhicule",
        "Location de véhicule",
        "Péage",
        "Stationnement",
        "Transport en commun",
      ],
    },
    {
      name: "Banque",
      categories: [
        "Banque - Autres",
        "Débit mensuel carte",
        "Epargne",
        "Frais bancaires",
        "Hypothèque",
        "Incidents de paiement",
        "Remboursement emprunt",
        "Services bancaires",
      ],
    },
    {
      name: "Divers",
      categories: [
        "A catégoriser",
        "Assurance",
        "Autres dépenses",
        "Dons",
        "Pressing",
        "Tabac",
      ],
    },
    {
      name: "Esthétique & Soins",
      categories: [
        "Coiffeur",
        "Cosmétique",
        "Esthétique",
        "Esthétique & Soins - Autres",
        "Spa & Massage",
      ],
    },
    {
      name: "Impôts & Taxes",
      categories: [
        "Amendes",
        "Impôts & Taxes - Autres",
        "Impôts fonciers",
        "Impôts sur le revenu",
        "Taxes",
      ],
    },
    {
      name: "Logement",
      categories: [
        "Assurance habitation",
        "Charges diverses",
        "Décoration",
        "Eau",
        "Electricité",
        "Entretien",
        "Extérieur et jardin",
        "Gaz",
        "Logement - Autres",
        "Loyer",
      ],
    },
    {
      name: "Loisirs & Sorties",
      categories: [
        "Bars / Clubs",
        "Divertissements",
        "Frais Animaux",
        "Hobbies",
        "Hôtels",
        "Loisirs & Sorties - Autres",
        "Sport",
        "Voyages / Vacances",
      ],
    },
    {
      name: "Retraits, Chèques & Virements",
      categories: ["Chèques", "Retraits", "Virements", "Virements internes"],
    },
    {
      name: "Santé",
      categories: [
        "Dentiste",
        "Médecin",
        "Mutuelle",
        "Opticien / Ophtalmo.",
        "Pharmacie",
        "Santé - Autres",
      ],
    },
    {
      name: "Scolarité & Enfants",
      categories: [
        "Baby-sitters & Crèches",
        "Ecole",
        "Fournitures scolaires",
        "Jouets",
        "Logement étudiant",
        "Pensions",
        "Prêt étudiant",
        "Scolarité & Enfants - Autres",
      ],
    },
  ];

  for (const group of categoryGroups) {
    const createdCategoryGroup = await prisma.categoryGroup.create({
      data: {
        name: group.name,
        categories: {
          create: group.categories.map((categoryName) => ({
            name: categoryName,
          })),
        },
      },
    });
    console.log(
      `CategoryGroup '${createdCategoryGroup.name}' créé avec succès.`
    );
  }

  console.log("Données insérées avec succès!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
