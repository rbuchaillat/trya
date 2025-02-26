import { CalendarNavigation } from "@/components/utils/calendar-navigation";
import { DistributionList } from "./_components/distribution-list";

export default function Warren() {
  return (
    <section className="p-4 flex flex-col gap-y-5">
      <h1>
        Méthode 50/30/20{" "}
        <span className="text-xs text-slate-400">
          (données pertinentes une fois le mois écoulé, permettant une analyse
          complète des dépenses)
        </span>
      </h1>
      <CalendarNavigation
        date={new Date(new Date().getFullYear(), new Date().getMonth() - 1)}
      />
      <DistributionList />
    </section>
  );
}
