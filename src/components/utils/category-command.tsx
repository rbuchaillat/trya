import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import { COLORS } from "@/features/category/category.constant";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addTransactionCategory } from "@/features/transaction/transaction.action";

export function CategoryCommand({
  categories,
  transactionId,
  onClick,
}: {
  categories: Category[];
  transactionId: string;
  onClick?: () => void;
}) {
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[325px] relative z-10">
      <CommandInput placeholder="Rechercher une catégorie..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {categories.map((category) => {
          return (
            <CommandItem key={category.id}>
              <div
                className="flex gap-2 w-full"
                onClick={async () => {
                  await addTransactionCategory(transactionId, category.id);
                  onClick?.();
                }}
              >
                <div
                  className={cn(
                    "size-4 rounded-full text-10 text-white flex items-center justify-center shrink-0 font-black",
                    COLORS[category.name].cn
                  )}
                >
                  {category.name.charAt(0)}
                </div>
                <span>{category.name}</span>
              </div>
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
}
