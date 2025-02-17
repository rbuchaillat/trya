"use server";

import { prisma } from "@/lib/prisma";

export const getCategoryGroupsWithCategories = async () => {
  const categoryGroup = await prisma.categoryGroup.findMany({
    include: {
      categories: true,
    },
  });
  return categoryGroup;
};
