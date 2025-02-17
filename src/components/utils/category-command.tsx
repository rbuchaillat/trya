import { Category, CategoryGroup } from "@prisma/client";
import { cn } from "@/lib/utils";
import { COLORS } from "@/features/category/category.constant";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addTransitionCategory } from "@/features/transaction/transaction.action";

export function CategoryCommand({
  categoryGroups,
  transactionId,
  onClick,
}: {
  categoryGroups: (CategoryGroup & { categories: Category[] })[];
  transactionId: number;
  onClick?: () => void;
}) {
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[325px]">
      <CommandInput placeholder="Rechercher une catégorie..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {categoryGroups.map((categoryGroup) => {
          return (
            <CommandGroup key={categoryGroup.id} heading={categoryGroup.name}>
              {categoryGroup.categories.map((category) => {
                return (
                  <CommandItem key={category.id}>
                    <div
                      className="flex gap-2 w-full"
                      onClick={async () => {
                        await addTransitionCategory(transactionId, category.id);
                        onClick?.();
                      }}
                    >
                      <div
                        className={cn(
                          "size-4 rounded-full text-10 text-white flex items-center justify-center shrink-0 font-black",
                          COLORS[category.name]
                        )}
                      >
                        {category.name.charAt(0)}
                      </div>
                      <span>{category.name}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
      </CommandList>
    </Command>
  );
}
