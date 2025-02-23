"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HandCoinsIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/types/routes";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="grid gap-y-3 py-4">
        <li>
          <Link
            href={ROUTES.DASHBOARD}
            className={buttonVariants({
              variant: ROUTES.DASHBOARD === pathname ? "default" : "outline",
            })}
          >
            <LayoutDashboardIcon />
            <span className={cn(ROUTES.DASHBOARD === pathname && "font-bold")}>
              Dashboard
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={ROUTES.ACCOUNTS}
            className={buttonVariants({
              variant: pathname.includes(ROUTES.ACCOUNTS)
                ? "default"
                : "outline",
            })}
          >
            <LandmarkIcon />
            <span
              className={cn(pathname.includes(ROUTES.ACCOUNTS) && "font-bold")}
            >
              Mes comptes
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={ROUTES.BUDGET}
            className={buttonVariants({
              variant: ROUTES.BUDGET === pathname ? "default" : "outline",
            })}
          >
            <HandCoinsIcon />
            <span className={cn(ROUTES.BUDGET === pathname && "font-bold")}>
              Gestion de budget
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={ROUTES.SETTINGS}
            className={buttonVariants({
              variant: ROUTES.SETTINGS === pathname ? "default" : "outline",
            })}
          >
            <SettingsIcon />
            <span className={cn(ROUTES.SETTINGS === pathname && "font-bold")}>
              Paramètres
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
