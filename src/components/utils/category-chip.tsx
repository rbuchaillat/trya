"use client";

import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import { removeTransactionCategory } from "@/features/transaction/transaction.action";
import { COLORS } from "@/features/category/category.constant";
import { CategoryCommand } from "./category-command";
import { getCategories } from "@/features/category/category.action";

export const CategoryChip = ({
  label,
  transactionId,
}: {
  label?: string;
  transactionId: string;
}) => {
  if (!label) {
    return <AddCategoryButton transactionId={transactionId} />;
  }

  const handleClick = async () => {
    await removeTransactionCategory(transactionId);
  };

  return (
    <div className="group/chip max-w-48 w-fit shadow-[0_0_6px_#47638840] p-1 bg-white uppercase text-xs h-6 flex gap-x-1 items-center rounded-full">
      <div
        className={cn(
          "size-4 rounded-full text-10 text-white flex items-center justify-center shrink-0 font-black",
          COLORS[label].cn
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

const AddCategoryButton = ({ transactionId }: { transactionId: string }) => {
  const categoryCommandRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      categoryCommandRef.current &&
      !categoryCommandRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  const handleClick = () => setOpen(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const categories = await getCategories();
        setCategories(categories);
      };
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={cn("relative", { "h-6": open })}>
      {!open && (
        <button
          className="cursor-pointer hidden w-fit shadow-[0_0_6px_#47638840] p-1 bg-green-400 text-xs h-6 group-hover/transaction:flex gap-x-1 items-center rounded-full"
          onClick={() => setOpen(true)}
        >
          <div className="size-4 rounded-full text-base text-green-400 bg-white flex items-center justify-center shrink-0 font-bold">
            +
          </div>
          <span className="text-white font-bold">Ajouter une catégorie</span>
        </button>
      )}

      {open && (
        <div ref={categoryCommandRef} className="absolute">
          <CategoryCommand
            categories={categories}
            transactionId={transactionId}
            onClick={handleClick}
          />
        </div>
      )}

      {!open && (
        <div className="text-slate-400 italic group-hover/transaction:hidden">
          Ajouter une catégorie...
        </div>
      )}
    </div>
  );
};
