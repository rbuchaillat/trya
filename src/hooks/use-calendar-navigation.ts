import { parseAsInteger, useQueryState } from "nuqs";

const TODAY = new Date();

export function useCalendarNavigation() {
  const [year, setYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(TODAY.getFullYear()).withOptions({
      clearOnDefault: false,
    })
  );
  const [month, setMonth] = useQueryState(
    "month",
    parseAsInteger.withDefault(TODAY.getMonth() + 1).withOptions({
      clearOnDefault: false,
    })
  );

  const isNextMonthDisabled =
    year >= TODAY.getFullYear() && month >= TODAY.getMonth() + 1;

  const previousMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
      return;
    }
    setMonth((m) => m - 1);
    // Allows adding the year to the URL by default.
    setYear((y) => y);
  };

  const nextMonth = () => {
    if (isNextMonthDisabled) return;

    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
      return;
    }
    setMonth((m) => m + 1);
  };

  return { year, month, isNextMonthDisabled, previousMonth, nextMonth };
}
