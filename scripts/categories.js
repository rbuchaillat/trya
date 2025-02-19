import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Abonnements" },
    { name: "Internet / Téléphone mobile" },
    { name: "Achats & Shopping" },
    { name: "Alimentation" },
    { name: "Restaurant" },
    { name: "Auto & Transports" },
    { name: "Divers" },
    { name: "Esthétique & Soins" },
    { name: "Impôts & Taxes" },
    { name: "Logement" },
    { name: "Loisirs & Sorties" },
    { name: "Santé" },
    { name: "Scolarité & Enfants" },
    { name: "Voyages" },
    { name: "Revenus" },
    { name: "Épargne et investissements" },
    { name: "Dons et charité" },
    { name: "Imprévus" },
  ];

  await prisma.category.createMany({
    data: categories,
  });

  console.log("Données insérées avec succès!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
