import { CalendarNavigation } from "./_components/calendar-navigation";
import { CategoryList } from "./_components/category-list";

export default function Budget() {
  return (
    <div className="p-4 flex flex-col gap-y-5">
      <h1>Mon budget</h1>
      <CalendarNavigation />
      <CategoryList />
    </div>
  );
}
